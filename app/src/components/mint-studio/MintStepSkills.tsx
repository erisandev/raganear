import React from "react";

export type SpecializationType =
  | "DEFI_YIELD"
  | "SECURITY_SENTINEL"
  | "ORACLE_ATTESTATION"
  | "ARBITRAGE_ENGINE";

interface MintStepSkillsProps {
  specialization: SpecializationType;
  capability: string;
  onChangeSpecialization: (val: SpecializationType) => void;
  onChangeCapability: (val: string) => void;
}

export const MintStepSkills: React.FC<MintStepSkillsProps> = ({
  specialization,
  capability,
  onChangeSpecialization,
  onChangeCapability,
}) => {
  const capabilityMap: Record<SpecializationType, string> = {
    DEFI_YIELD: "Cross-DEX Yield Optimizer & Arbitrageur",
    SECURITY_SENTINEL: "Autonomous Invariant Guardian & Mempool Monitor",
    ORACLE_ATTESTATION: "Cryptographic Zero-Knowledge Price Attestor",
    ARBITRAGE_ENGINE: "High-Frequency Algorithmic AMM Operator",
  };

  const handleSelectSpecialization = (sp: SpecializationType) => {
    onChangeSpecialization(sp);
    onChangeCapability(capabilityMap[sp]);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="border-b-2 border-plateBorder pb-3">
        <h3 className="font-pixel text-2xl text-iceWhite uppercase">
          STAGE 2: CAPABILITY & SKILL MATRIX
        </h3>
        <p className="text-steel text-xs mt-0.5">
          Select autonomous workload archetype and configure capability specifications.
        </p>
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          WORKLOAD SPECIALIZATION ARCHETYPE
        </label>
        <select
          value={specialization}
          onChange={(e) => handleSelectSpecialization(e.target.value as SpecializationType)}
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm cursor-pointer"
        >
          <option value="DEFI_YIELD">
            DEFI_YIELD — Flash Arbitrage & Concentrated Pool Rebalance
          </option>
          <option value="SECURITY_SENTINEL">
            SECURITY_SENTINEL — Invariant & Re-entrancy Guardian
          </option>
          <option value="ORACLE_ATTESTATION">
            ORACLE_ATTESTATION — Zero-Knowledge Price Feed Attestation
          </option>
          <option value="ARBITRAGE_ENGINE">
            ARBITRAGE_ENGINE — High-Frequency Orderbook Execution
          </option>
        </select>
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          CAPABILITY SPECIFICATION STRING
        </label>
        <input
          type="text"
          value={capability}
          onChange={(e) => onChangeCapability(e.target.value)}
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
        />
      </div>

      <div className="bg-ground border-2 border-black p-3 space-y-2 shadow-sega-sm">
        <span className="text-xs uppercase text-segaYellow block font-bold">
          INITIAL REPUTATION CALIBRATION
        </span>
        <div className="flex items-center justify-between text-xs">
          <span className="text-steel">Base Network Reputation:</span>
          <span className="font-pixel text-3xl font-black text-segaYellow tabular-nums">
            100 / 1000
          </span>
        </div>
        <p className="text-[10px] text-steel">
          Reputation scales dynamically on-chain as the worker settles verified SHA-256 cryptographic
          task proofs (+15 pts per verified execution).
        </p>
      </div>
    </div>
  );
};
