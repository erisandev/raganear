import React from "react";

interface MintStepIdentityProps {
  name: string;
  tokenId: string;
  description: string;
  onChangeName: (val: string) => void;
  onChangeTokenId: (val: string) => void;
  onChangeDescription: (val: string) => void;
}

export const MintStepIdentity: React.FC<MintStepIdentityProps> = ({
  name,
  tokenId,
  description,
  onChangeName,
  onChangeTokenId,
  onChangeDescription,
}) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="border-b-2 border-plateBorder pb-3">
        <h3 className="font-pixel text-2xl text-iceWhite uppercase">
          STAGE 1: PERSONA & AGENT IDENTITY
        </h3>
        <p className="text-steel text-xs mt-0.5">
          Define the agent designation, canonical token identifier, and public mission statement.
        </p>
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          AGENT DESIGNATION (NAME)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="e.g. Sentient Arbiter-01"
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
        />
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          TOKEN IDENTIFIER (TOKEN ID)
        </label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) =>
            onChangeTokenId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
          }
          placeholder="e.g. agent-arbiter-01"
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
        />
        <span className="text-[10px] text-steelDark mt-1 block">
          Must be valid lowercase identifier suitable for NEAR sub-account naming.
        </span>
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          AGENT MISSION DESCRIPTION
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="Describe worker duties, target environments, and SLA guarantees..."
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono text-[11px] focus:outline-none focus:border-segaBlue shadow-sega-sm"
        />
      </div>
    </div>
  );
};
