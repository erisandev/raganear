import React from "react";
import Link from "next/link";
import {
  Zap,
  Cpu,
  ExternalLink,
  Lock,
  Coins,
  CheckCircle2,
  BookOpen,
  Play,
  Network,
} from "lucide-react";
import { NEAR_CONFIG } from "@/lib/near";
import { PROOF } from "@/data/landing.data";

interface LandingHeroProofProps {
  onLaunchApp: (targetTab?: any) => void;
  onScrollToSection: (id: string) => void;
}

export const LandingHeroProof: React.FC<LandingHeroProofProps> = ({
  onLaunchApp,
  onScrollToSection,
}) => {
  return (
    <section className="relative border-b-2 border-plateBorder bg-gradient-to-b from-ground via-plate/40 to-ground pt-14 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Tagline */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="sega-badge bg-segaBlue text-white text-xs px-2.5 py-0.5 font-bold uppercase">
            NEAR HACKATHON // TRACK: NFTS THAT DO SOMETHING
          </span>
          <span className="sega-badge bg-segaYellow text-black text-xs px-2.5 py-0.5 font-bold uppercase">
            NEP-171 + NEP-178 TRANSFER FREEZE
          </span>
          <span className="sega-badge bg-plate border-plateBorder text-steel text-xs px-2.5 py-0.5">
            TOKEN-BOUND SUBACCOUNTS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Headline, Subhead, Badges & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="font-pixel text-4xl sm:text-6xl lg:text-7xl font-black text-iceWhite leading-[0.95] tracking-tight uppercase">
                AUTONOMOUS AI WORKERS AS{" "}
                <span className="text-segaYellow block mt-1">TOKEN-BOUND ACCOUNTS.</span>
              </h1>
              <p className="font-mono text-sm sm:text-base text-steel mt-5 leading-relaxed max-w-2xl">
                A static NFT is a picture. RAGA turns NFTs into productive, rentable smart accounts that execute real work, earn autonomous yield, and cannot be stolen while leased.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onLaunchApp("MARKETPLACE")}
                className="sega-btn sega-btn-secondary px-6 py-3 text-lg sm:text-xl font-black flex items-center gap-2 shadow-sega"
              >
                <Zap className="w-5 h-5 fill-black text-black" />
                <span>LAUNCH FLEET FOUNDRY →</span>
              </button>

              <button
                onClick={() => onScrollToSection("stages")}
                className="sega-btn sega-btn-dark px-5 py-3 text-base flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-segaYellow" />
                <span>HOW IT WORKS</span>
              </button>

              <Link
                href="/docs"
                className="sega-btn sega-btn-dark px-5 py-3 text-base flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-segaGreen" />
                <span>READ TECHNICAL DOCS</span>
              </Link>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="px-2.5 py-1 bg-plate border border-plateBorder text-[11px] font-mono text-segaGreen flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> NEP-171 STANDBY
              </span>
              <span className="px-2.5 py-1 bg-plate border border-plateBorder text-[11px] font-mono text-segaYellow flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5" /> NEP-178 TRANSFER-LOCK
              </span>
              <span className="px-2.5 py-1 bg-plate border border-plateBorder text-[11px] font-mono text-segaBlue flex items-center gap-1.5 font-bold">
                <Network className="w-3.5 h-3.5" /> TOKEN-BOUND SUBACCOUNTS
              </span>
              <span className="px-2.5 py-1 bg-plate border border-plateBorder text-[11px] font-mono text-iceWhite flex items-center gap-1.5 font-bold">
                <Coins className="w-3.5 h-3.5 text-segaYellow" /> AUTOMATED YIELD
              </span>
            </div>
          </div>

          {/* Right Column: LIVE TESTNET PROOF CARD */}
          <div className="lg:col-span-5">
            <div className="sega-card p-6 border-2 border-segaYellow bg-plate space-y-5 shadow-sega-cabinet">
              {/* Proof Card Header */}
              <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-segaGreen border border-black inline-block animate-ping" />
                  <span className="font-mono text-xs uppercase tracking-widest text-steel font-bold">
                    RECORDED ON TESTNET
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-segaGreen text-white text-[10px] font-mono font-bold uppercase border border-black">
                  VERIFIED ON-CHAIN
                </span>
              </div>

              {/* Proof Telemetry List */}
              <dl className="space-y-3.5 font-mono text-xs">
                <div>
                  <dt className="text-steel text-[11px] uppercase tracking-wider">Root Protocol Contract</dt>
                  <dd className="mt-1 flex items-center justify-between bg-ground p-2 border border-plateBorder">
                    <span className="text-iceWhite font-bold truncate max-w-[240px]">{PROOF.contractId}</span>
                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/address/${PROOF.contractId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-segaYellow hover:underline ml-2 shrink-0 flex items-center gap-1"
                    >
                      EXPLORER <ExternalLink className="w-3 h-3" />
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-steel text-[11px] uppercase tracking-wider">Bound Sub-Account Derived</dt>
                  <dd className="mt-1 flex items-center justify-between bg-ground p-2 border border-plateBorder">
                    <span className="text-segaYellow font-bold truncate max-w-[240px]">{PROOF.subaccount}</span>
                    <span className="text-[10px] text-segaGreen font-bold px-1.5 py-0.5 bg-segaGreen/20 border border-segaGreen">
                      SOLE AUTHORITY
                    </span>
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-ground border border-plateBorder">
                    <span className="text-[10px] text-steel uppercase block">ON-CHAIN STATUS</span>
                    <span className="font-pixel text-xl text-segaYellow mt-0.5 block">4 LIVE AGENTS</span>
                    <span className="text-[9px] text-steelDark">NEP-181 ENUMERATED</span>
                  </div>
                  <div className="p-2.5 bg-ground border border-plateBorder">
                    <span className="text-[10px] text-steel uppercase block">TRANSFER FREEZE</span>
                    <span className="font-pixel text-xl text-segaGreen mt-0.5 block">ACTIVE LOCK</span>
                    <span className="text-[9px] text-steelDark">PANIC ON TRANSFER</span>
                  </div>
                </div>

                <div>
                  <dt className="text-steel text-[11px] uppercase tracking-wider">Deployment Verification</dt>
                  <dd className="mt-1 flex items-center justify-between bg-ground p-2 border border-plateBorder">
                    <span className="text-steelDark truncate max-w-[220px]">Tx: {PROOF.deployTx}</span>
                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/txns/${PROOF.deployTx}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-segaYellow hover:underline text-[11px] flex items-center gap-1"
                    >
                      VERIFY TX <ExternalLink className="w-3 h-3" />
                    </a>
                  </dd>
                </div>
              </dl>

              {/* Proof Card Action */}
              <button
                onClick={() => onLaunchApp("MARKETPLACE")}
                className="w-full sega-btn sega-btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4 text-segaYellow" />
                <span>INSPECT LIVE AGENT CARTRIDGES</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
