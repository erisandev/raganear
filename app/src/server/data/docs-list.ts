export interface DocEntry {
  readonly slug: string;
  readonly file: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly summary: string;
}

export const DOCS: readonly DocEntry[] = [
  {
    slug: "overview",
    file: "README.md",
    title: "Project Overview & Live Testnet",
    eyebrow: "Start Here",
    summary:
      "What RAGA is, what is implemented on NEAR Testnet, the token-bound architecture, verified transactions, and evaluation instructions.",
  },
  {
    slug: "implementation",
    file: "docs/IMPLEMENTATION.md",
    title: "Technical Implementation Specification",
    eyebrow: "Core Protocol",
    summary:
      "Detailed NEP-171 token-bound binding, zero private key invariant, time-locked micro-leasing, NEP-178 anti-theft transfer freeze, yield routing, and failure policy matrix.",
  },
  {
    slug: "integrations",
    file: "docs/INTEGRATIONS.md",
    title: "Integration & Verification Contracts",
    eyebrow: "Testnet Proofs",
    summary:
      "On-chain testnet deployment, verifiable transaction hashes, off-chain worker daemon specifications, and near-api-js JSON-RPC integration contracts.",
  },
  {
    slug: "architecture",
    file: "docs/ARCHITECTURE.md",
    title: "Architecture & State Machine",
    eyebrow: "System Design",
    summary:
      "Full system architecture, state model, execution delegation matrix, sub-account derivations, and standards compliance.",
  },
  {
    slug: "deploy",
    file: "docs/DEPLOY.md",
    title: "Deployment & Operations Checklist",
    eyebrow: "Runbook",
    summary:
      "Step-by-step checklist for building Rust Wasm contracts, initializing on NEAR Testnet, configuring worker daemon, and running the Next.js frontend.",
  },
];
