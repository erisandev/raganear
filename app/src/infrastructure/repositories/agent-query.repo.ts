import { AgentNFT } from "@/domain/models/agent.model";
import { callViewFunction } from "../rpc/near-provider";

export function parseJsonTokenToAgentNFT(t: any): AgentNFT {
  let category: AgentNFT["category"] = "Smart Contract Ops";
  let specialization: AgentNFT["specialization"] = "CONTRACT_OPS";

  const capStr = (t.metadata?.title || t.metadata?.description || "").toLowerCase();
  if (capStr.includes("sentinel") || capStr.includes("security") || capStr.includes("guardian")) {
    category = "Security Auditor";
    specialization = "SECURITY_SENTINEL";
  } else if (capStr.includes("yield") || capStr.includes("arbiter") || capStr.includes("defi")) {
    category = "Oracle / Arbitrage";
    specialization = "DEFI_YIELD";
  } else if (capStr.includes("oracle") || capStr.includes("validator") || capStr.includes("attestation")) {
    category = "Oracle / Arbitrage";
    specialization = "ORACLE_ATTESTATION";
  } else if (capStr.includes("liquidity") || capStr.includes("amm") || capStr.includes("bot")) {
    category = "Oracle / Arbitrage";
    specialization = "ARBITRAGE_ENGINE";
  } else if (capStr.includes("intelligence") || capStr.includes("intel") || capStr.includes("flow")) {
    category = "Data Intelligence";
    specialization = "DATA_INTELLIGENCE";
  }

  let hourlyRateNear = 1.0;
  try {
    if (t.rental_rate_per_sec) {
      const perSec = BigInt(t.rental_rate_per_sec);
      const perHr = perSec * BigInt(3600);
      hourlyRateNear = Number(perHr / BigInt(10 ** 20)) / 10000;
    }
  } catch {
    hourlyRateNear = 1.0;
  }

  const expiresAt = t.rental_expires_at
    ? Number(t.rental_expires_at)
    : t.active_rental?.expires_at
    ? Number(t.active_rental.expires_at)
    : undefined;

  return {
    token_id: t.token_id,
    name: t.metadata?.title || t.token_id,
    capability: t.metadata?.description || "Autonomous AI Worker",
    category,
    owner_id: t.owner_id,
    bound_subaccount: t.bound_subaccount,
    rental_rate_per_sec: t.rental_rate_per_sec || "0",
    hourly_rate_near: Number(hourlyRateNear.toFixed(2)),
    total_revenue_accumulated: t.total_revenue_accumulated || "0",
    unclaimed_revenue: t.unclaimed_revenue || "0",
    tasks_completed: Number(t.tasks_completed || 0),
    reputation_score: Number(t.reputation_score || 100),
    current_status: (t.current_status as any) || (t.is_rented ? "Rented" : "Idle"),
    is_rented: Boolean(t.is_rented),
    effective_operator: t.effective_operator || t.owner_id,
    rental_expires_at: expiresAt,
    created_at: t.metadata?.issued_at ? Number(t.metadata.issued_at) / 1_000_000 : Date.now(),
    specialization,
    description: t.metadata?.description || "",
  };
}

let cachedAgentsMemory: AgentNFT[] = [];

export async function fetchLiveAgentsFromRpc(): Promise<AgentNFT[]> {
  try {
    const rawTokens = await callViewFunction<any[]>("nft_tokens", {});
    if (Array.isArray(rawTokens) && rawTokens.length > 0) {
      cachedAgentsMemory = rawTokens.map((t) => parseJsonTokenToAgentNFT(t));
      return cachedAgentsMemory;
    }
    return cachedAgentsMemory;
  } catch (err) {
    console.error("Failed to query live tokens from NEAR RPC:", err);
    if (cachedAgentsMemory.length > 0) {
      return cachedAgentsMemory;
    }
    throw err;
  }
}

export async function fetchLiveAgentFromRpc(tokenId: string): Promise<AgentNFT | null> {
  try {
    const raw = await callViewFunction<any>("get_agent", { token_id: tokenId });
    if (!raw) return null;
    return parseJsonTokenToAgentNFT(raw);
  } catch (err) {
    console.error(`Failed to fetch agent ${tokenId}:`, err);
    return null;
  }
}
