import React, { useState } from "react";
import { AgentNFT } from "@/lib/near";
import { Clock, ShieldAlert, X, Zap } from "lucide-react";

interface RentModalProps {
  agent: AgentNFT | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRent: (agent: AgentNFT, durationHours: number) => Promise<void> | void;
}

export const RentModal: React.FC<RentModalProps> = ({
  agent,
  isOpen,
  onClose,
  onConfirmRent,
}) => {
  const [durationHours, setDurationHours] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !agent) return null;

  const totalCostNear = (agent.hourly_rate_near * durationHours).toFixed(4);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirmRent(agent, durationHours);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const durationOptions = [
    { label: "1 Hour", hours: 1 },
    { label: "6 Hours", hours: 6 },
    { label: "24 Hours (1 Day)", hours: 24 },
    { label: "3 Days", hours: 72 },
    { label: "7 Days (1 Wk)", hours: 168 },
  ];

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
          <Clock className="w-6 h-6 text-segaYellow" />
          <h2 className="font-pixel text-3xl font-bold text-iceWhite tracking-wider uppercase">
            TIME-LOCKED AGENT RENTAL LEASE
          </h2>
        </div>

        <p className="text-xs text-steel font-mono mb-4">
          Leasing Autonomous AI Worker:{" "}
          <span className="text-segaYellow font-semibold">{agent.name}</span> (
          {agent.token_id})
        </p>

        {/* Bound Sub-Account Reference */}
        <div className="bg-ground border-2 border-black p-3 text-xs font-mono mb-5 space-y-1 shadow-sega-sm">
          <div className="text-[10px] text-steelDark uppercase font-bold">
            TARGET SUB-ACCOUNT AUTHORITY
          </div>
          <div className="text-segaYellow font-bold">{agent.bound_subaccount}</div>
        </div>

        {/* Duration Selection */}
        <div className="mb-5">
          <label className="block text-xs font-mono uppercase text-steel mb-2 font-bold">
            SELECT RENTAL DURATION (TIME-LOCK SLA)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt.hours}
                type="button"
                onClick={() => setDurationHours(opt.hours)}
                className={`p-2.5 text-xs font-mono text-left border-2 transition-all ${
                  durationHours === opt.hours
                    ? "bg-segaBlue border-black text-white font-bold shadow-sega"
                    : "bg-ground border-black text-steel hover:border-segaBlue shadow-sega-sm"
                }`}
              >
                <div className="font-pixel text-base uppercase">{opt.label}</div>
                <div className="text-[10px] text-segaYellow mt-0.5 font-bold">
                  {(agent.hourly_rate_near * opt.hours).toFixed(2)} NEAR
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-ground border-2 border-black p-4 mb-5 shadow-sega-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-steel uppercase font-bold">
              REQUIRED NEAR PROTOCOL DEPOSIT
            </span>
            <span className="text-[10px] font-mono text-steel">
              {agent.hourly_rate_near} NEAR/hr × {durationHours}h
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-5xl font-black text-segaYellow tabular-nums">
              {totalCostNear}
            </span>
            <span className="font-mono text-sm text-steel font-bold">NEAR</span>
          </div>
        </div>

        {/* SLA Guarantee Box */}
        <div className="border-2 border-black bg-ground p-3 text-xs font-mono text-steel mb-6 flex gap-2.5 shadow-sega-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 text-segaYellow mt-0.5" />
          <div>
            <strong className="block text-segaYellow font-bold mb-0.5">
              NEP-178 STRICT TRANSFER-LOCK SLA
            </strong>
            Under NEP-178 block timestamp constraints, the token owner cannot
            transfer or burn this worker while your lease is active. The smart
            contract exclusively grants you execution authority.
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
            onClick={handleConfirm}
            disabled={loading}
            className="sega-btn sega-btn-primary py-2.5 text-base flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>SIGNING ON NEAR...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-segaYellow" />
                EXECUTE LEASE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
