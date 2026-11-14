# INTEGRATION & VERIFICATION CONTRACTS: RAGA PROTOCOL

> **Primary Network**: NEAR Protocol Testnet  
> **Root Contract Account**: `raga-protocol-mw93m309.testnet`  
> **Explorer Base**: [https://testnet.nearblocks.io](https://testnet.nearblocks.io)  
> **Interface Stack**: Rust Contract -> `near-api-js` v7.4.0 -> Next.js 14 Foundry -> Off-Chain Worker Daemon

---

## 1. On-Chain Live Testnet Deployment

The RAGA Protocol is deployed live on NEAR Testnet. No simulated mocks, sandbox environments, or synthetic accounts are used for judge verification.

### Contract Identity Matrix

| Role | Testnet Account ID | Purpose & Security Scope |
| :--- | :--- | :--- |
| **Parent Contract** | `raga-protocol-mw93m309.testnet` | Holds root state, NFT registry, and sub-account authorization keys |
| **Deployer / Owner** | `raga-protocol-mw93m309.testnet` | Protocol administrative authority, creator of root agents |
| **Authorized Tenant** | `raga-renter-mw94dqty.testnet` | Active leaseholder executing workloads via bound sub-accounts |
| **Worker Operator** | `raga-operator-mw94dqty.testnet` | Off-chain daemon key submitting cryptographic task proofs |

---

## 2. Cryptographic Proofs & Verified Transactions

The table below records real, permanent on-chain transactions verifying protocol execution invariants:

```
[MINT PROOF]  -->  agent-sentinel-01  -->  Tx: HhVM2HDrzLx... (Bound: agent-sentinel-01.raga...)
[LEASE PROOF] -->  agent-yield-02     -->  Tx: DmYqBB5af4E... (Leased to raga-renter-mw94dqty.testnet)
[LOCK PROOF]  -->  agent-yield-02     -->  Tx: 3XDMyhU9XoD... (PANIC: Transfer forbidden under active rental)
[CLAIM PROOF] -->  agent-yield-02     -->  Tx: CP7L1VWE5MB... (2 NEAR yield claimed to owner)
[PROXY PROOF] -->  agent-yield-02     -->  Tx: ENFyqfgM6wV... (wrap.testnet::ft_total_supply executed)
```

### Full Transaction Ledger

| Lifecycle Event | Agent Token ID | Transaction Hash | Verifiable Outcome |
| :--- | :--- | :--- | :--- |
| **Contract Deploy** | `raga-protocol-mw93m309.testnet` | [`4t1mhziPh8ah3WQRFeT2Ldz2Y3fLdNfHWJ3jm6dkAFZo`](https://testnet.nearblocks.io/txns/4t1mhziPh8ah3WQRFeT2Ldz2Y3fLdNfHWJ3jm6dkAFZo) | Deployed Wasm binary (`raga_contracts.wasm`) |
| **Contract Init (`new`)** | `raga-protocol-mw93m309.testnet` | [`FxDs3ufv47pVHzaBCb1CcXgrpLZCBkVjRgoKT4fbTYe9`](https://testnet.nearblocks.io/txns/FxDs3ufv47pVHzaBCb1CcXgrpLZCBkVjRgoKT4fbTYe9) | Initialized metadata with NEP-171/178 parameters |
| **Mint Agent 01** | `agent-sentinel-01` | [`HhVM2HDrzLx4s7ytwqb5rnt9tJERyLuGix1J4uTwYph8`](https://testnet.nearblocks.io/txns/HhVM2HDrzLx4s7ytwqb5rnt9tJERyLuGix1J4uTwYph8) | Created sub-account `agent-sentinel-01.raga...` |
| **Mint Agent 02** | `agent-yield-02` | [`G2cQFii3gH8N5dReGDXUNfbiAZmyizmwQHVEb3B2TDEf`](https://testnet.nearblocks.io/txns/G2cQFii3gH8N5dReGDXUNfbiAZmyizmwQHVEb3B2TDEf) | Created sub-account `agent-yield-02.raga...` |
| **Mint Agent 03** | `agent-oracle-03` | [`6kfKkqNoGAHCVReD1eYrmgUNnHMqM8Ra8CimXHQDmw9n`](https://testnet.nearblocks.io/txns/6kfKkqNoGAHCVReD1eYrmgUNnHMqM8Ra8CimXHQDmw9n) | Created sub-account `agent-oracle-03.raga...` |
| **Mint Agent 04** | `agent-nexus-04` | [`3Yn1ummno2t79kFLKGvCjgRDT5uFAUZK5GPc9H6jgNzG`](https://testnet.nearblocks.io/txns/3Yn1ummno2t79kFLKGvCjgRDT5uFAUZK5GPc9H6jgNzG) | Created sub-account `agent-nexus-04.raga...` |
| **Time-Lock Lease (Yield)** | `agent-yield-02` | [`DmYqBB5af4ETt6XECSJ3a88oz1syV45rYwccZ12qYj8Y`](https://testnet.nearblocks.io/txns/DmYqBB5af4ETt6XECSJ3a88oz1syV45rYwccZ12qYj8Y) | Deposited lease fee; assigned operator to renter |
| **Time-Lock Lease (Oracle)** | `agent-oracle-03` | [`G53dRkSKUeAUrsUz4mYRt4sWXmBwV16pyfeDax6ySkwy`](https://testnet.nearblocks.io/txns/G53dRkSKUeAUrsUz4mYRt4sWXmBwV16pyfeDax6ySkwy) | Deposited 0.85 NEAR for 1 hr lease; operator assigned to renter |
| **Anti-Theft Freeze** | `agent-yield-02` / `agent-oracle-03` | [`3XDMyhU9XoDtqkec8PUThhC3vcu4Z3qRYoWNW9fJ3kpV`](https://testnet.nearblocks.io/txns/3XDMyhU9XoDtqkec8PUThhC3vcu4Z3qRYoWNW9fJ3kpV) | **Panicked as expected**: NEP-178 transfer locked |
| **Revenue Withdrawal** | `agent-yield-02` | [`CP7L1VWE5MBuDH5vuoZ76ogu69jjbtZjgyRLpwWseHbF`](https://testnet.nearblocks.io/txns/CP7L1VWE5MBuDH5vuoZ76ogu69jjbtZjgyRLpwWseHbF) | 2 NEAR streaming yield withdrawn by token owner |
| **Proxy Invocation (Yield)** | `agent-yield-02` | [`ENFyqfgM6wVgWFyYTM6SwpXcFPC1R9NMBmbfS16S9mDr`](https://testnet.nearblocks.io/txns/ENFyqfgM6wVgWFyYTM6SwpXcFPC1R9NMBmbfS16S9mDr) | Dispatched cross-contract execution to external contract |
| **Proxy Invocation (Oracle)** | `agent-oracle-03` | [`DsBWx5CN36nGUKRWddkNdibSPWoCYEhfhyD2ED6gUB8s`](https://testnet.nearblocks.io/txns/DsBWx5CN36nGUKRWddkNdibSPWoCYEhfhyD2ED6gUB8s) | Dispatched `execute_as_agent` -> `get_contract_owner`, tasks += 1 |
| **Daemon Task Settlement** | `agent-oracle-03` | [`6jyYAgnCqpPri5dMRQ89E2Tirz2VcrS6htGbhNtRj8vY`](https://testnet.nearblocks.io/txns/6jyYAgnCqpPri5dMRQ89E2Tirz2VcrS6htGbhNtRj8vY) | Submitted task completion with SHA-256 proof; reputation boosted |

---

## 3. Off-Chain Autonomous Worker Daemon Specification

The off-chain daemon (`worker-daemon/src/worker.ts`) acts as the execution bridge between autonomous off-chain AI reasoning loops and NEAR on-chain verification.

### Heartbeat Loop & Attestation Engine

```typescript
// worker-daemon/src/worker.ts execution cycle:
export async function runDaemonCycle(agentId: string) {
  // 1. Fetch current on-chain state via near-api-js JsonRpcProvider
  const agent = await queryAgentState(agentId);
  
  // 2. Validate current delegation: Is lease active or expired?
  const isAuthorized = validateOperator(agent);
  if (!isAuthorized) return;

  // 3. Formulate autonomous task payload (e.g. DeFi rebalance / Oracle validation)
  const taskPayload = {
    taskId: `task-${Date.now()}`,
    agentId,
    operator: agent.effective_operator,
    targetContract: "wrap.testnet",
    action: "ft_balance_of",
    timestamp: Date.now()
  };

  // 4. Generate SHA-256 cryptographic attestation proof
  const proofHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(taskPayload))
    .digest("hex");

  // 5. Submit settlement to NEAR Protocol
  await submitTaskCompletion(agentId, taskPayload.taskId, proofHash);
}
```

### Heartbeat Invariants
- **Poll Interval**: 15 seconds per active agent unit.
- **Failover RPC**: Rotates between `https://rpc.testnet.near.org` and `https://near-testnet.drpc.org`.
- **Proof Structure**: `sha256(taskId + agentId + operator + payload + block_height)`.

---

## 4. Web3 Client Integration (`near-api-js` v7.4.0)

The frontend dApp communicates with NEAR Testnet through an enterprise clean architecture:

1. **`near-provider.ts`**: Pure read-only JSON-RPC gateway featuring retry policies, exponential backoff, and local response caching for high-frequency methods (`nft_tokens`, `nft_token`, `get_agent`).
2. **`near-signer.ts`**: Transaction signing abstraction supporting NEAR browser wallets, private key signers, and local key-stores.
3. **`agent-query.repo.ts` & `agent-tx.repo.ts`**: Typed domain repositories mapping low-level NEAR Borsh/JSON responses to strongly-typed TypeScript domain entities.
4. **`/api/rpc` Gateway**: Next.js App Router edge route preventing client-side CORS issues and shielding public RPC limits from overwhelming the user interface.
