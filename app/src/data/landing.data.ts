export const PROOF = {
  contractId: "raga-protocol-mw93m309.testnet",
  subaccount: "agent-sentinel-01.raga-protocol-mw93m309.testnet",
  deployTx: "4t1mhziPh8ah3WQRFeT2Ldz2Y3fLdNfHWJ3jm6dkAFZo",
  initTx: "FxDs3ufv47pVHzaBCb1CcXgrpLZCBkVjRgoKT4fbTYe9",
  mintTx: "HhVM2HDrzLx4s7ytwqb5rnt9tJERyLuGix1J4uTwYph8",
  leaseTx: "G53dRkSKUeAUrsUz4mYRt4sWXmBwV16pyfeDax6ySkwy",
  lockPanicTx: "3XDMyhU9XoDtqkec8PUThhC3vcu4Z3qRYoWNW9fJ3kpV",
  claimTx: "CP7L1VWE5MBuDH5vuoZ76ogu69jjbtZjgyRLpwWseHbF",
  proxyTx: "DsBWx5CN36nGUKRWddkNdibSPWoCYEhfhyD2ED6gUB8s",
  daemonTx: "6jyYAgnCqpPri5dMRQ89E2Tirz2VcrS6htGbhNtRj8vY",
  agentCount: 4,
} as const;

export const FOUR_STAGES = [
  {
    number: "01",
    name: "MINT & BIND",
    lead: "Forge sovereign identity.",
    body: "The agent token is minted as an NEP-171 NFT, programmatically creating an exclusive NEAR sub-account (<token_id>.raga-protocol-mw93m309.testnet). The contract acts as the sole parent authority—zero private keys exist.",
    proof: "agent-sentinel-01.raga-protocol-mw93m309.testnet",
  },
  {
    number: "02",
    name: "TIME-LOCK LEASE",
    lead: "Commit duration, delegate execution.",
    body: "Renters lease worker capacity by attaching yoctoNEAR. The smart contract calculates nanosecond expiration (expires_at = env::block_timestamp() + duration_nanos) and assigns operational delegation.",
    proof: "Tx: G53dRkSKUeA... (1 hr lease on agent-oracle-03 active)",
  },
  {
    number: "03",
    name: "TRANSFER FREEZE",
    lead: "Enforce the NEP-178 anti-theft invariant.",
    body: "While active, nft_transfer panics unconditionally if called by anyone, including the owner. Renters cannot be evicted or front-run; execution delegation is cryptographically guaranteed.",
    proof: "Tx: 3XDMyhU9XoD... (Panic: Transfer forbidden)",
  },
  {
    number: "04",
    name: "AUTONOMOUS YIELD",
    lead: "Stream revenue, revert trustlessly.",
    body: "When block time crosses expires_at, operator rights revert to the token owner with zero cleanup gas. The NFT owner withdraws accumulated lease fees directly from the protocol vault.",
    proof: "Tx: CP7L1VWE5MB... (2 NEAR yield settled)",
  },
];

export const THE_STACK = [
  {
    role: "L1 PROTOCOL LAYER",
    name: "NEAR Protocol L1",
    body: "Provides native hierarchical sub-accounts (<subaccount>.parent.near), 1-second finality, 1 yoctoNEAR security deposits, and deterministic state-staking storage economics.",
    facts: ["Hierarchical Sub-accounts", "1s Block Finality", "Native Account Hierarchy"],
  },
  {
    role: "TOKEN-BOUND CONTROLLER",
    name: "NEP-171 / NEP-178 Engine",
    body: "Rust contract built on near-sdk v5.30.1 acting as the keyless parent authority over sub-accounts. Enforces the execution delegation matrix, time-lock state machine, and transfer freeze.",
    facts: ["near-sdk v5.30.1", "NEP-178 Transfer Freeze", "Zero Private Key Invariant"],
  },
  {
    role: "OFF-CHAIN DAEMON",
    name: "Autonomous Worker Daemon",
    body: "Autonomous Node.js runtime querying agent telemetry, computing SHA-256 cryptographic attestation proofs, and submitting on-chain task completions and proxy executions.",
    facts: ["TypeScript / Node 18+", "SHA-256 Proof Engine", "near-api-js v7.4.0"],
  },
];

export const HONESTY_ITEMS = [
  "RAGA does not run artificial intelligence neural network inference inside the WebAssembly runtime. LLM weights and heavy reasoning run off-chain; the smart contract verifies cryptographic SHA-256 task proofs and delegates on-chain execution.",
  "RAGA is not deployed on Ethereum or Solana. The protocol relies on NEAR's native hierarchical sub-account tree, which enables native sub-account creation without complex ERC-6551 proxy registries or external key coordination.",
  "Block timestamp resolution is bounded by NEAR validator consensus intervals (~1 to 2 seconds). While lease calculations are denominated in nanoseconds, execution reversion adheres to block timestamp boundaries.",
  "Sub-account creation requires NEAR storage staking allocation (~0.05 NEAR per sub-account). Accounts cannot be created out of thin air without reserving protocol storage footprint.",
  "The off-chain worker daemon key holds only execution attestation authority. It possesses zero withdrawal or ownership permissions over the underlying NFT or treasury funds.",
];
