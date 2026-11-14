use near_sdk::json_types::U128;
use near_sdk::{
    env, near, AccountId, Gas, NearToken, Promise,
};
use std::collections::HashMap;

use crate::nft_core::emit_nft_mint_event;
use crate::{
    ActiveRental, JsonToken, RagaAgentMetadata, RagaTokenBound,
    RagaTokenBoundExt, TokenId, TokenMetadata,
};

#[near]
impl RagaTokenBound {
    // ------------------------------------------------------------------------
    // MINT & AGENT INITIALIZATION
    // ------------------------------------------------------------------------

    #[payable]
    pub fn mint_agent(
        &mut self,
        token_id: TokenId,
        name: String,
        capability: String,
        rental_rate_per_sec: U128,
        metadata: Option<TokenMetadata>,
    ) -> JsonToken {
        let caller = env::predecessor_account_id();

        if self.tokens.contains_key(&token_id) {
            env::panic_str("Agent with this token_id already exists");
        }

        // Sub-account derivation: {token_id}.{contract_id}
        let bound_subaccount: AccountId = format!("{}.{}", token_id, env::current_account_id())
            .parse()
            .unwrap_or_else(|_| env::panic_str("Failed to derive valid sub-account identifier"));

        let initial_metadata = metadata.or_else(|| {
            Some(TokenMetadata {
                title: Some(name.clone()),
                description: Some(format!(
                    "RAGA Autonomous AI Worker [{}]. Bound to {}",
                    capability, bound_subaccount
                )),
                media: None,
                media_hash: None,
                copies: Some(1),
                issued_at: Some(env::block_timestamp().to_string()),
                expires_at: None,
                starts_at: Some(env::block_timestamp().to_string()),
                updated_at: Some(env::block_timestamp().to_string()),
                extra: Some(serde_json::json!({
                    "capability": capability,
                    "bound_subaccount": bound_subaccount.to_string(),
                    "version": "1.0.0"
                }).to_string()),
                reference: None,
                reference_hash: None,
            })
        });

        let agent = RagaAgentMetadata {
            token_id: token_id.clone(),
            owner_id: caller.clone(),
            name,
            capability,
            bound_subaccount: bound_subaccount.clone(),
            created_at: env::block_timestamp(),
            rental_rate_per_sec,
            total_revenue_accumulated: U128(0),
            unclaimed_revenue: U128(0),
            tasks_completed: 0,
            reputation_score: 100,
            current_status: "Idle".to_string(),
            metadata: initial_metadata,
            approvals: HashMap::new(),
            next_approval_id: 1,
        };

        self.tokens.insert(token_id.clone(), agent);
        self.token_list.push(token_id.clone());
        self.internal_add_token_to_owner(&caller, &token_id);

        emit_nft_mint_event(&token_id, &caller);

        let event = serde_json::json!({
            "standard": "raga",
            "version": "1.0.0",
            "event": "agent_registered",
            "data": [{
                "token_id": token_id,
                "owner_id": caller.to_string(),
                "bound_subaccount": bound_subaccount.to_string(),
                "rental_rate_per_sec": rental_rate_per_sec
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));

        self.get_agent(token_id).unwrap()
    }

    // ------------------------------------------------------------------------
    // TIME-LOCKED RENTAL MECHANICS
    // ------------------------------------------------------------------------

    #[payable]
    pub fn rent_agent(&mut self, token_id: TokenId, duration_sec: u64) {
        assert!(duration_sec > 0, "Duration must be greater than zero");
        let caller = env::predecessor_account_id();
        let attached = env::attached_deposit();

        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Agent token not found"));

        // Check if currently locked in an active rental
        if self.is_active_rental(&token_id) {
            let active = self.rentals.get(&token_id).unwrap();
            env::panic_str(&format!(
                "Agent is currently rented to {} until timestamp {} ns",
                active.renter_id, active.expires_at
            ));
        }

        // Calculate rental cost
        let rate = agent.rental_rate_per_sec.0;
        let required_cost_yocto = rate.saturating_mul(duration_sec as u128);
        let required_token = NearToken::from_yoctonear(required_cost_yocto);

        if attached < required_token {
            env::panic_str(&format!(
                "Insufficient deposit: required {} yoctoNEAR, attached {}",
                required_cost_yocto, attached.as_yoctonear()
            ));
        }

        let now_ns = env::block_timestamp();
        let duration_ns = duration_sec
            .checked_mul(1_000_000_000)
            .expect("Duration overflow");
        let expires_at = now_ns + duration_ns;

        // Store active rental with time-lock
        self.rentals.insert(
            token_id.clone(),
            ActiveRental {
                renter_id: caller.clone(),
                expires_at,
            },
        );

        // Route rental fee to agent's accumulated & unclaimed revenue for token owner
        agent.total_revenue_accumulated =
            U128(agent.total_revenue_accumulated.0 + required_cost_yocto);
        agent.unclaimed_revenue = U128(agent.unclaimed_revenue.0 + required_cost_yocto);
        agent.current_status = "Rented".to_string();

        self.tokens.insert(token_id.clone(), agent);

        // Refund any excess deposit back to the renter
        if attached > required_token {
            let refund_amount = attached.saturating_sub(required_token);
            let _ = Promise::new(caller.clone()).transfer(refund_amount);
        }

        let event = serde_json::json!({
            "standard": "raga",
            "version": "1.0.0",
            "event": "agent_rented",
            "data": [{
                "token_id": token_id,
                "renter_id": caller.to_string(),
                "duration_sec": duration_sec,
                "expires_at": expires_at,
                "fee_paid": required_cost_yocto.to_string()
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));
    }

    // ------------------------------------------------------------------------
    // TOKEN-BOUND SUB-ACCOUNT DISPATCH & DELEGATION EXECUTION
    // ------------------------------------------------------------------------

    pub fn execute_as_agent(
        &mut self,
        token_id: TokenId,
        target_account_id: AccountId,
        method_name: String,
        args: Vec<u8>,
        deposit: U128,
        gas: Gas,
    ) -> Promise {
        let caller = env::predecessor_account_id();
        let effective_operator = self.get_effective_operator(&token_id);

        if caller != effective_operator {
            env::panic_str(&format!(
                "Unauthorized: caller {} is neither owner nor active renter of agent {}. Current operator is {}",
                caller, token_id, effective_operator
            ));
        }

        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Agent token not found"));

        // Dynamic NFT progression: Increment completed tasks and boost reputation
        agent.tasks_completed += 1;
        agent.reputation_score = std::cmp::min(1000, agent.reputation_score + 10);
        if agent.current_status != "Rented" {
            agent.current_status = "Active".to_string();
        }
        self.tokens.insert(token_id.clone(), agent.clone());

        let event = serde_json::json!({
            "standard": "raga",
            "version": "1.0.0",
            "event": "agent_executed_action",
            "data": [{
                "token_id": token_id,
                "operator": caller.to_string(),
                "target_account_id": target_account_id.to_string(),
                "method_name": method_name,
                "deposit": deposit.0.to_string(),
                "bound_subaccount": agent.bound_subaccount.to_string()
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));

        // The NFT smart contract is the sole authority for bound sub-accounts
        // Dispatch function call to target account
        Promise::new(target_account_id).function_call(
            method_name,
            args,
            NearToken::from_yoctonear(deposit.0),
            gas,
        )
    }

    // ------------------------------------------------------------------------
    // CREATE BOUND SUB-ACCOUNT ON NEAR PROTOCOL
    // ------------------------------------------------------------------------

    #[payable]
    pub fn create_bound_subaccount(&mut self, token_id: TokenId) -> Promise {
        let caller = env::predecessor_account_id();
        let agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Agent token not found"));

        // Only owner can initialize the physical sub-account creation on chain
        if caller != agent.owner_id && caller != env::current_account_id() {
            env::panic_str("Only agent owner can initialize on-chain sub-account creation");
        }

        let attached = env::attached_deposit();
        if attached < NearToken::from_millinear(50) {
            env::panic_str("Attached deposit must be at least 0.05 NEAR for sub-account creation");
        }

        let bound_subaccount: AccountId = format!("{}.{}", token_id, env::current_account_id())
            .parse()
            .unwrap_or_else(|_| env::panic_str("Invalid sub-account ID"));

        let event = serde_json::json!({
            "standard": "raga",
            "version": "1.0.0",
            "event": "subaccount_created",
            "data": [{
                "token_id": token_id,
                "subaccount_id": bound_subaccount.to_string(),
                "funding": attached.as_yoctonear().to_string()
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));

        // Sole authority: parent contract creates sub-account without external private keys
        Promise::new(bound_subaccount)
            .create_account()
            .transfer(attached)
    }

    // ------------------------------------------------------------------------
    // REVENUE ROUTING & TASK COMPLETION
    // ------------------------------------------------------------------------

    pub fn complete_agent_task(
        &mut self,
        token_id: TokenId,
        task_id: String,
        task_type: String,
        reward_earned: U128,
        proof_hash: String,
    ) {
        let caller = env::predecessor_account_id();
        let effective_operator = self.get_effective_operator(&token_id);

        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Agent token not found"));

        // Caller must be effective operator or owner or contract admin
        if caller != effective_operator && caller != agent.owner_id && caller != env::current_account_id() {
            env::panic_str("Unauthorized: caller cannot submit task completion for this agent");
        }

        // Dynamic updates
        agent.tasks_completed += 1;
        agent.reputation_score = std::cmp::min(1000, agent.reputation_score + 15);
        agent.total_revenue_accumulated =
            U128(agent.total_revenue_accumulated.0 + reward_earned.0);
        agent.unclaimed_revenue = U128(agent.unclaimed_revenue.0 + reward_earned.0);

        self.tokens.insert(token_id.clone(), agent.clone());

        let event = serde_json::json!({
            "standard": "raga",
            "version": "1.0.0",
            "event": "agent_task_completed",
            "data": [{
                "token_id": token_id,
                "task_id": task_id,
                "task_type": task_type,
                "reward_earned": reward_earned.0.to_string(),
                "proof_hash": proof_hash,
                "tasks_completed": agent.tasks_completed,
                "total_revenue": agent.total_revenue_accumulated.0.to_string(),
                "reputation_score": agent.reputation_score
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));
    }

    pub fn claim_agent_revenue(&mut self, token_id: TokenId) -> Promise {
        let caller = env::predecessor_account_id();
        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Agent token not found"));

        // Only the NFT owner receives the yield/earnings of the agent
        if caller != agent.owner_id {
            env::panic_str("Only the agent NFT owner can claim accumulated revenue");
        }

        let claim_amount = agent.unclaimed_revenue.0;
        if claim_amount == 0 {
            env::panic_str("No revenue available to claim");
        }

        agent.unclaimed_revenue = U128(0);
        self.tokens.insert(token_id.clone(), agent);

        let event = serde_json::json!({
            "standard": "raga",
            "version": "1.0.0",
            "event": "agent_revenue_claimed",
            "data": [{
                "token_id": token_id,
                "recipient": caller.to_string(),
                "amount": claim_amount.to_string()
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));

        Promise::new(caller).transfer(NearToken::from_yoctonear(claim_amount))
    }

    // ------------------------------------------------------------------------
    // BURN RESTRICTION
    // ------------------------------------------------------------------------

    pub fn burn_agent(&mut self, token_id: TokenId) {
        let caller = env::predecessor_account_id();

        // Enforce time-locked rental constraint: cannot burn rented worker
        if self.is_active_rental(&token_id) {
            let active = self.rentals.get(&token_id).unwrap();
            env::panic_str(&format!(
                "Cannot burn: agent {} is locked in active rental until timestamp {} ns",
                token_id, active.expires_at
            ));
        }

        let agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Agent token not found"));

        if caller != agent.owner_id && caller != env::current_account_id() {
            env::panic_str("Only the agent owner or contract admin can burn the token");
        }

        self.internal_remove_token_from_owner(&agent.owner_id, &token_id);
        self.tokens.remove(&token_id);
        self.rentals.remove(&token_id);

        let event = serde_json::json!({
            "standard": "nep171",
            "version": "1.0.0",
            "event": "nft_burn",
            "data": [{
                "owner_id": caller.to_string(),
                "token_ids": [token_id]
            }]
        });
        env::log_str(&format!("EVENT_JSON:{}", event));
    }

    // ------------------------------------------------------------------------
    // OPERATOR & RENTAL INSPECTION VIEWS
    // ------------------------------------------------------------------------

    pub fn is_active_rental(&self, token_id: &TokenId) -> bool {
        if let Some(rental) = self.rentals.get(token_id) {
            env::block_timestamp() < rental.expires_at
        } else {
            false
        }
    }

    pub fn get_effective_operator(&self, token_id: &TokenId) -> AccountId {
        if let Some(rental) = self.rentals.get(token_id) {
            if env::block_timestamp() < rental.expires_at {
                return rental.renter_id.clone();
            }
        }
        let agent = self
            .tokens
            .get(token_id)
            .unwrap_or_else(|| env::panic_str("Agent token not found"));
        agent.owner_id.clone()
    }

    pub fn get_agent(&self, token_id: TokenId) -> Option<JsonToken> {
        let agent = self.tokens.get(&token_id)?;
        let active_rental = self.rentals.get(&token_id);

        let (is_rented, effective_operator, rental_expires_at) = match active_rental {
            Some(rental) if env::block_timestamp() < rental.expires_at => {
                (true, rental.renter_id.clone(), Some(rental.expires_at))
            }
            _ => (false, agent.owner_id.clone(), None),
        };

        let current_status = if is_rented {
            "Rented".to_string()
        } else {
            agent.current_status.clone()
        };

        Some(JsonToken {
            token_id: agent.token_id.clone(),
            owner_id: agent.owner_id.clone(),
            metadata: agent.metadata.clone(),
            approved_account_ids: if agent.approvals.is_empty() {
                None
            } else {
                Some(agent.approvals.clone())
            },
            bound_subaccount: agent.bound_subaccount.clone(),
            active_rental: if is_rented {
                active_rental.cloned()
            } else {
                None
            },
            is_rented,
            effective_operator,
            rental_rate_per_sec: agent.rental_rate_per_sec,
            total_revenue_accumulated: agent.total_revenue_accumulated,
            unclaimed_revenue: agent.unclaimed_revenue,
            tasks_completed: agent.tasks_completed,
            reputation_score: agent.reputation_score,
            current_status,
            rental_expires_at,
        })
    }

    pub fn get_rental(&self, token_id: TokenId) -> Option<ActiveRental> {
        let rental = self.rentals.get(&token_id)?;
        if env::block_timestamp() < rental.expires_at {
            Some(rental.clone())
        } else {
            None
        }
    }

    pub fn get_bound_subaccount(&self, token_id: TokenId) -> Option<AccountId> {
        self.tokens.get(&token_id).map(|a| a.bound_subaccount.clone())
    }
}
