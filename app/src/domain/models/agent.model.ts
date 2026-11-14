export type CapabilityCategory =
  | "ALL"
  | "Oracle / Arbitrage"
  | "Security Auditor"
  | "Data Intelligence"
  | "Smart Contract Ops";

export type AgentStatus = "Idle" | "Active" | "Rented" | "Processing";

export type AgentSpecialization =
  | "DEFI_YIELD"
  | "SECURITY_SENTINEL"
  | "ORACLE_ATTESTATION"
  | "ARBITRAGE_ENGINE"
  | "DATA_INTELLIGENCE"
  | "CONTRACT_OPS";

export interface AgentNFT {
  token_id: string;
  name: string;
  capability: string;
  category: "Oracle / Arbitrage" | "Security Auditor" | "Data Intelligence" | "Smart Contract Ops";
  owner_id: string;
  bound_subaccount: string;
  rental_rate_per_sec: string; // in yoctoNEAR
  hourly_rate_near: number;
  total_revenue_accumulated: string; // yoctoNEAR
  unclaimed_revenue: string; // yoctoNEAR
  tasks_completed: number;
  reputation_score: number; // 0 - 1000
  current_status: AgentStatus;
  is_rented: boolean;
  effective_operator: string;
  rental_expires_at?: number; // nanoseconds timestamp
  created_at: number;
  specialization: AgentSpecialization;
  description: string;
  avatar_seed?: string;
  gas_budget_tgas?: number;
}
