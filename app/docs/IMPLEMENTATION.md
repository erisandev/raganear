# TECHNICAL IMPLEMENTATION SPECIFICATION: RAGA PROTOCOL

> **Standard Compliance**: NEP-171 (NFT Core), NEP-177 (Metadata), NEP-178 (Approval & Transfer Freeze), NEP-181 (Enumeration)  
> **Target Network**: NEAR Protocol (Testnet & Mainnet)  
> **Rust SDK**: `near-sdk` v5.1.0 / v5.30.1  
> **Source Files**: `contracts/src/lib.rs`, `contracts/src/token_bound.rs`, `contracts/src/nft_core.rs`

---

## 1. NEP-171 Token-Bound Sub-Account Architecture

Traditional non-fungible tokens on Ethereum (ERC-721) or Solana (Metaplex) are passive index numbers mapping to a metadata URI. While ERC-6551 attempted to bind smart contract accounts on EVM, it suffers from fragmented key management, high deployment gas overhead, and lack of cross-chain primitives.

NEAR Protocol offers a first-class native account hierarchy: any top-level or sub-account `parent.near` possesses exclusive protocol-level authority to instantiate and administer sub-accounts formatted as `<subaccount>.parent.near`.

RAGA leverages this L1 primitive to implement **True Token-Bound Accounts (TBA)**:

```
                               ┌──────────────────────────────────────────────────┐
                               │           RagaTokenBound Smart Contract          │
                               │        (raga-protocol-mw93m309.testnet)          │
                               └────────────────────────┬─────────────────────────┘
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      │            Sole Authority & Cross-Contract Dispatcher             │
                      ▼                                                                   ▼
       ┌──────────────────────────────┐                                    ┌──────────────────────────────┐
       │   Bound Sub-Account Unit 01  │                                    │   Bound Sub-Account Unit 02  │
       │ agent-sentinel-01.raga...    │                                    │   agent-yield-02.raga...     │
       │ (Autonomous Security Guard)  │                                    │   (DeFi Yield Arbiter)       │
       └──────────────────────────────┘                                    └──────────────────────────────┘
```

### The Mint & Bind Pipeline

When an agent token is minted via `mint_agent(token_id, title, capability, rental_rate_per_sec, receiver_id)`:
1. The contract validates that `token_id` contains only alphanumeric characters and hyphens.
2. The deterministic sub-account address is computed:
   $$\text{bound\_subaccount} = \text{format!}(\text{"\{\}.\{\}", token\_id, env::current\_account\_id()})$$
3. A cross-contract action promise is dispatched:
   - `Promise::new(bound_subaccount).create_account().deploy_contract(...)`
4. The NFT record is registered in `LookupMap<TokenId, RagaAgentMetadata>`.

---

## 2. Cryptographic Invariant: Zero Private Key Risk

In conventional custodial agent setups, a bot operator holds a private key. If that key is compromised, or if the server crashes, the agent's funds and authorizations are permanently exposed or stolen.

Under RAGA, **no private key exists** for `{token_id}.raga-protocol-mw93m309.testnet`:
- The sub-account is created without an `AddKey` action for any full-access public key.
- The parent smart contract is the **sole entity** authorized by the NEAR runtime to dispatch transactions on behalf of the sub-account.
- All operations directed through the agent sub-account must pass through the smart contract's entry point:
  `execute_as_agent(token_id, target_contract, method_name, args, deposit, gas)`
- Access to `execute_as_agent` is guarded by the **Execution Delegation Matrix**.

```rust
// contracts/src/token_bound.rs
pub fn execute_as_agent(
    &mut self,
    token_id: TokenId,
    target_contract: AccountId,
    method_name: String,
    args: Vec<u8>,
    deposit: U128,
    gas: Gas,
) -> Promise {
    let effective_operator = self.get_effective_operator(&token_id);
    require!(
        env::predecessor_account_id() == effective_operator,
        "Caller is not authorized to execute as agent operator"
    );
    // Dispatches execution directly through parent authority
    Promise::new(target_contract)
        .function_call(method_name, args, deposit.0, gas)
}
```

---

## 3. Time-Locked Lease Mechanism & Nanosecond Block Enforcement

AI agents represent economic capital. To monetize autonomous agents without transferring ownership, RAGA introduces **Time-Locked Per-Second Micro-Leasing**.

### Lease Financial Calculation

Rental pricing is denominated strictly per second in yoctoNEAR ($1 \text{ NEAR} = 10^{24} \text{ yoctoNEAR}$):
$$\text{required\_deposit} = \text{duration\_sec} \times \text{rental\_rate\_per\_sec}$$

When a prospective tenant invokes `rent_agent(token_id, duration_sec)` with attached deposit:
1. **Concurrency Check**: The contract calls `self.is_active_rental(&token_id)`. If an unexpired lease already exists, execution panics immediately.
2. **Deposit Verification**: Ensures attached yoctoNEAR $\ge \text{required\_deposit}$.
3. **Nanosecond Timestamp Calculation**:
   $$\text{expires\_at} = \text{env::block\_timestamp}() + (\text{duration\_sec} \times 1{,}000{,}000{,}000)$$
4. **State Commit**:
   - `ActiveRental { renter_id: env::predecessor_account_id(), expires_at }` is stored in `LookupMap`.
   - `unclaimed_revenue += required_deposit`.
   - `total_revenue_accumulated += required_deposit`.
