import { getNearAccount } from "../rpc/near-signer";
import { NEAR_CONFIG } from "@/config/near.config";
import { nearToYocto } from "@/utils/units";

const getTxHash = (o: any): string => {
  if (o?.transaction?.hash) return o.transaction.hash;
  if (o?.transaction_outcome?.id) return o.transaction_outcome.id;
  throw new Error("Transaction execution failed to return on-chain outcome hash");
};

async function computeSha256(content: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const msgBuffer = new TextEncoder().encode(content);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  try {
    const crypto = await import("crypto");
    return "0x" + crypto.createHash("sha256").update(content).digest("hex");
  } catch {
    return "0x" + Array.from(new TextEncoder().encode(content)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
}

export async function rentAgentOnChain(
  tokenId: string,
  durationHours: number,
  hourlyRateNear: number,
  signerAccountId: string,
  privateKey?: string
): Promise<{ success: boolean; txHash: string; expiresAtNs: number }> {
  const account = getNearAccount(signerAccountId, privateKey);
  const durationSec = durationHours * 3600;
  const depositNear = (hourlyRateNear * durationHours).toFixed(4);
  const depositYocto = BigInt(nearToYocto(Number(depositNear)));

  const outcome = await account.callFunctionRaw({
    contractId: NEAR_CONFIG.contractId,
    methodName: "rent_agent",
    args: { token_id: tokenId, duration_sec: durationSec },
    deposit: depositYocto,
    gas: BigInt("100000000000000"),
  });

  return {
    success: true,
    txHash: getTxHash(outcome),
    expiresAtNs: Date.now() * 1_000_000 + durationSec * 1_000_000_000,
  };
}

export async function executeAsAgentOnChain(
  tokenId: string,
  targetContract: string,
  methodName: string,
  argsJson: string,
  signerAccountId: string,
  privateKey?: string
): Promise<{ success: boolean; txHash: string; proofHash: string }> {
  const account = getNearAccount(signerAccountId, privateKey);
  let argsBytes: number[] = [];
  try {
    argsBytes = Array.from(new TextEncoder().encode(argsJson));
  } catch {
    argsBytes = [];
  }

  const outcome = await account.callFunctionRaw({
    contractId: NEAR_CONFIG.contractId,
    methodName: "execute_as_agent",
    args: {
      token_id: tokenId,
      target_account_id: targetContract,
      method_name: methodName,
      args: argsBytes,
      deposit: "0",
      gas: "30000000000000",
    },
    gas: BigInt("100000000000000"),
  });

  const proofHash = await computeSha256(
    `${tokenId}:${targetContract}:${methodName}:${argsJson}:${outcome.transaction?.hash}`
  );

  return { success: true, txHash: getTxHash(outcome), proofHash };
}

export async function mintAgentOnChain(
  newAgent: {
    token_id: string;
    name: string;
    capability: string;
    hourly_rate_near: number;
    specialization: string;
    description: string;
  },
  signerAccountId: string,
  privateKey?: string
): Promise<{ success: boolean; txHash: string }> {
  const account = getNearAccount(signerAccountId, privateKey);
  const outcome = await account.callFunctionRaw({
    contractId: NEAR_CONFIG.contractId,
    methodName: "mint_agent",
    args: {
      token_id: newAgent.token_id,
      name: newAgent.name,
      capability: newAgent.capability,
      rental_rate_per_sec: nearToYocto(newAgent.hourly_rate_near / 3600),
    },
    deposit: BigInt(nearToYocto(0.05)),
    gas: BigInt("100000000000000"),
  });
  return { success: true, txHash: getTxHash(outcome) };
}

export async function transferAgentOnChain(
  tokenId: string,
  receiverId: string,
  signerAccountId: string,
  privateKey?: string
): Promise<{ success: boolean; txHash: string }> {
  const account = getNearAccount(signerAccountId, privateKey);
  const outcome = await account.callFunctionRaw({
    contractId: NEAR_CONFIG.contractId,
    methodName: "nft_transfer",
    args: { receiver_id: receiverId, token_id: tokenId },
    deposit: BigInt("1"),
    gas: BigInt("60000000000000"),
  });
  return { success: true, txHash: getTxHash(outcome) };
}

export async function claimAgentRevenueOnChain(
  tokenId: string,
  signerAccountId: string,
  privateKey?: string
): Promise<{ success: boolean; txHash: string }> {
  const account = getNearAccount(signerAccountId, privateKey);
  const outcome = await account.callFunctionRaw({
    contractId: NEAR_CONFIG.contractId,
    methodName: "claim_agent_revenue",
    args: { token_id: tokenId },
    gas: BigInt("60000000000000"),
  });
  return { success: true, txHash: getTxHash(outcome) };
}
