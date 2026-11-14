use near_sdk::json_types::U128;
use near_sdk::{
    assert_one_yocto, env, ext_contract, near, AccountId, Gas, Promise,
    PromiseOrValue,
};
use std::collections::HashMap;

use crate::{JsonToken, NFTContractMetadata, RagaTokenBound, RagaTokenBoundExt, TokenId};

const GAS_FOR_RESOLVE_TRANSFER: Gas = Gas::from_tgas(10);
const GAS_FOR_NFT_ON_TRANSFER: Gas = Gas::from_tgas(35);

#[ext_contract(ext_nft_receiver)]
pub trait ExtNftReceiver {
    fn nft_on_transfer(
        &mut self,
        sender_id: AccountId,
        previous_owner_id: AccountId,
        token_id: TokenId,
        msg: String,
    ) -> PromiseOrValue<bool>;
}

#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn nft_resolve_transfer(
        &mut self,
        previous_owner_id: AccountId,
        receiver_id: AccountId,
        token_id: TokenId,
        approved_account_ids: Option<HashMap<AccountId, u64>>,
    ) -> bool;
}

pub fn emit_nft_mint_event(token_id: &str, recipient: &AccountId) {
    let event = serde_json::json!({
        "standard": "nep171",
        "version": "1.0.0",
        "event": "nft_mint",
        "data": [{
            "owner_id": recipient.to_string(),
            "token_ids": [token_id]
        }]
    });
    env::log_str(&format!("EVENT_JSON:{}", event));
}

pub fn emit_nft_transfer_event(
    token_id: &str,
    sender: &AccountId,
    receiver: &AccountId,
    memo: Option<&str>,
) {
    let event = serde_json::json!({
        "standard": "nep171",
        "version": "1.0.0",
        "event": "nft_transfer",
        "data": [{
            "authorized_id": null,
            "old_owner_id": sender.to_string(),
            "new_owner_id": receiver.to_string(),
            "token_ids": [token_id],
            "memo": memo
        }]
    });
    env::log_str(&format!("EVENT_JSON:{}", event));
}

#[near]
impl RagaTokenBound {
    // ------------------------------------------------------------------------
    // NEP-171: Core Non-Fungible Token Standard
    // ------------------------------------------------------------------------

