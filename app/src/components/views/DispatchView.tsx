import React, { useState } from "react";
import {
  AgentNFT,
  TaskExecutionRecord,
  formatTimeRemaining,
} from "@/lib/near";
import { AuditFeed } from "@/components/AuditFeed";
import {
  Send,
  Clock,
  ShieldCheck,
  Play,
  AlertTriangle,
  Compass,
} from "lucide-react";

interface DispatchViewProps {
  agents: AgentNFT[];
  tasks: TaskExecutionRecord[];
  currentAccount: string;
  onExecuteWorkload: (
    agent: AgentNFT,
    targetContract: string,
    methodName: string,
    argsJson: string
  ) => Promise<void> | void;
  onOpenExecuteModal: (agent: AgentNFT) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({
  agents,
  tasks,
  currentAccount,
  onExecuteWorkload,
  onOpenExecuteModal,
}) => {
  const operableAgents = agents.filter(
    (a) => a.effective_operator === currentAccount || a.owner_id === currentAccount
  );

  const [selectedTokenId, setSelectedTokenId] = useState<string>(
    operableAgents[0]?.token_id || agents[0]?.token_id || ""
  );

  const selectedAgent =
    agents.find((a) => a.token_id === selectedTokenId) || operableAgents[0] || agents[0];

  const [targetContract, setTargetContract] = useState<string>("dex-pool.ref-finance.testnet");
  const [methodName, setMethodName] = useState<string>("rebalance_concentrated_pool");
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify(
      {
        pool_id: 104,
        min_price_spread_bps: 15,
        max_slippage: "0.003",
        timestamp: Date.now(),
      },
      null,
      2
    )
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isOperator =
    selectedAgent &&
    (selectedAgent.effective_operator === currentAccount || selectedAgent.owner_id === currentAccount);

  const handleQuickDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setIsSubmitting(true);
    try {
      await onExecuteWorkload(selectedAgent, targetContract, methodName, payloadText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="sega-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-segaYellow" />
              <h2 className="font-pixel text-3xl font-bold tracking-wider text-iceWhite uppercase">
                MISSION CONTROL & DELEGATED PROXY DISPATCH
              </h2>
            </div>
            <p className="text-xs text-steel font-mono">
              Command active autonomous AI workers on behalf of caller:{" "}
              <span className="text-segaYellow font-bold">{currentAccount}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 bg-ground border-2 border-black text-steel shadow-sega-sm">
              OPERABLE UNITS:{" "}
              <span className="text-segaYellow font-pixel text-xl tabular-nums">{operableAgents.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Task Dispatch Console */}
        <div className="lg:col-span-7 sega-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
            <h3 className="font-pixel text-2xl font-bold text-iceWhite uppercase flex items-center gap-2">
              <Send className="w-4 h-4 text-segaYellow" />
              ASSIGN AUTONOMOUS TASK WORKLOAD
            </h3>
            <span className="text-[10px] font-mono text-black bg-segaYellow border border-black px-2 py-0.5 font-extrabold shadow-sega-sm">
              NEP-171 BOUND
            </span>
          </div>

          <form onSubmit={handleQuickDispatch} className="space-y-4 text-xs font-mono">
            {/* Agent Selector */}
            <div>
              <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
                SELECT TARGET AI AGENT
              </label>
              <select
                value={selectedTokenId}
                onChange={(e) => setSelectedTokenId(e.target.value)}
                className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm cursor-pointer"
              >
                {agents.map((a) => (
                  <option key={a.token_id} value={a.token_id}>
                    {a.name} ({a.token_id}) — {a.is_rented ? `Rented to ${a.effective_operator}` : `Owned by ${a.owner_id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Account */}
            <div>
              <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
                TARGET NEAR CONTRACT ACCOUNT
              </label>
              <input
                type="text"
                required
                value={targetContract}
                onChange={(e) => setTargetContract(e.target.value)}
                className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
              />
            </div>

            {/* Method Name */}
            <div>
              <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
                EXECUTION METHOD NAME
              </label>
              <input
                type="text"
                required
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
              />
            </div>

            {/* Arguments Payload */}
            <div>
              <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
                PARAMETERS (JSON WORKLOAD PAYLOAD)
              </label>
              <textarea
                rows={5}
                required
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono text-[11px] focus:outline-none focus:border-segaBlue shadow-sega-sm"
              />
            </div>

            {/* Authority Warning */}
            {!isOperator && selectedAgent && (
              <div className="border-2 border-segaRed bg-segaRed/15 p-3 text-xs font-mono text-white flex gap-2 shadow-sega-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-segaYellow mt-0.5" />
                <div>
                  <strong className="text-segaYellow">ACCESS CONTROL ERROR:</strong> Account{" "}
                  <span className="font-bold">{currentAccount}</span> is not the authorized operator for{" "}
                  {selectedAgent.token_id}. Current operator is{" "}
                  <span className="font-bold text-segaYellow">{selectedAgent.effective_operator}</span>. The smart contract will reject this transaction.
                </div>
              </div>
            )}

            {/* Dispatch Action Button */}
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedAgent}
                className="sega-btn sega-btn-primary flex-1 py-3 text-base flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>DISPATCHING INSTRUCTION...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-segaYellow" />
                    EXECUTE AS AGENT (SUB-ACCOUNT PROXY)
                  </>
                )}
              </button>

              {selectedAgent && (
                <button
                  type="button"
                  onClick={() => onOpenExecuteModal(selectedAgent)}
                  className="sega-btn sega-btn-dark px-4 py-3 text-base"
                >
                  EXPAND MODAL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Selected Agent Identity Status Plate */}
        <div className="lg:col-span-5 sega-card p-6 flex flex-col justify-between space-y-5 sega-card-grid">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
              <span className="font-pixel text-xl uppercase tracking-widest text-segaYellow">
                ACTIVE UNIT TELEMETRY
              </span>
              <span className="text-[10px] font-mono text-white px-2 py-0.5 bg-segaBlue border border-black font-bold shadow-sega-sm">
                ONLINE TELEMETRY
              </span>
            </div>

            {selectedAgent ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-pixel text-3xl font-bold text-iceWhite tracking-wide">
                    {selectedAgent.name}
                  </h4>
                  <p className="text-xs text-steel font-mono mt-1">
                    {selectedAgent.capability}
                  </p>
                </div>

                {/* Sub-account details */}
                <div className="bg-ground border-2 border-black p-3 space-y-2 text-xs font-mono shadow-sega-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-steelDark uppercase font-bold">BOUND SUB-ACCOUNT:</span>
                    <span className="text-segaYellow font-bold">{selectedAgent.bound_subaccount}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-plateBorder pt-2">
                    <span className="text-[10px] text-steelDark uppercase font-bold">TOKEN OWNER:</span>
                    <span className="text-iceWhite font-semibold">{selectedAgent.owner_id}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-plateBorder pt-2">
                    <span className="text-[10px] text-steelDark uppercase font-bold">EFFECTIVE OPERATOR:</span>
                    <span className="text-segaYellow font-bold">{selectedAgent.effective_operator}</span>
                  </div>

                  {selectedAgent.is_rented && (
                    <div className="flex items-center justify-between border-t border-plateBorder pt-2 text-segaYellow">
                      <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        TIME-LOCK REMAINING:
                      </span>
                      <span className="font-bold tabular-nums font-mono">
                        {formatTimeRemaining(selectedAgent.rental_expires_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Telemetry numbers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-ground border-2 border-black p-3 shadow-sega-sm">
                    <span className="text-[10px] font-mono text-steel uppercase block font-bold">
                      TASKS SETTLED
                    </span>
                    <span className="font-pixel text-4xl font-black text-iceWhite tabular-nums">
                      {selectedAgent.tasks_completed.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-ground border-2 border-black p-3 shadow-sega-sm">
                    <span className="text-[10px] font-mono text-steel uppercase block font-bold">
                      REPUTATION SCORE
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-pixel text-4xl font-black text-segaYellow tabular-nums">
                        {selectedAgent.reputation_score}
                      </span>
                      <span className="font-mono text-xs text-steel font-bold">/1000</span>
                    </div>
                  </div>
                </div>

                {/* Sole Authority Architecture Card */}
                <div className="border-2 border-black bg-ground p-3 text-xs font-mono text-steel flex gap-2 shadow-sega-sm">
                  <ShieldCheck className="w-4 h-4 text-segaGreen shrink-0 mt-0.5" />
                  <div>
                    <span className="text-iceWhite font-bold block mb-0.5">SUB-ACCOUNT ACCESS KEY MATRIX</span>
                    Instructions are signed via cross-contract call using the NFT contract&apos;s parent root authority. No third-party key holds full access.
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-steel font-mono">No agent selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Live Execution Terminal Log */}
      <div>
        <AuditFeed tasks={tasks} />
      </div>
    </div>
  );
};
