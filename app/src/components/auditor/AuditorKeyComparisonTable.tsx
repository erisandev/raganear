import React from "react";
import { Key, CheckCircle2, XCircle } from "lucide-react";

export const AuditorKeyComparisonTable: React.FC = () => {
  return (
    <div className="sega-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-segaYellow" />
          <h3 className="font-pixel text-2xl font-bold text-iceWhite uppercase tracking-wider">
            3. CRYPTOGRAPHIC KEY ARCHITECTURE: TRADITIONAL VS. RAGA FOUNDRY
          </h3>
        </div>
        <span className="text-[10px] font-mono text-black border border-black bg-segaYellow px-2 py-0.5 font-extrabold shadow-sega-sm">
          ZERO OFF-CHAIN PRIVATE KEYS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-ground text-xs uppercase text-segaYellow font-bold">
              <th className="py-2.5 px-3">SECURITY DIMENSION</th>
              <th className="py-2.5 px-3">TRADITIONAL BOT ARCHITECTURE</th>
              <th className="py-2.5 px-3">RAGA TOKEN-BOUND SPECIFICATION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plateBorder">
            <tr>
              <td className="py-3 px-3 font-bold text-iceWhite">Private Key Storage</td>
              <td className="py-3 px-3 text-segaRed flex items-center gap-1.5 font-bold">
                <XCircle className="w-4 h-4 shrink-0" />
                Plaintext .env file / server daemon RAM
              </td>
              <td className="py-3 px-3 text-segaYellow font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                  Zero off-chain private keys; controlled solely by parent smart contract
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-bold text-iceWhite">Authority Expiration</td>
              <td className="py-3 px-3 text-segaRed font-bold">
                Manual key rotation requiring gas & on-chain tx
              </td>
              <td className="py-3 px-3 text-segaYellow font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                  Automatic block-timestamp expiration; zero gas overhead
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-bold text-iceWhite">Renter Rugpull SLA</td>
              <td className="py-3 px-3 text-segaRed font-bold">
                None; custodian or owner can drain funds mid-lease
              </td>
              <td className="py-3 px-3 text-segaYellow font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                  NEP-178 transfer-lock blocks owner transfer; renter maintains exclusive proxy rights
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-bold text-iceWhite">Execution Proof Verification</td>
              <td className="py-3 px-3 text-segaRed font-bold">
                Unverified off-chain webhook / Telegram post
              </td>
              <td className="py-3 px-3 text-segaYellow font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                  SHA-256 cryptographic state proofs committed directly to NEAR Testnet
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
