import React from "react";
import { Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { NEAR_CONFIG } from "@/lib/near";

interface AuditorBindingProofProps {
  boundAccount: string;
}

export const AuditorBindingProof: React.FC<AuditorBindingProofProps> = ({ boundAccount }) => {
  return (
    <div className="sega-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-segaBlue" />
          <h3 className="font-pixel text-2xl font-bold text-iceWhite uppercase tracking-wider">
            1. SUB-ACCOUNT PARENT-CHILD BINDING
          </h3>
        </div>
        <span className="text-[10px] font-mono text-black border border-black bg-segaYellow px-2 py-0.5 font-extrabold shadow-sega-sm">
          HIERARCHICAL DETERMINISM
        </span>
      </div>

      <div className="space-y-3 text-xs font-mono">
        <p className="text-steel leading-relaxed">
          NEAR Protocol natively enforces that a sub-account formatted as{" "}
          <code className="text-segaYellow font-bold">&lt;token_id&gt;.{NEAR_CONFIG.contractId}</code>{" "}
          can only be created and signed for by the root contract{" "}
          <code className="text-iceWhite font-bold">{NEAR_CONFIG.contractId}</code>.
        </p>

        <div className="bg-ground border-2 border-black p-3 space-y-2 shadow-sega-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-steelDark uppercase font-bold">PARENT AUTHORITY (ROOT):</span>
            <span className="text-iceWhite font-mono font-bold">{NEAR_CONFIG.contractId}</span>
          </div>
          <div className="flex items-center justify-center py-1 text-segaYellow">
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-steelDark uppercase font-bold">BOUND CHILD SUB-ACCOUNT:</span>
            <span className="text-segaYellow font-mono font-bold">{boundAccount}</span>
          </div>
        </div>

        <div className="border-2 border-black bg-ground p-3 space-y-1.5 text-xs shadow-sega-sm">
          <div className="font-pixel text-lg text-segaYellow uppercase flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-segaGreen" />
            KEY SANDBOXING INVARIANT GUARANTEE
          </div>
          <p className="text-steel leading-normal">
            Because the parent contract never issues a{" "}
            <code className="text-iceWhite font-bold">FullAccess</code> key to any external user or
            off-chain operator, the sub-account is mathematically immune to private-key
            exfiltration, keylogger compromise, or unauthorized wallet drain.
          </p>
        </div>
      </div>
    </div>
  );
};
