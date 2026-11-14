import React from "react";
import { Compass } from "lucide-react";

interface MintProgressTrackProps {
  currentAccount: string;
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const MintProgressTrack: React.FC<MintProgressTrackProps> = ({
  currentAccount,
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    { step: 1, label: "1. PERSONA & ID" },
    { step: 2, label: "2. SKILL MATRIX" },
    { step: 3, label: "3. SUB-ACCOUNT" },
    { step: 4, label: "4. MONETIZATION" },
  ];

  return (
    <div className="sega-card p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-segaYellow" />
            <h2 className="font-pixel text-3xl font-bold tracking-wider text-iceWhite uppercase">
              AI WORKER TOKEN-BOUND FORGE STUDIO
            </h2>
          </div>
          <p className="text-xs text-steel font-mono">
            Registering new NEP-171 machine passport for foundry owner:{" "}
            <span className="text-segaYellow font-bold">{currentAccount}</span>
          </p>
        </div>

        <div className="text-sm font-pixel text-segaYellow font-bold px-3 py-1 bg-ground border-2 border-black shadow-sega-sm">
          STAGE {currentStep} OF 4
        </div>
      </div>

      {/* 4-Step Progress Track */}
      <div className="grid grid-cols-4 gap-2 mt-6">
        {steps.map((item) => (
          <div
            key={item.step}
            onClick={() => onSelectStep(item.step)}
            className={`p-2.5 border-2 text-center font-pixel text-base uppercase cursor-pointer transition-all ${
              currentStep === item.step
                ? "bg-segaBlue border-black text-white font-bold shadow-sega"
                : currentStep > item.step
                ? "bg-ground border-black text-segaYellow font-bold shadow-sega-sm"
                : "bg-ground border-plateBorder text-steelDark hover:border-steel"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
