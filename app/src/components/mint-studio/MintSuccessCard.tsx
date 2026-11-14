import React from "react";
import { CheckCircle2 } from "lucide-react";

interface MintSuccessCardProps {
  tokenId: string;
  boundSubaccount: string;
  onGoToMarketplace: () => void;
  onMintAnother: () => void;
}

export const MintSuccessCard: React.FC<MintSuccessCardProps> = ({
  tokenId,
  boundSubaccount,
  onGoToMarketplace,
  onMintAnother,
}) => {
  return (
    <div className="sega-card p-8 text-center font-mono space-y-4">
      <div className="w-14 h-14 bg-segaBlue border-2 border-black text-segaYellow mx-auto flex items-center justify-center shadow-sega">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="font-pixel text-4xl font-black text-iceWhite uppercase">
        TOKEN-BOUND AI WORKER FORGED ON NEAR
      </h3>
      <p className="text-xs text-steel max-w-md mx-auto">
        Successfully minted NEP-171 machine token{" "}
        <span className="text-segaYellow font-bold">{tokenId}</span> with exclusive parent
        authority over sub-account:
      </p>
      <div className="inline-block p-3 bg-ground border-2 border-black text-base font-bold text-segaYellow shadow-sega-sm font-mono">
        {boundSubaccount}
      </div>
      <div className="pt-4 flex justify-center gap-4">
        <button
          onClick={onGoToMarketplace}
          className="sega-btn sega-btn-primary px-6 py-2.5 text-base"
        >
          VIEW IN MARKETPLACE
        </button>
        <button
          onClick={onMintAnother}
          className="sega-btn sega-btn-dark px-6 py-2.5 text-base"
        >
          MINT ANOTHER UNIT
        </button>
      </div>
    </div>
  );
};
