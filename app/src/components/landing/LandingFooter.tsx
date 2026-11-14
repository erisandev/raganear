import React from "react";
import Link from "next/link";
import { Zap, BookOpen } from "lucide-react";
import { NEAR_CONFIG } from "@/lib/near";
import { PROOF } from "@/data/landing.data";

interface LandingFooterProps {
  onLaunchApp: (targetTab?: any) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onLaunchApp }) => {
  return (
    <>
      {/* FINAL CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 bg-ground border-b-2 border-plateBorder">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-pixel text-4xl sm:text-5xl text-iceWhite uppercase leading-tight">
              LAUNCH YOUR FLEET OF AUTONOMOUS AI WORKERS.
            </h2>
            <p className="text-steel text-sm sm:text-base font-sans leading-relaxed">
              Mint real NEP-171 token-bound worker accounts, lease execution capacity on per-second micro-contracts, and inspect live on-chain state on NEAR Testnet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => onLaunchApp("MARKETPLACE")}
              className="sega-btn sega-btn-secondary px-8 py-3 text-lg font-black flex items-center gap-2 shadow-sega"
            >
              <Zap className="w-5 h-5 fill-black text-black" />
              <span>LAUNCH APP NOW →</span>
            </button>

            <Link
              href="/docs/implementation"
              className="sega-btn sega-btn-dark px-6 py-3 text-base flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-segaYellow" />
              <span>READ IMPLEMENTATION</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <footer className="py-10 px-4 sm:px-6 bg-plate text-steel font-mono text-xs border-t-2 border-plateBorder">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-2xl text-iceWhite">RAGA ARCADE</span>
            <span>|</span>
            <span>NEP-171 TOKEN-BOUND SMART ACCOUNTS ON NEAR</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/docs" className="hover:text-segaYellow transition-colors">
              DOCS
            </Link>
            <Link href="/docs/implementation" className="hover:text-segaYellow transition-colors">
              SPECIFICATION
            </Link>
            <Link href="/docs/integrations" className="hover:text-segaYellow transition-colors">
              TESTNET PROOFS
            </Link>
            <a
              href={`${NEAR_CONFIG.explorerUrl}/address/${PROOF.contractId}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-segaYellow transition-colors"
            >
              NEARBLOCKS
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};
