export const TESTNET_DEFAULT_KEY =
  "ed25519:2GQPCG1chiGvyBoVcAks4LXkbHi4TqtRGZ4wo5Dp1rivX5F2KWg7ysTyYsWhcJmxAfJKpLcJRcgxCLd6S5Anm9EM";

export interface TestnetAccount {
  id: string;
  label: string;
  privateKey: string;
}

export const TESTNET_ACCOUNTS: TestnetAccount[] = [
  {
    id: "raga-renter-mw94dqty.testnet",
    label: "raga-renter-mw94dqty.testnet (Active Renter & Tenant)",
    privateKey: TESTNET_DEFAULT_KEY,
  },
  {
    id: "raga-operator-mw94dqty.testnet",
    label: "raga-operator-mw94dqty.testnet (Autonomous Worker Operator)",
    privateKey: TESTNET_DEFAULT_KEY,
  },
  {
    id: "raga-protocol-mw93m309.testnet",
    label: "raga-protocol-mw93m309.testnet (Contract Owner & Vault Landlord)",
    privateKey: TESTNET_DEFAULT_KEY,
  },
  {
    id: "judge.testnet",
    label: "judge.testnet (AI Hackathon Judge - Read/Audit Only)",
    privateKey: "",
  },
];
