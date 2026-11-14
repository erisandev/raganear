import React, { useState, useEffect } from "react";
import {
  AgentNFT,
  yoctoToNear,
  formatTimeRemaining,
} from "@/lib/near";
import {
  Clock,
  Terminal,
  Zap,
  Lock,
  ArrowRightLeft,
  CheckCircle2,
  Copy,
  Coins,
  Cpu,
} from "lucide-react";

interface AgentIdentityCardProps {
  agent: AgentNFT;
  currentViewerAccount: string;
  onOpenRentModal: (agent: AgentNFT) => void;
  onOpenExecuteModal: (agent: AgentNFT) => void;
  onOpenTransferModal: (agent: AgentNFT) => void;
  onClaimRevenue: (agent: AgentNFT) => void;
}

export const AgentIdentityCard: React.FC<AgentIdentityCardProps> = ({
  agent,
  currentViewerAccount,
  onOpenRentModal,
  onOpenExecuteModal,
  onOpenTransferModal,
  onClaimRevenue,
}) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>(
    formatTimeRemaining(agent.rental_expires_at)
  );

  useEffect(() => {
    if (!agent.is_rented || !agent.rental_expires_at) return;
    const interval = setInterval(() => {
      setCountdown(formatTimeRemaining(agent.rental_expires_at));
    }, 1000);
    return () => clearInterval(interval);
  }, [agent.is_rented, agent.rental_expires_at]);

  const lifetimeRevenue = yoctoToNear(agent.total_revenue_accumulated);
  const unclaimedRevenue = yoctoToNear(agent.unclaimed_revenue);

  const isOwner = currentViewerAccount === agent.owner_id;
  const isOperator = currentViewerAccount === agent.effective_operator;

  const handleCopySubaccount = () => {
    navigator.clipboard.writeText(agent.bound_subaccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const repPercent = Math.min(100, Math.max(10, Math.round((agent.reputation_score / 1000) * 100)));

  return (
    <div className="sega-card flex flex-col justify-between relative group sega-card-grid">
      {/* Top Header: Passport Serial & Arcade Cartridge Watermark */}
      <div className="p-4 border-b-2 border-plateBorder bg-ground/90">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-segaYellow border border-black inline-block" />
            <span className="font-pixel text-lg tracking-wider text-segaYellow uppercase">
              ROM // {agent.token_id.toUpperCase()}
            </span>
          </div>

          <span className="text-[10px] font-mono border-2 border-black px-2 py-0.5 text-black uppercase bg-segaYellow font-extrabold shadow-sega-sm">
            {agent.category}
          </span>
        </div>

        {/* Media Frame & 16-Bit Cartridge Display */}
        <div className="border-2 border-black bg-plate p-3 relative shadow-sega-sm my-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Arcade Pixel Icon Badge */}
              <div className="w-11 h-11 border-2 border-black bg-segaBlue flex items-center justify-center relative shrink-0 shadow-sega-sm">
                <Cpu className="w-6 h-6 text-segaYellow" />
              </div>

              <div>
                <h3 className="font-pixel text-2xl font-bold text-iceWhite tracking-wide leading-none">
                  {agent.name}
                </h3>
                <span className="text-[10px] font-mono text-steel block mt-1">
                  SPEC: {agent.specialization}
                </span>
              </div>
            </div>

            {/* Live Operational Indicator */}
            {agent.is_rented ? (
              <span className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase font-extrabold bg-segaYellow text-black border-2 border-black shadow-sega-sm flex items-center gap-1">
                <Lock className="w-3 h-3 text-black" />
                LEASED
              </span>
            ) : (
              <span className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase font-bold bg-segaGreen text-white border-2 border-black shadow-sega-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-white inline-block" />
                STANDBY
              </span>
            )}
          </div>

          <p className="text-xs text-steel leading-relaxed mt-2.5 font-sans border-t border-plateBorder pt-2">
            {agent.description}
          </p>
        </div>

        {/* Sub-Account Binding Chip */}
        <div className="bg-ground border-2 border-black p-2.5 flex items-center justify-between text-xs font-mono mt-3 shadow-sega-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Terminal className="w-3.5 h-3.5 text-segaYellow shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-pixel text-steel uppercase tracking-widest">
                BOUND SUB-ACCOUNT CHIP
              </span>
              <span className="text-iceWhite font-semibold truncate text-[11px]">
                {agent.bound_subaccount}
              </span>
            </div>
          </div>
          <button
            onClick={handleCopySubaccount}
            title="Copy Sub-Account ID"
            className="p-1 bg-plate hover:bg-segaBlue text-steel hover:text-white transition-all ml-2 shrink-0 border border-black shadow-sega-sm"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-segaGreen" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Middle Specs & Telemetry Matrix */}
      <div className="p-4 space-y-3">
        {/* Cumulative Revenue & Rate */}
        <div className="bg-ground border-2 border-black p-3 relative shadow-sega-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-steel font-bold">
              CUMULATIVE EARNED REVENUE
            </span>
            <span className="text-xs font-mono text-steel">
              RATE: <strong className="text-segaYellow font-bold">{agent.hourly_rate_near} NEAR/hr</strong>
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-pixel text-4xl font-black text-segaYellow tracking-tight tabular-nums">
                {lifetimeRevenue.toFixed(2)}
              </span>
              <span className="font-mono text-xs text-steel font-bold">NEAR</span>
            </div>

            {/* Unclaimed Yield Section */}
            {unclaimedRevenue > 0 && (
              <div className="text-right">
                <span className="text-[9px] font-mono text-segaYellow uppercase block font-extrabold">
                  UNCLAIMED YIELD
                </span>
                <span className="font-pixel text-2xl font-bold text-segaYellow tabular-nums">
                  {unclaimedRevenue.toFixed(2)} NEAR
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Technical Gauge: Tasks Verified & Reputation Meter */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-ground border-2 border-black p-2.5 shadow-sega-sm">
            <span className="text-[9px] font-mono text-steel block uppercase tracking-wider font-bold">
              VERIFIED TASKS
            </span>
            <span className="font-pixel text-3xl font-bold text-iceWhite tabular-nums">
              {agent.tasks_completed.toLocaleString()}
            </span>
          </div>

          <div className="bg-ground border-2 border-black p-2.5 shadow-sega-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-steel uppercase tracking-wider font-bold">
                REPUTATION
              </span>
              <span className="text-xs text-segaYellow tabular-nums font-bold">
                {agent.reputation_score}/1000
              </span>
            </div>
            {/* 16-Bit Step Bar */}
            <div className="w-full bg-ground border border-black h-2 mt-2 flex p-0.5">
              <div
                className="bg-segaBlue h-full transition-all duration-300"
                style={{ width: `${repPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Authority & Delegation Plate */}
        <div className="border border-plateBorder bg-ground/70 p-2 text-[10px] font-mono space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-steelDark">OWNER:</span>
            <span className="text-steel font-medium truncate max-w-[180px]">
              {agent.owner_id} {isOwner && <strong className="text-segaYellow">(YOU)</strong>}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-plateBorder/40 pt-1">
            <span className="text-steelDark">OPERATOR:</span>
            <span
              className={`font-semibold truncate max-w-[180px] ${
                agent.is_rented ? "text-segaYellow font-bold" : "text-segaBlue"
              }`}
            >
              {agent.effective_operator} {isOperator && <strong className="text-segaYellow">(YOU)</strong>}
            </span>
          </div>

          {agent.is_rented && (
            <div className="flex items-center justify-between border-t border-plateBorder/40 pt-1">
              <span className="text-segaYellow flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3" />
                FREEZE LOCK:
              </span>
              <span className="font-bold text-segaYellow font-mono tracking-tight tabular-nums">
                {countdown}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls Button Bar with Chunky Physical Sega Buttons */}
      <div className="p-4 pt-2 border-t-2 border-plateBorder bg-ground/50 space-y-2">
        {agent.is_rented ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenExecuteModal(agent)}
              className="sega-btn sega-btn-primary w-full py-2.5 text-base flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-segaYellow" />
              DISPATCH
            </button>
            <button
              disabled
              title="Transfers are strictly locked under NEP-178 active rental invariant"
              className="sega-btn w-full bg-ground border-2 border-segaAmber text-segaAmber py-2.5 text-base flex items-center justify-center gap-1.5 opacity-80 cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              LOCKED
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenRentModal(agent)}
              className="sega-btn sega-btn-primary w-full py-2.5 text-base flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-segaYellow" />
              LEASE UNIT
            </button>
            <button
              onClick={() => onOpenTransferModal(agent)}
              disabled={!isOwner}
              title={!isOwner ? "Only token owner can initiate transfer" : "Transfer NFT"}
              className={`sega-btn w-full py-2.5 text-base flex items-center justify-center gap-1.5 ${
                isOwner
                  ? "sega-btn-dark hover:text-white"
                  : "bg-ground border-2 border-plateBorder text-steelDark cursor-not-allowed opacity-50"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              TRANSFER
            </button>
          </div>
        )}

        {/* Claim Revenue Button for Owner */}
        {isOwner && unclaimedRevenue > 0 && (
          <button
            onClick={() => onClaimRevenue(agent)}
            className="sega-btn sega-btn-yellow w-full py-2 text-base flex items-center justify-center gap-1.5"
          >
            <Coins className="w-4 h-4" />
            CLAIM {unclaimedRevenue.toFixed(2)} NEAR YIELD
          </button>
        )}
      </div>
    </div>
  );
};