5. **Refund Surplus**: If `attached_deposit > required_deposit`, the exact delta is refunded to the renter.

```rust
// contracts/src/token_bound.rs
let block_now = env::block_timestamp();
let duration_nanos = duration_sec
    .checked_mul(1_000_000_000)
    .expect("Duration overflow");
let expires_at = block_now
    .checked_add(duration_nanos)
    .expect("Timestamp overflow");

self.rentals.set(
    token_id.clone(),
    Some(ActiveRental {
        renter_id: tenant_id.clone(),
        expires_at,
    }),
);
```

### Zero-Gas Automatic Reversion Invariant

Because expiration is derived strictly from `env::block_timestamp() >= expires_at`, an expired rental requires **zero cleanup transactions or keeper bots**. The moment block time passes `expires_at`, `get_effective_operator()` natively returns `token.owner_id`.

---

## 4. NEP-178 Anti-Theft Transfer Freeze

The primary vulnerability in existing rentable NFT standards (such as ERC-4907) is that a malicious owner can sell or transfer the underlying token while a renter has prepaid for a multi-day lease, rug-pulling the renter's operational SLA.

RAGA enforces a strict **NEP-178 Transfer Freeze Invariant** inside `nft_transfer` and `nft_transfer_call`:

```rust
// contracts/src/nft_core.rs
if self.is_active_rental(&token_id) {
    let rental = self.rentals.get(&token_id).unwrap();
    env::panic_str(&format!(
        "Transfer forbidden: token {} is locked under active rental until timestamp {}",
        token_id, rental.expires_at
    ));
}
```

### Invariant Rules
1. **Owner cannot transfer**: Token owner cannot transfer or burn the token while `is_active_rental` is true.
2. **Owner cannot approve**: New approval grants via NEP-178 are rejected during active leases.
3. **Renter cannot transfer**: The renter only possesses operator authority via `execute_as_agent`, never ownership (`owner_id`).
4. **Guaranteed SLA**: The renter is cryptographically guaranteed uninterrupted execution delegation for the exact span of prepaid seconds.

---

## 5. Tripartite Yield Routing & Autonomous Withdrawal

Revenue generation in RAGA follows a strict tripartite separation of concerns:

```
                       ┌──────────────────────────────────────────────┐
                       │             Renter / Tenant                  │
                       │     Pays: duration * rental_rate_per_sec     │
                       └──────────────────────┬───────────────────────┘
                                              │ (Lease Fee)
                                              ▼
                       ┌──────────────────────────────────────────────┐
                       │         RagaTokenBound Protocol Vault        │
                       │     unclaimed_revenue[token_id] += fee       │
                       └──────────────────────┬───────────────────────┘
                                              │ (claim_agent_revenue)
                                              ▼
                       ┌──────────────────────────────────────────────┐
                       │               Agent NFT Owner                │
                       │   Receives: 100% of accumulated lease fees   │
                       └──────────────────────────────────────────────┘
```

### Revenue Claim Primitives
- `claim_agent_revenue(token_id)` (On-Chain Contract Method):
  Transfers all accumulated `unclaimed_revenue` for a specific agent directly to the registered `owner_id`. Sets `unclaimed_revenue = 0`.
- `claimAllRevenueForOwner(agents, owner_id)` (Application Service):
  Client & daemon service that filters all tokens owned by `owner_id` with active `unclaimed_revenue > 0`, batch-executes `claim_agent_revenue` for each token, and returns the aggregated claimed NEAR total with verification hashes.

---

## 6. Failure Policy & Edge Case Matrix

The table below specifies how RAGA handles boundary conditions, RPC disruptions, and malicious transaction attempts:

| Failure Vector | Trigger Condition | System Behavior | Security Guarantee |
| :--- | :--- | :--- | :--- |
| **Active Lease Transfer Attempt** | Owner calls `nft_transfer` while block time $<$ `expires_at` | Contract immediately panics with explicit error message | Token remains locked; tenant SLA unbroken; 0 state changes |
| **Unauthorized Action Dispatch** | Non-operator calls `execute_as_agent` | Panics with `"Caller is not authorized to execute as agent operator"` | Sub-account funds cannot be drained or triggered maliciously |
| **Insufficient Lease Deposit** | Attached deposit $<$ `duration * rate` | Panics with `"Attached deposit does not cover rental duration"` | No rental record created; 100% attached deposit refunded |
| **RPC Endpoint Partition** | Public NEAR RPC rate limits or drops responses | Gateway client automatically cascades to secondary provider (`drpc.org`) | Frontend maintains responsive read status without app crash |
| **Expired Lease Dispatch** | Tenant calls `execute_as_agent` 1 nanosecond after `expires_at` | Evaluated against current block timestamp; returns token owner as operator | Immediate revocation without requiring manual cleanup tx |
| **Storage Staking Deficit** | Account mints token without storage balance | Panics under `storage_deposit` requirement per NEAR storage model | Contract remains storage-solvent; prevents state-bloat attack |
| **Sub-account Contract Call Revert** | Target contract panics during `execute_as_agent` | Cross-contract promise rolls back; attached deposit refunded | Isolation: Failure in target dApp never corrupts RAGA state |
