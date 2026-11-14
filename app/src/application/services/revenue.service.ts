import { AgentNFT } from "@/domain/models/agent.model";
import { yoctoToNear } from "@/utils/units";
import { claimAgentRevenueOnChain } from "@/infrastructure/repositories/agent-tx.repo";

/**
 * Calculates total unclaimed yield for all agents owned by a specific account.
 */
export function calculateTotalUnclaimed(agents: AgentNFT[], ownerId: string): number {
  return agents
    .filter((a) => a.owner_id === ownerId)
    .reduce((acc, a) => acc + yoctoToNear(a.unclaimed_revenue), 0);
}

/**
 * Iteratively claims accumulated revenue for every token owned by the caller.
 */
export async function claimAllRevenueForOwner(
  agents: AgentNFT[],
  ownerId: string,
  privateKey?: string
): Promise<{ totalClaimedNear: number; affectedTokens: string[]; lastTxHash: string }> {
  const ownedWithYield = agents.filter(
    (a) => a.owner_id === ownerId && yoctoToNear(a.unclaimed_revenue) > 0
  );

  let totalClaimedNear = 0;
  const affectedTokens: string[] = [];
  let lastTxHash = "";

  for (const agent of ownedWithYield) {
    try {
      const res = await claimAgentRevenueOnChain(agent.token_id, ownerId, privateKey);
      lastTxHash = res.txHash;
      totalClaimedNear += yoctoToNear(agent.unclaimed_revenue);
      affectedTokens.push(agent.token_id);
    } catch (err) {
      console.error(`Failed to claim revenue for ${agent.token_id}:`, err);
    }
  }

  return { totalClaimedNear, affectedTokens, lastTxHash };
}
