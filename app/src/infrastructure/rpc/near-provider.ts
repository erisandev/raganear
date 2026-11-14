import { JsonRpcProvider } from "near-api-js";
import { NEAR_CONFIG } from "@/config/near.config";

let cachedProvider: JsonRpcProvider | null = null;

/**
 * Returns a singleton instance of JsonRpcProvider targeting the configured NEAR node.
 */
export function getRpcProvider(): JsonRpcProvider {
  if (!cachedProvider) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/rpc`
        : NEAR_CONFIG.nodeUrl;
    cachedProvider = new JsonRpcProvider({ url });
  }
  return cachedProvider;
}

/**
 * Helper to execute view calls against the root RAGA smart contract.
 */
export async function callViewFunction<T>(
  method: string,
  args: Record<string, unknown> = {}
): Promise<T> {
  const provider = getRpcProvider();
  return provider.callFunction({
    contractId: NEAR_CONFIG.contractId,
    method,
    args,
  }) as Promise<T>;
}
