export interface NearConfig {
  networkId: string;
  nodeUrl: string;
  contractId: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
}

export const NEAR_CONFIG: NearConfig = {
  networkId: "testnet",
  nodeUrl: "https://near-testnet.drpc.org",
  contractId: "raga-protocol-mw93m309.testnet",
  walletUrl: "https://testnet.mynearwallet.com",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};
