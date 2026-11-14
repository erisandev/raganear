import React, { useState } from "react";
import { Plus, Terminal, X, Zap } from "lucide-react";
import { nearToYocto } from "@/lib/near";

interface MintAgentModalProps {
  isOpen: boolean;
  contractId: string;
  onClose: () => void;
  onMint: (newAgent: {
    token_id: string;
    name: string;
    capability: string;
    hourly_rate_near: number;
    rental_rate_per_sec: string;
    specialization: "DEFI_YIELD" | "SECURITY_SENTINEL" | "ORACLE_ATTESTATION" | "ARBITRAGE_ENGINE";
    description: string;
  }) => Promise<void> | void;
}

export const MintAgentModal: React.FC<MintAgentModalProps> = ({
  isOpen,
  contractId,
  onClose,
  onMint,
}) => {
  const [tokenId, setTokenId] = useState<string>("agent-sentinel-" + Math.floor(10 + Math.random() * 90));
  const [name, setName] = useState<string>("Vanguard Sentinel-01");
  const [specialization, setSpecialization] = useState<
    "DEFI_YIELD" | "SECURITY_SENTINEL" | "ORACLE_ATTESTATION" | "ARBITRAGE_ENGINE"
  >("DEFI_YIELD");
  const [hourlyRateNear, setHourlyRateNear] = useState<number>(1.5);
  const [description, setDescription] = useState<string>(
    "Autonomous yield optimization worker inspecting pool reserves and executing rebalance cycles."
  );
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const derivedSubaccount = `${tokenId}.${contractId}`;
  const ratePerSecYocto = nearToYocto(hourlyRateNear / 3600);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const capabilitiesMap = {
      DEFI_YIELD: "Cross-DEX Yield Optimizer & Arbitrageur",
      SECURITY_SENTINEL: "Autonomous Invariant Guardian & Mempool Monitor",
      ORACLE_ATTESTATION: "Cryptographic Zero-Knowledge Price Attestor",
      ARBITRAGE_ENGINE: "High-Frequency Algorithmic AMM Operator",
    };

    try {
      await onMint({
        token_id: tokenId,
        name,
        capability: capabilitiesMap[specialization],
        hourly_rate_near: hourlyRateNear,
        rental_rate_per_sec: ratePerSecYocto,
        specialization,
        description,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="sega-card w-full max-w-lg p-6 relative border-2 border-black shadow-sega-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-steel hover:text-white p-1 border-2 border-black bg-ground shadow-sega-sm transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-6 h-6 text-segaYellow" />
          <h2 className="font-pixel text-3xl font-bold text-iceWhite tracking-wider uppercase">
            MINT AUTONOMOUS AGENT NFT
          </h2>
        </div>

        <p className="text-xs text-steel font-mono mb-4">
          Binds a dynamic NEP-171 NFT to an exclusive NEAR Protocol sub-account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              TOKEN IDENTIFIER (ID)
            </label>
            <input
              type="text"
              required
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
            />
          </div>

          {/* Bound Sub-account derivation preview */}
          <div className="bg-ground border-2 border-black p-2.5 flex items-center justify-between text-xs shadow-sega-sm">
            <span className="text-steel flex items-center gap-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5 text-segaYellow" />
              BOUND SUB-ACCOUNT:
            </span>
            <span className="text-segaYellow font-bold">{derivedSubaccount}</span>
          </div>

          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              AGENT DESIGNATION (NAME)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
            />
          </div>

          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              SPECIALIZATION & WORKLOAD MATRIX
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value as any)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm cursor-pointer"
            >
              <option value="DEFI_YIELD">DEFI_YIELD (Flash Arbitrage & Pool Rebalance)</option>
              <option value="SECURITY_SENTINEL">SECURITY_SENTINEL (Invariant & Re-entrancy Guardian)</option>
              <option value="ORACLE_ATTESTATION">ORACLE_ATTESTATION (ZK Price Feed Validator)</option>
              <option value="ARBITRAGE_ENGINE">ARBITRAGE_ENGINE (Autonomous AMM Execution)</option>
            </select>
          </div>

          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              RENTAL LEASE RATE (NEAR / HOUR)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              value={hourlyRateNear}
              onChange={(e) => setHourlyRateNear(parseFloat(e.target.value) || 0.1)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
            />
          </div>

          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              AGENT DESCRIPTION / TELEMETRY SPEC
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm text-[11px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="sega-btn sega-btn-dark py-2.5 text-base"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="sega-btn sega-btn-primary py-2.5 text-base flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>MINTING ON NEAR...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-segaYellow" />
                  MINT AGENT (0.05 N)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
