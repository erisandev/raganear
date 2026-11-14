import React from "react";

interface MintCartridgePreviewProps {
  currentStep: number;
  tokenId: string;
  name: string;
  description: string;
  boundSubaccount: string;
  hourlyRateNear: number;
  currentAccount: string;
}

export const MintCartridgePreview: React.FC<MintCartridgePreviewProps> = ({
  currentStep,
  tokenId,
  name,
  description,
  boundSubaccount,
  hourlyRateNear,
  currentAccount,
}) => {
  return (
    <div className="lg:col-span-5 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-steel">
        <span className="font-pixel text-lg text-segaYellow uppercase tracking-wider">
          CARTRIDGE PREVIEW
        </span>
        <span className="text-segaBlue font-pixel text-base">[STAGE {currentStep}/4]</span>
      </div>

      <div className="sega-card p-5 space-y-4 sega-card-grid">
        <div className="flex items-center justify-between pb-3 border-b-2 border-plateBorder">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-segaGreen inline-block border border-black" />
            <span className="font-pixel text-xl font-bold text-iceWhite tracking-wider">
              {tokenId.toUpperCase()}
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-segaGreen text-white border border-black font-bold shadow-sega-sm">
            STANDBY // READY
          </span>
        </div>

        <div>
          <h4 className="font-pixel text-3xl font-bold text-iceWhite tracking-wide">
            {name || "Untitled Worker"}
          </h4>
          <p className="text-xs text-steel font-mono mt-1 leading-relaxed">
            {description || "No description provided."}
          </p>
        </div>

        {/* Bound Sub-Account Plate */}
        <div className="bg-ground border-2 border-black p-2.5 text-xs font-mono shadow-sega-sm">
          <span className="text-[9px] text-steelDark block uppercase font-bold tracking-wider">
            TOKEN-BOUND SUB-ACCOUNT
          </span>
          <span className="text-segaYellow font-bold truncate block text-xs">
            {boundSubaccount}
          </span>
        </div>

        {/* Revenue Preview */}
        <div className="bg-ground border-2 border-black p-3 shadow-sega-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-steel">LEASE RATE</span>
            <span className="text-xs font-mono text-segaYellow font-bold">
              {hourlyRateNear.toFixed(2)} NEAR/hr
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-pixel text-4xl font-black text-iceWhite tabular-nums">0.00</span>
            <span className="font-mono text-xs text-steel font-bold">NEAR ACCUMULATED</span>
          </div>
        </div>

        {/* Authority & Owner Matrix */}
        <div className="bg-ground border border-black p-2.5 text-xs font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-steel">OWNER:</span>
            <span className="text-iceWhite truncate max-w-[160px] font-semibold">
              {currentAccount}
            </span>
          </div>
          <div className="flex justify-between border-t border-plateBorder pt-1">
            <span className="text-steel">REPUTATION:</span>
            <span className="text-segaYellow font-bold">100 / 1000</span>
          </div>
        </div>
      </div>
    </div>
  );
};
