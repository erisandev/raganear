import React from "react";
import { Lock } from "lucide-react";

interface AuditorTransferFreezeDiagramProps {
  isLocked: boolean | undefined;
  tokenId: string | undefined;
}

export const AuditorTransferFreezeDiagram: React.FC<AuditorTransferFreezeDiagramProps> = ({
  isLocked,
  tokenId,
}) => {
  return (
    <div className="sega-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-segaYellow" />
          <h3 className="font-pixel text-2xl font-bold text-iceWhite uppercase tracking-wider">
            2. NEP-178 TRANSFER FREEZE STATE MACHINE
          </h3>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 border-2 border-black font-extrabold shadow-sega-sm ${
            isLocked ? "bg-segaYellow text-black" : "bg-segaGreen text-white"
          }`}
        >
          {isLocked ? "LOCKED (FREEZE ACTIVE)" : "UNLOCKED (TRANSFERABLE)"}
        </span>
      </div>

      <div className="space-y-3 text-xs font-mono">
        <p className="text-steel leading-relaxed">
          When an AI worker is leased, the smart contract registers an immutable on-chain{" "}
          <code className="text-segaYellow font-bold">ActiveRental</code> record. Any call to{" "}
          <code className="text-iceWhite font-bold">nft_transfer</code>,{" "}
          <code className="text-iceWhite font-bold">nft_transfer_call</code>, or token burn
          immediately reverts.
        </p>

        {/* State Machine Transition Diagram */}
        <div className="bg-ground border-2 border-black p-3 space-y-2 shadow-sega-sm">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={`p-2 border-2 ${
                !isLocked
                  ? "border-black bg-segaGreen text-white font-bold shadow-sega-sm"
                  : "border-plateBorder text-steelDark"
              }`}
            >
              1. STANDBY
              <span className="block text-[9px] mt-0.5 opacity-90">Transfers Open</span>
            </div>
            <div
              className={`p-2 border-2 ${
                isLocked
                  ? "border-black bg-segaYellow text-black font-extrabold shadow-sega-sm"
                  : "border-plateBorder text-steelDark"
              }`}
            >
              2. TIME-LOCKED
              <span className="block text-[9px] mt-0.5 font-bold">Transfers Panic!</span>
            </div>
            <div className="p-2 border-2 border-plateBorder text-steelDark">
              3. EXPIRED
              <span className="block text-[9px] mt-0.5">Auto Reset</span>
            </div>
          </div>

          <div className="p-2.5 bg-plate border-2 border-black text-xs text-steel space-y-1">
            <span className="text-iceWhite font-bold block">
              SMART CONTRACT ENFORCEMENT INVARIANT:
            </span>
            <code className="text-segaYellow block font-bold font-mono">
              assert_no_active_rental(&self.active_rentals, &token_id);
            </code>
            <span className="block text-segaRed font-mono font-bold text-[11px]">
              Panics with: &ldquo;Transfer forbidden: token {tokenId} is locked under active
              rental...&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
