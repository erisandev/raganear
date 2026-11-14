import React from "react";
import { Compass } from "lucide-react";

export const AuditorBanner: React.FC = () => {
  return (
    <div className="sega-card p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-segaYellow" />
            <h2 className="font-pixel text-3xl font-bold tracking-wider text-iceWhite uppercase">
              16-BIT SECURITY LABORATORY & TRANSFER-FREEZE AUDITOR
            </h2>
          </div>
          <p className="text-xs text-steel font-mono">
            Formal verification console & cryptographic delegation inspector for NEAR AI judges and
            security auditors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-pixel px-3 py-1 bg-segaBlue text-white border-2 border-black uppercase font-bold shadow-sega-sm flex items-center gap-1.5">
            <span className="w-2 h-2 bg-segaYellow inline-block border border-black" />
            FORMALLY VERIFIED STATE INVARIANTS
          </span>
        </div>
      </div>
    </div>
  );
};
