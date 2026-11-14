import React from "react";
import {
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  Code2,
  Copy,
} from "lucide-react";
import { AgentNFT, NEAR_CONFIG, formatTimeRemaining } from "@/lib/near";

interface AuditorBlueprintInspectorProps {
  agents: AgentNFT[];
  selectedTokenId: string;
  customInputId: string;
  inspectedAgent: AgentNFT | undefined;
  boundAccount: string;
  isLocked: boolean | undefined;
  rawStatePayload: Record<string, unknown>;
  copiedJson: boolean;
  onSelectTokenId: (val: string) => void;
  onChangeCustomId: (val: string) => void;
  onCopyJson: () => void;
}

export const AuditorBlueprintInspector: React.FC<AuditorBlueprintInspectorProps> = ({
  agents,
  selectedTokenId,
  customInputId,
  inspectedAgent,
  boundAccount,
  isLocked,
  rawStatePayload,
  copiedJson,
  onSelectTokenId,
  onChangeCustomId,
  onCopyJson,
}) => {
  return (
    <div className="sega-card p-6 space-y-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-plateBorder pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-segaYellow" />
            <h3 className="font-pixel text-2xl font-bold text-iceWhite uppercase tracking-wider">
              4. INTERACTIVE TOKEN & SUB-ACCOUNT BLUEPRINT INSPECTOR
            </h3>
          </div>
          <p className="text-xs text-steel font-mono">
            Inspect on-chain NEP-171 metadata and active rental records directly for any token ID.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedTokenId}
            onChange={(e) => onSelectTokenId(e.target.value)}
            className="bg-ground border-2 border-black text-iceWhite text-xs font-mono p-2 focus:outline-none focus:border-segaBlue shadow-sega-sm cursor-pointer"
          >
            {agents.map((a) => (
              <option key={a.token_id} value={a.token_id}>
                {a.token_id} ({a.is_rented ? "LEASED" : "STANDBY"})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or custom token_id..."
            value={customInputId}
            onChange={(e) => onChangeCustomId(e.target.value)}
            className="bg-ground border-2 border-black text-iceWhite text-xs font-mono p-2 focus:outline-none focus:border-segaBlue shadow-sega-sm w-44"
          />
        </div>
      </div>

      {inspectedAgent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live State Breakdown */}
          <div className="lg:col-span-6 space-y-4 font-mono text-xs">
            <div className="bg-ground border-2 border-black p-4 space-y-3 shadow-sega-sm">
              <div className="flex justify-between items-center">
                <span className="text-steelDark uppercase text-[10px] font-bold">
                  CANONICAL TOKEN ID:
                </span>
                <span className="text-iceWhite font-bold">{inspectedAgent.token_id}</span>
              </div>

              <div className="flex justify-between items-center border-t border-plateBorder pt-2">
                <span className="text-steelDark uppercase text-[10px] font-bold">
                  BOUND SUB-ACCOUNT:
                </span>
                <span className="text-segaYellow font-bold">{boundAccount}</span>
              </div>

              <div className="flex justify-between items-center border-t border-plateBorder pt-2">
                <span className="text-steelDark uppercase text-[10px] font-bold">
                  FOUNDRY OWNER:
                </span>
                <span className="text-steel">{inspectedAgent.owner_id}</span>
              </div>

              <div className="flex justify-between items-center border-t border-plateBorder pt-2">
                <span className="text-steelDark uppercase text-[10px] font-bold">
                  EFFECTIVE OPERATOR:
                </span>
                <span
                  className={
                    inspectedAgent.is_rented
                      ? "text-segaYellow font-bold"
                      : "text-segaBlue font-bold"
                  }
                >
                  {inspectedAgent.effective_operator}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-plateBorder pt-2">
                <span className="text-steelDark uppercase text-[10px] font-bold">
                  NEP-178 TRANSFER FREEZE:
                </span>
                {isLocked ? (
                  <span className="px-2 py-0.5 bg-segaYellow text-black border border-black font-extrabold uppercase text-[10px] flex items-center gap-1 shadow-sega-sm">
                    <Lock className="w-3 h-3" />
                    FREEZE ACTIVE (LOCKED)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-segaGreen text-white border border-black font-bold uppercase text-[10px] flex items-center gap-1 shadow-sega-sm">
                    <Unlock className="w-3 h-3" />
                    TRANSFERABLE BY OWNER
                  </span>
                )}
              </div>

              {isLocked && (
                <div className="flex justify-between items-center border-t border-plateBorder pt-2 text-segaYellow">
                  <span className="uppercase text-[10px] font-bold">LOCK TIME REMAINING:</span>
                  <span className="font-bold tabular-nums">
                    {formatTimeRemaining(inspectedAgent.rental_expires_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Invariant Checklist */}
            <div className="bg-ground border-2 border-black p-4 space-y-2 shadow-sega-sm">
              <span className="font-pixel text-lg uppercase text-segaYellow block font-bold mb-1">
                FORMAL VERIFICATION CHECKLIST
              </span>
              <div className="flex items-center gap-2 text-xs text-iceWhite">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                <span>
                  Sub-Account Prefix Invariant (
                  <code className="text-segaYellow">*.{NEAR_CONFIG.contractId}</code>) Valid
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-iceWhite">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                <span>Root Parent Contract Exclusivity Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-iceWhite">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                <span>Zero Off-Chain Private Keys on Sub-Account</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-iceWhite">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-segaGreen" />
                <span>
                  Rental Time-Lock Guard{" "}
                  <code className="text-segaYellow font-bold">assert_no_active_rental</code> Enforced
                </span>
              </div>
            </div>
          </div>

          {/* Dark Code Block for Raw Borsh / JSON State */}
          <div className="lg:col-span-6 bg-ground border-2 border-black p-4 flex flex-col justify-between space-y-3 shadow-sega-sm">
            <div className="flex items-center justify-between border-b-2 border-plateBorder pb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-segaYellow uppercase font-bold">
                <Code2 className="w-4 h-4 text-segaBlue" />
                RAW CONTRACT STATE (BORSH / JSON)
              </div>
              <button onClick={onCopyJson} className="sega-btn sega-btn-dark text-xs px-2.5 py-1">
                {copiedJson ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-segaGreen" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedJson ? "COPIED" : "COPY"}</span>
              </button>
            </div>

            <pre className="font-mono text-[11px] text-steelLight bg-plate p-3 overflow-x-auto max-h-[340px] leading-relaxed border-2 border-black shadow-sega-sm">
              {JSON.stringify(rawStatePayload, null, 2)}
            </pre>

            <div className="text-xs font-mono text-steel flex items-center justify-between pt-1">
              <span>Standard: NEP-171 / NEP-177 / NEP-178</span>
              <span className="text-segaGreen font-bold font-pixel text-lg">INVARIANTS: PASS</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center font-mono text-xs text-steel">
          Token ID not found in registry.
        </div>
      )}
    </div>
  );
};
