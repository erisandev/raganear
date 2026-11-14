use near_sdk::json_types::U128;
use near_sdk::store::{LazyOption, LookupMap, Vector};
use near_sdk::{near, AccountId, BorshStorageKey, PanicOnDefault};
use std::collections::HashMap;

pub mod nft_core;
pub mod token_bound;

pub type TokenId = String;

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct NFTContractMetadata {
    pub spec: String,
    pub name: String,
    pub symbol: String,
    pub icon: Option<String>,
    pub base_uri: Option<String>,
    pub reference: Option<String>,
    pub reference_hash: Option<near_sdk::json_types::Base64VecU8>,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TokenMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub media: Option<String>,
    pub media_hash: Option<near_sdk::json_types::Base64VecU8>,
    pub copies: Option<u64>,
    pub issued_at: Option<String>,
    pub expires_at: Option<String>,
    pub starts_at: Option<String>,
    pub updated_at: Option<String>,
    pub extra: Option<String>,
    pub reference: Option<String>,
    pub reference_hash: Option<near_sdk::json_types::Base64VecU8>,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct ActiveRental {
    pub renter_id: AccountId,
    pub expires_at: u64,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct RagaAgentMetadata {
    pub token_id: TokenId,
    pub owner_id: AccountId,
    pub name: String,
    pub capability: String,
    pub bound_subaccount: AccountId,
    pub created_at: u64,
    pub rental_rate_per_sec: U128,
    pub total_revenue_accumulated: U128,
    pub unclaimed_revenue: U128,
    pub tasks_completed: u64,
    pub reputation_score: u32,
    pub current_status: String,
    pub metadata: Option<TokenMetadata>,
    pub approvals: HashMap<AccountId, u64>,
    pub next_approval_id: u64,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct JsonToken {
    pub token_id: TokenId,
    pub owner_id: AccountId,
    pub metadata: Option<TokenMetadata>,
    pub approved_account_ids: Option<HashMap<AccountId, u64>>,
    pub bound_subaccount: AccountId,
    pub active_rental: Option<ActiveRental>,
    pub is_rented: bool,
    pub effective_operator: AccountId,
    pub rental_rate_per_sec: U128,
    pub total_revenue_accumulated: U128,
    pub unclaimed_revenue: U128,
    pub tasks_completed: u64,
    pub reputation_score: u32,
    pub current_status: String,
    pub rental_expires_at: Option<u64>,
}

#[near]
#[derive(BorshStorageKey)]
pub enum StorageKey {
    Tokens,
    Rentals,
    TokenList,
    TokensPerOwner,
    Metadata,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct RagaTokenBound {
    pub owner_id: AccountId,
    pub metadata: LazyOption<NFTContractMetadata>,
    pub tokens: LookupMap<TokenId, RagaAgentMetadata>,
    pub rentals: LookupMap<TokenId, ActiveRental>,
    pub token_list: Vector<TokenId>,
    pub tokens_per_owner: LookupMap<AccountId, Vec<TokenId>>,
}

#[near]
impl RagaTokenBound {
    #[init]
    pub fn new(owner_id: AccountId, metadata: Option<NFTContractMetadata>) -> Self {
        let meta = metadata.unwrap_or_else(|| NFTContractMetadata {
            spec: "nft-1.0.0".to_string(),
            name: "RAGA Autonomous AI Agents".to_string(),
            symbol: "RAGA".to_string(),
            icon: Some("data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=".to_string()),
            base_uri: None,
            reference: None,
            reference_hash: None,
        });

        Self {
            owner_id,
            metadata: LazyOption::new(StorageKey::Metadata, Some(meta)),
            tokens: LookupMap::new(StorageKey::Tokens),
            rentals: LookupMap::new(StorageKey::Rentals),
            token_list: Vector::new(StorageKey::TokenList),
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner),
        }
    }

    // Contract admin view
    pub fn get_contract_owner(&self) -> AccountId {
        self.owner_id.clone()
    }
}

// Internal helpers for indexing owner tokens
impl RagaTokenBound {
    pub(crate) fn internal_add_token_to_owner(
        &mut self,
        account_id: &AccountId,
        token_id: &TokenId,
    ) {
        let mut tokens = self
            .tokens_per_owner
            .get(account_id)
            .cloned()
            .unwrap_or_default();
        if !tokens.contains(token_id) {
            tokens.push(token_id.clone());
        }
        self.tokens_per_owner.insert(account_id.clone(), tokens);
    }

    pub(crate) fn internal_remove_token_from_owner(
        &mut self,
        account_id: &AccountId,
        token_id: &TokenId,
    ) {
        if let Some(mut tokens) = self.tokens_per_owner.get(account_id).cloned() {
            tokens.retain(|id| id != token_id);
            if tokens.is_empty() {
                self.tokens_per_owner.remove(account_id);
            } else {
                self.tokens_per_owner.insert(account_id.clone(), tokens);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;
    use near_sdk::NearToken;

    fn get_context(predecessor: AccountId, attached_deposit: NearToken, timestamp: u64) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id("raga.near".parse().unwrap())
            .signer_account_id(predecessor.clone())
            .predecessor_account_id(predecessor)
            .attached_deposit(attached_deposit)
            .block_timestamp(timestamp);
        builder
    }

    #[test]
    fn test_mint_and_subaccount_binding() {
        let alice = accounts(0);
        let ctx = get_context(alice.clone(), NearToken::from_near(0), 1_000_000_000);
        testing_env!(ctx.build());

        let mut contract = RagaTokenBound::new(alice.clone(), None);
        let token = contract.mint_agent(
            "agent-alpha".to_string(),
            "Sentient Alpha".to_string(),
            "DeFi Yield Arbitrageur".to_string(),
            U128(1_000_000), // 1M yocto/sec
            None,
        );

        assert_eq!(token.token_id, "agent-alpha");
        assert_eq!(token.owner_id, alice);
        assert_eq!(token.bound_subaccount.to_string(), "agent-alpha.raga.near");
        assert_eq!(token.current_status, "Idle");
        assert_eq!(token.tasks_completed, 0);
        assert_eq!(token.reputation_score, 100);
        assert!(!token.is_rented);
        assert_eq!(token.effective_operator, alice);
    }

    #[test]
    fn test_rental_flow_and_lock() {
        let alice = accounts(0); // owner
        let bob = accounts(1);   // renter
        let t0 = 1_000_000_000_000; // 1000s in nanos

        let ctx = get_context(alice.clone(), NearToken::from_near(0), t0);
        testing_env!(ctx.build());
        let mut contract = RagaTokenBound::new(alice.clone(), None);

        contract.mint_agent(
            "agent-worker-1".to_string(),
            "Sentinel Node".to_string(),
            "Autonomous Security Sentinel".to_string(),
            U128(100), // 100 yocto/sec
            None,
        );

        // Bob rents agent for 3600 seconds
        let duration = 3600u64;
        let required_fee = 3600u128 * 100u128; // 360,000 yoctoNEAR
        let ctx_bob = get_context(bob.clone(), NearToken::from_yoctonear(required_fee), t0);
        testing_env!(ctx_bob.build());

        contract.rent_agent("agent-worker-1".to_string(), duration);

        // During rental: Bob is effective operator
        let token_rented = contract.get_agent("agent-worker-1".to_string()).unwrap();
        assert!(token_rented.is_rented);
        assert_eq!(token_rented.effective_operator, bob);
        assert_eq!(token_rented.current_status, "Rented");
        assert_eq!(token_rented.total_revenue_accumulated.0, required_fee);
        assert_eq!(token_rented.unclaimed_revenue.0, required_fee);

        // Attempt transfer while rented: MUST FAIL
        let ctx_transfer = get_context(alice.clone(), NearToken::from_yoctonear(1), t0 + 100);
        testing_env!(ctx_transfer.build());

        let mut contract_ref = std::panic::AssertUnwindSafe(&mut contract);
        let result = std::panic::catch_unwind(move || {
            contract_ref.nft_transfer(accounts(2), "agent-worker-1".to_string(), None, None);
        });
        assert!(result.is_err(), "Transfer during active rental must panic");
    }

    #[test]
    fn test_rental_expiration_and_delegation() {
        let alice = accounts(0);
        let bob = accounts(1);
        let charlie = accounts(2);
        let t0 = 1_000_000_000_000;

        let ctx = get_context(alice.clone(), NearToken::from_near(0), t0);
        testing_env!(ctx.build());
        let mut contract = RagaTokenBound::new(alice.clone(), None);

        contract.mint_agent(
            "sentinel".to_string(),
            "Oracle Sentinel".to_string(),
            "Cross-chain State Prover".to_string(),
            U128(10),
            None,
        );

        // Bob rents for 100 seconds
        let duration = 100u64;
        let fee = 1000u128;
        let ctx_bob = get_context(bob.clone(), NearToken::from_yoctonear(fee), t0);
        testing_env!(ctx_bob.build());
        contract.rent_agent("sentinel".to_string(), duration);

        // During rental, non-renter Charlie cannot execute
        let ctx_charlie = get_context(charlie.clone(), NearToken::from_near(0), t0 + 10_000_000_000);
        testing_env!(ctx_charlie.build());
        {
            let mut contract_ref = std::panic::AssertUnwindSafe(&mut contract);
            let exec_charlie = std::panic::catch_unwind(move || {
                let _ = contract_ref.execute_as_agent(
                    "sentinel".to_string(),
                    "oracle.near".parse().unwrap(),
                    "report_price".to_string(),
                    vec![],
                    U128(0),
                    near_sdk::Gas::from_tgas(10),
                );
            });
            assert!(exec_charlie.is_err(), "Non-renter cannot execute as agent");
        }

        // After rental expires (t0 + 101s)
        let t_after = t0 + (101 * 1_000_000_000);
        let ctx_after = get_context(alice.clone(), NearToken::from_yoctonear(1), t_after);
        testing_env!(ctx_after.build());

        let token_after = contract.get_agent("sentinel".to_string()).unwrap();
        assert!(!token_after.is_rented);
        assert_eq!(token_after.effective_operator, alice);

        // Now Alice can transfer token
        contract.nft_transfer(charlie.clone(), "sentinel".to_string(), None, None);
        let token_transferred = contract.get_agent("sentinel".to_string()).unwrap();
        assert_eq!(token_transferred.owner_id, charlie);
        assert_eq!(token_transferred.effective_operator, charlie);
    }

    #[test]
    fn test_revenue_accumulation_and_claim() {
        let alice = accounts(0);
        let bob = accounts(1);
        let t0 = 1_000_000_000;

        let ctx = get_context(alice.clone(), NearToken::from_near(0), t0);
        testing_env!(ctx.build());
        let mut contract = RagaTokenBound::new(alice.clone(), None);

        contract.mint_agent(
            "worker-dex".to_string(),
            "DEX Arbiter".to_string(),
            "Automated Market Maker Operator".to_string(),
            U128(500),
            None,
        );

        // Worker daemon records completed task with 250,000 yocto reward
        contract.complete_agent_task(
            "worker-dex".to_string(),
            "task-001".to_string(),
            "ARBITRAGE_CYCLE".to_string(),
            U128(250_000),
            "0xdeadbeef1234".to_string(),
        );

        let token = contract.get_agent("worker-dex".to_string()).unwrap();
        assert_eq!(token.tasks_completed, 1);
        assert_eq!(token.reputation_score, 115);
        assert_eq!(token.total_revenue_accumulated.0, 250_000);
        assert_eq!(token.unclaimed_revenue.0, 250_000);

        // Bob (non-owner) tries to claim revenue: MUST FAIL
        let ctx_bob = get_context(bob.clone(), NearToken::from_near(0), t0 + 10);
        testing_env!(ctx_bob.build());
        {
            let mut contract_ref = std::panic::AssertUnwindSafe(&mut contract);
            let bob_claim = std::panic::catch_unwind(move || {
                let _ = contract_ref.claim_agent_revenue("worker-dex".to_string());
            });
            assert!(bob_claim.is_err(), "Non-owner cannot claim agent revenue");
        }

        // Alice (owner) claims revenue: SUCCESS
        let ctx_alice = get_context(alice.clone(), NearToken::from_near(0), t0 + 20);
        testing_env!(ctx_alice.build());
        let _ = contract.claim_agent_revenue("worker-dex".to_string());

        let token_claimed = contract.get_agent("worker-dex".to_string()).unwrap();
        assert_eq!(token_claimed.unclaimed_revenue.0, 0);
        assert_eq!(token_claimed.total_revenue_accumulated.0, 250_000); // lifetime preserved
    }
}
