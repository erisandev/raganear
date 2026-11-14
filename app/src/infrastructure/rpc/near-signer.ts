import { Account, KeyPair, KeyPairSigner } from "near-api-js";
import { getRpcProvider } from "./near-provider";
import { TESTNET_DEFAULT_KEY } from "@/config/testnet-accounts";

/**
 * Creates an authenticated Account instance for on-chain transaction signing.
 */
export function getNearAccount(accountId: string, privateKey?: string): Account {
  const provider = getRpcProvider();
  const key = privateKey || TESTNET_DEFAULT_KEY;
  const keyPair = KeyPair.fromString(key as any);
  const signer = new KeyPairSigner(keyPair);
  return new Account(accountId, provider, signer);
}
