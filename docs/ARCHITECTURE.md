# ARCHITECTURE SPECIFICATION: RAGA TOKEN-BOUND SMART ACCOUNTS

## 1. System Overview
**RAGA** is a decentralized framework on NEAR Protocol implementing **NEP-171 token-bound smart accounts** that represent autonomous, rentable, and tradable AI workers.

Each minted NFT represents an AI agent bound to an exclusive NEAR sub-account of the smart contract (`<token_id>.<contract_id>`). The NFT smart contract acts as the sole parent authority over the bound sub-account.

---

## 2. Core Architecture & Sub-Account Binding

```
                      ┌─────────────────────────────────────────┐
                      │          RagaTokenBound Contract        │
                      │               (raga.near)               │
                      └────────────────────┬────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │ Sole Authority Parent Controller    │
                        ▼                                     ▼
        ┌──────────────────────────────┐      ┌──────────────────────────────┐
        │ Bound Sub-Account:           │      │ Bound Sub-Account:           │
        │ agent-01.raga.near           │      │ agent-02.raga.near           │
        │ (Autonomous Security Guard)  │      │ (DeFi Yield Arbiter)         │
        └──────────────────────────────┘      └──────────────────────────────┘
```

### Why NEAR Sub-Accounts?
Under the NEAR Protocol account hierarchy:
1. An account `parent.near` is the **only entity** with native protocol permission to create, deploy to, and invoke actions on sub-accounts formatted as `<subaccount>.parent.near`.
2. When RAGA mints an agent NFT `token_id = "agent-sentinel-01"`, it derives `agent-sentinel-01.raga.near`.
3. The contract binds this sub-account to the NFT. No external private key exists with full-access keys over this sub-account.
4. All instructions to or through the bound sub-account are gated by the contract's `execute_as_agent` entry point.

---

## 3. Standards Compliance Matrix

### A. NEP-171 (Non-Fungible Token Core Standard)
- `nft_transfer(receiver_id, token_id, approval_id, memo)`:
  - Requires 1 yoctoNEAR deposit.
  - **Enforces Time-Locked Rental Constraint**: Panics if `is_active_rental(token_id)` is true. Neither the token owner nor the renter can transfer the NFT while an active rental lease is running.
- `nft_transfer_call(receiver_id, token_id, approval_id, memo, msg)`:
  - Dispatches cross-contract call to `receiver_id` via `nft_on_transfer`.
  - Reverts and restores previous owner if transfer is rejected.
- `nft_token(token_id) -> Option<JsonToken>`:
  - Returns official standard token structure augmented with dynamic agent telemetry (bound sub-account, rental state, effective operator, reputation score, and lifetime yield).

### B. NEP-177 (NFT Metadata Standard)
- `nft_metadata() -> NFTContractMetadata`:
  - Returns contract specification (`nft-1.0.0`), name (`RAGA Autonomous AI Agents`), and symbol (`RAGA`).
- Agent-level `TokenMetadata`:
  - Includes title, capability, creation timestamps, and sub-account bindings.

### C. NEP-178 (Approval Management Standard)
- `nft_approve(token_id, account_id, msg) -> Option<Promise>`
- `nft_revoke(token_id, account_id)`
- `nft_revoke_all(token_id)`
- `nft_is_approved(token_id, approved_account_id, approval_id) -> bool`

### D. NEP-181 (Enumeration Standard)
- `nft_total_supply() -> U128`
- `nft_tokens(from_index, limit) -> Vec<JsonToken>`
- `nft_supply_for_owner(account_id) -> U128`
- `nft_tokens_for_owner(account_id, from_index, limit) -> Vec<JsonToken>`

---

## 4. State Model

```rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct RagaTokenBound {
    pub owner_id: AccountId,
    pub metadata: LazyOption<NFTContractMetadata>,
    pub tokens: near_sdk::store::LookupMap<TokenId, RagaAgentMetadata>,
    pub rentals: near_sdk::store::LookupMap<TokenId, ActiveRental>,
    pub token_list: near_sdk::store::Vector<TokenId>,
    pub tokens_per_owner: near_sdk::store::LookupMap<AccountId, Vec<TokenId>>,
}

#[near(serializers = [borsh, json])]
pub struct ActiveRental {
    pub renter_id: AccountId,
    pub expires_at: u64, // Nanoseconds timestamp
}

#[near(serializers = [borsh, json])]
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
```

---

## 5. Execution Delegation Matrix

Who holds execution authority over the agent and its bound sub-account?

| State | Block Timestamp Condition | Effective Operator | Can Execute Work? | Can Transfer Token? | Can Claim Revenue? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unrented (Idle)** | No rental record or expired | **Token Owner** | YES | YES | YES |
| **Active Rental** | `env::block_timestamp() < expires_at` | **Active Renter** | **ONLY Renter** | **NO (Locked)** | **ONLY Owner** |
| **Expired Rental** | `env::block_timestamp() >= expires_at` | **Token Owner** | YES | YES | YES |
| **Third Party** | N/A | None | **NO (Panics)** | **NO** | **NO** |

---

## 6. Time-Locked Rental State Machine

1. **Lease Initialization (`rent_agent`)**:
   - Renter attaches deposit in yoctoNEAR covering `duration_sec * rental_rate_per_sec`.
   - Contract checks `is_active_rental(token_id)`: if already actively rented, it panics.
   - Calculates `expires_at = env::block_timestamp() + (duration_sec * 1_000_000_000)`.
   - Stores `ActiveRental { renter_id, expires_at }`.
   - Routes rental payment to `total_revenue_accumulated` and `unclaimed_revenue` (owned by NFT owner).
   - Excess deposit is refunded to renter.

2. **Strict Time-Lock Enforcement**:
   - During the active rental window:
     - The token owner **cannot transfer or burn** the NFT.
     - The renter **cannot transfer or burn** the NFT.
     - This guarantees the renter's SLA: the worker cannot be revoked mid-workload.

3. **Autonomous Expiration**:
   - Once `env::block_timestamp() >= expires_at`, view methods and execution checks automatically treat the rental as expired.
   - No expensive on-chain gas is required to "close" or delete the rental. Authority immediately and trustlessly reverts back to `owner_id`.

---

## 7. Autonomous Worker Daemon (`worker-daemon/src/worker.ts`)
The off-chain worker daemon runs an autonomous loop:
1. Connects to NEAR RPC (`JsonRpcProvider`).
2. Queries agent telemetry via `get_agent(token_id)`.
3. Verifies current operator and time-lock remaining.
4. Generates an autonomous task workload (e.g. DeFi pool arbitrage, oracle price attestation).
5. Computes a cryptographic SHA-256 proof of work:
   `SHA-256(taskId + taskType + operator + payload + timestamp)`
6. Dispatches `complete_agent_task` or `execute_as_agent` on NEAR Protocol.
7. Dynamic state (reputation score, completed tasks, earned revenue) updates on-chain.
