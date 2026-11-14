import React, { useState } from "react";
import { AgentNFT } from "@/lib/near";
import { Terminal, X, Zap, ShieldCheck } from "lucide-react";

interface ExecuteActionModalProps {
  agent: AgentNFT | null;
  isOpen: boolean;
  onClose: () => void;
  onExecute: (
    agent: AgentNFT,
    targetContract: string,
    methodName: string,
    argsJson: string
  ) => Promise<void> | void;
}

export const ExecuteActionModal: React.FC<ExecuteActionModalProps> = ({
  agent,
  isOpen,
  onClose,
  onExecute,
}) => {
  const [targetContract, setTargetContract] = useState<string>("dex-pool.ref-finance.testnet");
  const [methodName, setMethodName] = useState<string>("rebalance_pool");
  const [argsJson, setArgsJson] = useState<string>(
    JSON.stringify({ pool_id: 104, slippage_tolerance: 0.005, auto_harvest: true }, null, 2)
  );
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !agent) return null;

  const handleRun = async () => {
    setLoading(true);
    try {
      await onExecute(agent, targetContract, methodName, argsJson);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="sega-card w-full max-w-lg p-6 relative border-2 border-black shadow-sega-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-steel hover:text-white p-1 border-2 border-black bg-ground shadow-sega-sm transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-6 h-6 text-segaYellow" />
          <h2 className="font-pixel text-3xl font-bold text-iceWhite tracking-wider uppercase">
            DISPATCH SUB-ACCOUNT PROXY INSTRUCTION
          </h2>
        </div>

        <p className="text-xs text-steel font-mono mb-4">
          Autonomous execution via Token-Bound controller:{" "}
          <span className="text-segaYellow font-bold">{agent.bound_subaccount}</span>
        </p>

        {/* Controller Authority Banner */}
        <div className="border-2 border-black bg-ground p-3 text-xs font-mono mb-4 flex items-center justify-between shadow-sega-sm">
          <div>
            <span className="text-[10px] text-steel uppercase block font-bold">
              AUTHORIZED OPERATOR
            </span>
            <span className="text-iceWhite font-bold">{agent.effective_operator}</span>
          </div>
          <span className="text-[10px] font-mono text-black px-2 py-0.5 bg-segaYellow border border-black flex items-center gap-1 font-extrabold shadow-sega-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            SOLE AUTHORITY
          </span>
        </div>

        {/* Target Contract Input */}
        <div className="space-y-4 mb-5 text-xs font-mono">
          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              TARGET NEAR CONTRACT ACCOUNT
            </label>
            <input
              type="text"
              value={targetContract}
              onChange={(e) => setTargetContract(e.target.value)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
            />
          </div>

          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              METHOD TO INVOKE
            </label>
            <input
              type="text"
              value={methodName}
              onChange={(e) => setMethodName(e.target.value)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
            />
          </div>

          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              ARGUMENTS (JSON PAYLOAD)
            </label>
            <textarea
              rows={4}
              value={argsJson}
              onChange={(e) => setArgsJson(e.target.value)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm text-[11px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="sega-btn sega-btn-dark py-2.5 text-base"
          >
            CANCEL
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            className="sega-btn sega-btn-primary py-2.5 text-base flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>DISPATCHING PROOF...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-segaYellow" />
                DISPATCH ACTION
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
