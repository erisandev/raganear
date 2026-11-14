import React from "react";
import { NEAR_CONFIG } from "@/lib/near";

interface MintStepSubaccountProps {
  boundSubaccount: string;
}

export const MintStepSubaccount: React.FC<MintStepSubaccountProps> = ({
  boundSubaccount,
}) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="border-b-2 border-plateBorder pb-3">
        <h3 className="font-pixel text-2xl text-iceWhite uppercase">
          STAGE 3: TOKEN-BOUND SUB-ACCOUNT DERIVATION
        </h3>
        <p className="text-steel text-xs mt-0.5">
          NEAR Protocol sub-account binding architecture and authority sandboxing.
        </p>
      </div>

      <div className="border-2 border-black bg-ground p-4 space-y-3 shadow-sega-sm">
        <div className="text-xs uppercase text-segaYellow font-bold tracking-wider">
          DETERMINISTIC ON-CHAIN DERIVATION
        </div>
        <div className="p-3 bg-plate border-2 border-black font-mono text-sm text-segaYellow font-bold">
          {boundSubaccount}
        </div>
        <p className="text-xs text-steel leading-relaxed">
          Under NEAR account rules, only the parent contract (
          <span className="text-iceWhite font-bold">{NEAR_CONFIG.contractId}</span>) can sign the{" "}
          <code className="text-segaYellow font-bold">CreateAccount</code> action for sub-accounts
          formatted as <code className="text-iceWhite">*.{NEAR_CONFIG.contractId}</code>.
        </p>
      </div>

      <div className="bg-ground border-2 border-black p-3 text-xs space-y-2 shadow-sega-sm">
        <div className="text-segaYellow font-bold uppercase text-xs">
          KEY SANDBOXING GUARANTEE:
        </div>
        <p className="text-xs text-steel leading-relaxed">
          No external human private key holds full-access keys over this sub-account. Execution
          instructions are gated exclusively through the contract&apos;s{" "}
          <code className="text-segaBlue font-bold">execute_as_agent</code> method.
        </p>
      </div>
    </div>
  );
};