    #[payable]
    pub fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    ) {
        assert_one_yocto();
        let caller = env::predecessor_account_id();

        // 1. Enforce time-locked rental constraint
        if self.is_active_rental(&token_id) {
            let rental = self.rentals.get(&token_id).unwrap();
            env::panic_str(&format!(
                "Transfer forbidden: token {} is locked under active rental to {} until timestamp {} ns",
                token_id, rental.renter_id, rental.expires_at
            ));
        }

        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Token not found"));

        // 2. Authorization check
        let is_owner = caller == agent.owner_id;
        let is_approved = if let Some(app_id) = approval_id {
            agent.approvals.get(&caller) == Some(&app_id)
        } else {
            agent.approvals.contains_key(&caller)
        };
        if !is_owner && !is_approved {
            env::panic_str("Unauthorized: caller is neither owner nor approved");
        }
        if agent.owner_id == receiver_id {
            env::panic_str("Receiver cannot be the current owner");
        }

        let previous_owner = agent.owner_id.clone();
        agent.owner_id = receiver_id.clone();
        agent.approvals.clear();

        // Reassign in owner index
        self.internal_remove_token_from_owner(&previous_owner, &token_id);
        self.internal_add_token_to_owner(&receiver_id, &token_id);

        self.tokens.insert(token_id.clone(), agent);

        emit_nft_transfer_event(&token_id, &previous_owner, &receiver_id, memo.as_deref());
    }

    #[payable]
    pub fn nft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
        msg: String,
    ) -> PromiseOrValue<bool> {
        assert_one_yocto();
        let caller = env::predecessor_account_id();

        // 1. Enforce time-locked rental constraint
        if self.is_active_rental(&token_id) {
            let rental = self.rentals.get(&token_id).unwrap();
            env::panic_str(&format!(
                "Transfer forbidden: token {} is locked under active rental to {} until timestamp {} ns",
                token_id, rental.renter_id, rental.expires_at
            ));
        }

        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Token not found"));

        let is_owner = caller == agent.owner_id;
        let is_approved = if let Some(app_id) = approval_id {
            agent.approvals.get(&caller) == Some(&app_id)
        } else {
            agent.approvals.contains_key(&caller)
        };
        if !is_owner && !is_approved {
            env::panic_str("Unauthorized: caller is neither owner nor approved");
        }
        if agent.owner_id == receiver_id {
            env::panic_str("Receiver cannot be the current owner");
        }

        let previous_owner = agent.owner_id.clone();
        let saved_approvals = agent.approvals.clone();

        agent.owner_id = receiver_id.clone();
        agent.approvals.clear();

        self.internal_remove_token_from_owner(&previous_owner, &token_id);
        self.internal_add_token_to_owner(&receiver_id, &token_id);

        self.tokens.insert(token_id.clone(), agent);

        emit_nft_transfer_event(&token_id, &previous_owner, &receiver_id, memo.as_deref());

        ext_nft_receiver::ext(receiver_id.clone())
            .with_static_gas(GAS_FOR_NFT_ON_TRANSFER)
            .nft_on_transfer(caller, previous_owner.clone(), token_id.clone(), msg)
            .then(
                ext_self::ext(env::current_account_id())
                    .with_static_gas(GAS_FOR_RESOLVE_TRANSFER)
                    .nft_resolve_transfer(
                        previous_owner,
                        receiver_id,
                        token_id,
                        Some(saved_approvals),
                    ),
            )
            .into()
    }

    #[private]
    pub fn nft_resolve_transfer(
        &mut self,
        previous_owner_id: AccountId,
        receiver_id: AccountId,
        token_id: TokenId,
        approved_account_ids: Option<HashMap<AccountId, u64>>,
    ) -> bool {
        let must_revert = match env::promise_result_checked(0, 1024) {
            Ok(value) => serde_json::from_slice::<bool>(&value).unwrap_or(true),
            Err(_) => true,
        };

        if !must_revert {
            return true;
        }

        // Revert the transfer if the token is still with receiver_id
        if let Some(mut agent) = self.tokens.get(&token_id).cloned() {
            if agent.owner_id == receiver_id {
                agent.owner_id = previous_owner_id.clone();
                if let Some(approvals) = approved_account_ids {
                    agent.approvals = approvals;
                }
                self.internal_remove_token_from_owner(&receiver_id, &token_id);
                self.internal_add_token_to_owner(&previous_owner_id, &token_id);
                self.tokens.insert(token_id.clone(), agent);

                emit_nft_transfer_event(
                    &token_id,
                    &receiver_id,
                    &previous_owner_id,
                    Some("Rollback failed transfer"),
                );
                return false;
            }
        }
        true
    }

    pub fn nft_token(&self, token_id: TokenId) -> Option<JsonToken> {
        self.get_agent(token_id)
    }

    // ------------------------------------------------------------------------
    // NEP-177: NFT Metadata Standard
    // ------------------------------------------------------------------------

    pub fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().clone().unwrap_or_else(|| NFTContractMetadata {
            spec: "nft-1.0.0".to_string(),
            name: "RAGA Autonomous AI Agents".to_string(),
            symbol: "RAGA".to_string(),
            icon: Some("data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=".to_string()),
            base_uri: None,
            reference: None,
            reference_hash: None,
        })
    }

    // ------------------------------------------------------------------------
    // NEP-178: Approval Management
    // ------------------------------------------------------------------------

    #[payable]
    pub fn nft_approve(
        &mut self,
        token_id: TokenId,
        account_id: AccountId,
        msg: Option<String>,
    ) -> Option<Promise> {
        let caller = env::predecessor_account_id();
        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Token not found"));

        if agent.owner_id != caller {
            env::panic_str("Only token owner can approve accounts");
        }
        if self.is_active_rental(&token_id) {
            env::panic_str("Cannot approve while agent is in active rental");
        }

        let approval_id = agent.next_approval_id;
        agent.approvals.insert(account_id.clone(), approval_id);
        agent.next_approval_id += 1;

        self.tokens.insert(token_id.clone(), agent);

        msg.map(|msg_str| {
            ext_nft_receiver::ext(account_id)
                .with_static_gas(GAS_FOR_NFT_ON_TRANSFER)
                .nft_on_transfer(caller.clone(), caller, token_id, msg_str)
        })
    }

    #[payable]
    pub fn nft_revoke(&mut self, token_id: TokenId, account_id: AccountId) {
        assert_one_yocto();
        let caller = env::predecessor_account_id();
        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Token not found"));

        if agent.owner_id != caller {
            env::panic_str("Only token owner can revoke approvals");
        }
        agent.approvals.remove(&account_id);
        self.tokens.insert(token_id, agent);
    }

    #[payable]
    pub fn nft_revoke_all(&mut self, token_id: TokenId) {
        assert_one_yocto();
        let caller = env::predecessor_account_id();
        let mut agent = self
            .tokens
            .get(&token_id)
            .cloned()
            .unwrap_or_else(|| env::panic_str("Token not found"));

        if agent.owner_id != caller {
            env::panic_str("Only token owner can revoke all approvals");
        }
        agent.approvals.clear();
        self.tokens.insert(token_id, agent);
    }

    pub fn nft_is_approved(
        &self,
        token_id: TokenId,
        approved_account_id: AccountId,
        approval_id: Option<u64>,
    ) -> bool {
        if let Some(agent) = self.tokens.get(&token_id) {
            if let Some(expected_id) = agent.approvals.get(&approved_account_id) {
                if let Some(check_id) = approval_id {
                    return *expected_id == check_id;
                }
                return true;
            }
        }
        false
    }

    // ------------------------------------------------------------------------
    // NEP-181: Enumeration Standard
    // ------------------------------------------------------------------------

    pub fn nft_total_supply(&self) -> U128 {
        U128(self.token_list.len() as u128)
    }

    pub fn nft_tokens(
        &self,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let start = from_index.map(|i| i.0 as usize).unwrap_or(0);
        let limit = limit.map(|l| l as usize).unwrap_or(50);

        let total = self.token_list.len() as usize;
        if start >= total {
            return Vec::new();
        }

        let end = std::cmp::min(start + limit, total);
        (start..end)
            .filter_map(|i| {
                let token_id = self.token_list.get(i as u32)?;
                self.get_agent(token_id.clone())
            })
            .collect()
    }

    pub fn nft_supply_for_owner(&self, account_id: AccountId) -> U128 {
        let count = self
            .tokens_per_owner
            .get(&account_id)
            .map(|vec| vec.len() as u128)
            .unwrap_or(0);
        U128(count)
    }

    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_vec = match self.tokens_per_owner.get(&account_id) {
            Some(vec) => vec,
            None => return Vec::new(),
        };

        let start = from_index.map(|i| i.0 as usize).unwrap_or(0);
        let limit = limit.map(|l| l as usize).unwrap_or(50);
        let total = tokens_vec.len();

        if start >= total {
            return Vec::new();
        }

        let end = std::cmp::min(start + limit, total);
        (start..end)
            .filter_map(|i| {
                let token_id = tokens_vec.get(i)?;
                self.get_agent(token_id.clone())
            })
            .collect()
    }
}
