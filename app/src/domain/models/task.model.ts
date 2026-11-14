export type ExecutionStatus = "CONFIRMED" | "EXECUTING" | "REVERTED";

export interface TaskExecutionRecord {
  id: string;
  token_id: string;
  operator: string;
  target_account: string;
  method_name: string;
  proof_hash: string;
  reward_near: number;
  timestamp: number;
  status: ExecutionStatus;
  gas_spent_tgas?: number;
  tx_hash?: string;
}
