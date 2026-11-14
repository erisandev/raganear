import React, { useState } from "react";
import {
  AgentNFT,
  yoctoToNear,
  calculateTotalUnclaimed,
  formatTimeRemaining,
} from "@/lib/near";
import {
  Coins,
  Cpu,
  ArrowRightLeft,
  Settings,
  Lock,
  PlusSquare,
  Terminal,
} from "lucide-react";

interface FleetVaultViewProps {
  agents: AgentNFT[];
  currentAccount: string;
  onClaimAll: () => void;
  onClaimSingle: (agent: AgentNFT) => void;
  onOpenTransferModal: (agent: AgentNFT) => void;
  onUpdateRate: (agent: AgentNFT, newRate: number) => void;
  onGoToMint: () => void;
}

export const FleetVaultView: React.FC<FleetVaultViewProps> = ({
  agents,
  currentAccount,
  onClaimAll,
  onClaimSingle,
  onOpenTransferModal,
  onUpdateRate,
  onGoToMint,
}) => {
  const ownedAgents = agents.filter((a) => a.owner_id === currentAccount);
  const totalUnclaimedNear = calculateTotalUnclaimed(agents, currentAccount);
  const totalLifetimeRevenue = ownedAgents.reduce(
    (acc, a) => acc + yoctoToNear(a.total_revenue_accumulated),
    0
  );
  const estimatedFleetValue = ownedAgents.reduce(
    (acc, a) => acc + a.hourly_rate_near * 24 * 30 * 0.1 + yoctoToNear(a.total_revenue_accumulated) * 0.5,
    0
  );

  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [newRateInput, setNewRateInput] = useState<string>("");

  const handleStartEditRate = (agent: AgentNFT) => {
    setEditingTokenId(agent.token_id);
    setNewRateInput(agent.hourly_rate_near.toString());
  };

  const handleSaveRate = (agent: AgentNFT) => {
    const parsed = parseFloat(newRateInput);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateRate(agent, parsed);
    }
    setEditingTokenId(null);
  };

  return (
    <div className="space-y-6">
      {/* Fleet Top Metrics & Batch Claim Banner */}
      <div className="sega-card p-6 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b-2 border-plateBorder pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 bg-segaYellow border border-black inline-block" />
              <h2 className="font-pixel text-3xl font-bold tracking-wider text-iceWhite uppercase">
                FLEET VAULT & REVENUE REPOSITORY
              </h2>
            </div>
            <p className="text-xs text-steel font-mono">
              Managing token-bound sub-accounts registered to:{" "}
              <span className="text-segaYellow font-bold">{currentAccount}</span>
            </p>
          </div>

          {/* Batch Claim Action: Chunky Sega Sonic Yellow Button */}
          <div className="flex items-center gap-4 self-stretch lg:self-auto justify-between lg:justify-end">
            <div className="text-right">
              <span className="text-[10px] font-mono text-steel uppercase block font-bold">
                TOTAL CLAIMABLE YIELD
              </span>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="font-pixel text-5xl font-extrabold text-segaYellow tabular-nums">
                  {totalUnclaimedNear.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-steel font-bold">NEAR</span>
              </div>
            </div>

            <button
              onClick={onClaimAll}
              disabled={totalUnclaimedNear <= 0}
              className={`sega-btn text-base px-6 py-3 flex items-center gap-2 ${
                totalUnclaimedNear > 0
                  ? "sega-btn-yellow"
                  : "bg-ground border-2 border-plateBorder text-steelDark cursor-not-allowed opacity-50"
              }`}
            >
              <Coins className="w-5 h-5 text-black" />
              CLAIM ALL REVENUE
            </button>
          </div>
        </div>

        {/* 3 Metric Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-ground border-2 border-black p-4 shadow-sega-sm">
            <span className="text-xs font-mono uppercase text-steel block mb-1 font-bold">
              FLEET UNITS OWNED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-pixel text-5xl font-black text-iceWhite tabular-nums">
                {ownedAgents.length.toString().padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-steel font-bold">FOUNDRY UNITS</span>
            </div>
            <div className="mt-2 text-xs font-mono text-steel flex items-center justify-between border-t border-plateBorder pt-2">
              <span>Time-Locked Leases</span>
              <span className="text-segaYellow font-bold">
                {ownedAgents.filter((a) => a.is_rented).length} Units Active
              </span>
            </div>
          </div>

          <div className="bg-ground border-2 border-black p-4 shadow-sega-sm">
            <span className="text-xs font-mono uppercase text-steel block mb-1 font-bold">
              LIFETIME FLEET REVENUE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-pixel text-5xl font-black text-segaYellow tabular-nums">
                {totalLifetimeRevenue.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-steel font-bold">NEAR ACCUMULATED</span>
            </div>
            <div className="mt-2 text-xs font-mono text-steel flex items-center justify-between border-t border-plateBorder pt-2">
              <span>Smart Contract Settlement</span>
              <span className="text-segaBlue font-bold">100% On-Chain</span>
            </div>
          </div>

          <div className="bg-ground border-2 border-black p-4 shadow-sega-sm">
            <span className="text-xs font-mono uppercase text-steel block mb-1 font-bold">
              ESTIMATED PORTFOLIO VALUE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-pixel text-5xl font-black text-iceWhite tabular-nums">
                {estimatedFleetValue.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-steel font-bold">NEAR VALUATION</span>
            </div>
            <div className="mt-2 text-xs font-mono text-steel flex items-center justify-between border-t border-plateBorder pt-2">
              <span>Asset Yield Class</span>
              <span className="text-segaYellow font-bold">Autonomous Labor Capital</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Management Table */}
      <div className="sega-card">
        <div className="p-4 border-b-2 border-plateBorder flex items-center justify-between">
          <h3 className="font-pixel text-2xl font-bold uppercase tracking-wider text-iceWhite flex items-center gap-2">
            <Cpu className="w-5 h-5 text-segaYellow" />
            TOKEN-BOUND INVENTORY ({ownedAgents.length})
          </h3>
          <button
            onClick={onGoToMint}
            className="sega-btn sega-btn-primary py-1 px-3 text-base flex items-center gap-1.5"
          >
            <PlusSquare className="w-4 h-4 text-segaYellow" />
            MINT AGENT
          </button>
        </div>

        {ownedAgents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-ground text-xs uppercase text-segaYellow font-bold">
                  <th className="py-3 px-4">AGENT / TOKEN ID</th>
                  <th className="py-3 px-4">BOUND SUB-ACCOUNT</th>
                  <th className="py-3 px-4">STATUS // OPERATOR</th>
                  <th className="py-3 px-4">LEASE RATE (NEAR/HR)</th>
                  <th className="py-3 px-4">LIFETIME YIELD</th>
                  <th className="py-3 px-4">UNCLAIMED</th>
                  <th className="py-3 px-4 text-right">VAULT ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plateBorder">
                {ownedAgents.map((agent) => {
                  const unclaimed = yoctoToNear(agent.unclaimed_revenue);
                  const lifetime = yoctoToNear(agent.total_revenue_accumulated);
                  const isEditing = editingTokenId === agent.token_id;

                  return (
                    <tr key={agent.token_id} className="hover:bg-plateHover transition-colors">
                      {/* Name & Token ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-pixel text-xl font-bold text-iceWhite">{agent.name}</div>
                        <div className="text-[10px] text-steel font-mono">{agent.token_id}</div>
                      </td>

                      {/* Bound Sub-account */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-segaYellow font-bold">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-segaBlue shrink-0" />
                          <span className="truncate max-w-[180px]">{agent.bound_subaccount}</span>
                        </div>
                      </td>

                      {/* Status // Operator */}
                      <td className="py-3.5 px-4">
                        {agent.is_rented ? (
                          <div className="space-y-0.5">
                            <span className="px-1.5 py-0.5 bg-segaYellow text-black border border-black text-[9px] uppercase font-extrabold inline-flex items-center gap-1 shadow-sega-sm">
                              <Lock className="w-2.5 h-2.5" />
                              LEASED TO:
                            </span>
                            <div className="text-[10px] text-iceWhite truncate max-w-[140px] font-bold">
                              {agent.effective_operator}
                            </div>
                            <div className="text-[10px] text-segaYellow font-mono font-bold">
                              {formatTimeRemaining(agent.rental_expires_at)}
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-segaGreen text-white border border-black text-[10px] uppercase font-bold inline-block shadow-sega-sm">
                            STANDBY (OWNER OP)
                          </span>
                        )}
                      </td>

                      {/* Lease Rate & Inline Edit */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={newRateInput}
                              onChange={(e) => setNewRateInput(e.target.value)}
                              className="w-16 bg-ground border-2 border-segaBlue text-white p-1 text-xs font-mono"
                            />
                            <button
                              onClick={() => handleSaveRate(agent)}
                              className="px-2 py-1 bg-segaBlue text-white font-bold text-[10px] border border-black shadow-sega-sm"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => setEditingTokenId(null)}
                              className="px-2 py-1 bg-plateBorder text-steel text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-pixel text-2xl font-bold text-iceWhite tabular-nums">
                              {agent.hourly_rate_near.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-steel">NEAR</span>
                            {!agent.is_rented && (
                              <button
                                onClick={() => handleStartEditRate(agent)}
                                title="Update Hourly Rental Rate"
                                className="text-steel hover:text-white p-0.5"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Lifetime Yield */}
                      <td className="py-3.5 px-4 font-pixel text-2xl font-bold text-iceWhite tabular-nums">
                        {lifetime.toFixed(2)} NEAR
                      </td>

                      {/* Unclaimed Yield */}
                      <td className="py-3.5 px-4">
                        {unclaimed > 0 ? (
                          <div className="space-y-1">
                            <span className="font-pixel text-2xl font-bold text-segaYellow block tabular-nums">
                              {unclaimed.toFixed(2)} NEAR
                            </span>
                            <button
                              onClick={() => onClaimSingle(agent)}
                              className="sega-btn sega-btn-yellow px-2 py-0.5 text-xs font-bold"
                            >
                              CLAIM
                            </button>
                          </div>
                        ) : (
                          <span className="text-steelDark text-[10px]">0.00 NEAR</span>
                        )}
                      </td>

                      {/* Vault Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenTransferModal(agent)}
                            disabled={agent.is_rented}
                            title={
                              agent.is_rented
                                ? "LOCKED: Cannot transfer while active rental lease is running"
                                : "Transfer NFT & Sub-Account Authority"
                            }
                            className={`sega-btn text-xs px-2.5 py-1 ${
                              agent.is_rented
                                ? "bg-ground border border-plateBorder text-steelDark cursor-not-allowed opacity-50"
                                : "sega-btn-dark text-iceWhite hover:text-white"
                            }`}
                          >
                            {agent.is_rented ? (
                              <>
                                <Lock className="w-3 h-3 text-segaYellow" />
                                LOCKED
                              </>
                            ) : (
                              <>
                                <ArrowRightLeft className="w-3 h-3 text-steel" />
                                TRANSFER
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center font-mono text-xs text-steel space-y-2">
            <p className="font-pixel text-2xl text-segaYellow font-bold">NO AGENTS CURRENTLY OWNED BY THIS ACCOUNT</p>
            <p className="text-steel">
              Switch to <code className="text-segaYellow font-bold">raga-protocol-mw93m309.testnet</code> to view deployed units, or mint a new unit in Mint Studio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
