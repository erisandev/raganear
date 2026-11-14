import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, Play, Layers, ShieldAlert, BookOpen } from "lucide-react";
import { NEAR_CONFIG } from "@/lib/near";
import { PROOF } from "@/data/landing.data";

interface LandingHeaderProps {
  onLaunchApp: (targetTab?: any) => void;
  agentCount: number;
  onScrollToSection: (id: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLaunchApp,
  agentCount,
  onScrollToSection,
}) => {
  return (
    <header className="border-b-2 border-plateBorder bg-plate sticky top-0 z-50 w-full shadow-sega">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* POJOK KIRI: BRAND LOGO & NAME */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-segaBlue border-2 border-black flex items-center justify-center font-pixel font-bold text-segaYellow text-xl sm:text-2xl shadow-sega-sm relative">
            <span>R</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-segaYellow border border-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-xl sm:text-2xl font-black text-iceWhite tracking-widest leading-none">
                RAGA
              </span>
              <span className="text-[9px] sm:text-[10px] font-pixel bg-segaYellow text-black border border-black px-1 font-bold">
                ARCADE
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] font-mono text-steel uppercase leading-none mt-0.5">
              TOKEN-BOUND AI PROTOCOL
            </p>
          </div>
        </div>

        {/* MENU NAVBAR ATAS */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-mono font-bold uppercase overflow-x-auto no-scrollbar">
          <button
            onClick={() => onScrollToSection("problem")}
            className="px-2.5 sm:px-3 py-1.5 text-steel hover:text-segaYellow hover:bg-plateHover border border-transparent hover:border-plateBorder transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="font-pixel text-base sm:text-lg">THE PROBLEM</span>
          </button>

          <button
            onClick={() => onScrollToSection("stages")}
            className="px-2.5 sm:px-3 py-1.5 text-steel hover:text-segaYellow hover:bg-plateHover border border-transparent hover:border-plateBorder transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-segaYellow" />
            <span className="font-pixel text-base sm:text-lg">FOUR STAGES</span>
          </button>

          <button
            onClick={() => onScrollToSection("stack")}
            className="px-2.5 sm:px-3 py-1.5 text-steel hover:text-segaYellow hover:bg-plateHover border border-transparent hover:border-plateBorder transition-all hidden md:flex items-center gap-1.5 whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-segaBlue" />
            <span className="font-pixel text-base sm:text-lg">THE STACK</span>
          </button>

          <button
            onClick={() => onScrollToSection("honesty")}
            className="px-2.5 sm:px-3 py-1.5 text-steel hover:text-segaYellow hover:bg-plateHover border border-transparent hover:border-plateBorder transition-all hidden lg:flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-alertCrimson" />
            <span className="font-pixel text-base sm:text-lg">LIMITS</span>
          </button>

          <Link
            href="/docs"
            className="px-2.5 sm:px-3 py-1.5 text-steel hover:text-segaYellow hover:bg-plateHover border border-transparent hover:border-plateBorder transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-segaGreen" />
            <span className="font-pixel text-base sm:text-lg">DOCS</span>
          </Link>
        </nav>

        {/* POJOK KANAN ATAS: BUTTON LAUNCH APP */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onLaunchApp("MARKETPLACE")}
            className="sega-btn sega-btn-secondary px-3 sm:px-4 py-2 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sega hover:scale-105 active:scale-95 transition-transform"
            title="Launch RAGA Foundry Application"
          >
            <Zap className="w-4 h-4 fill-black text-black animate-pulse" />
            <span className="font-pixel text-base sm:text-lg tracking-wider">LAUNCH APP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Protocol Telemetry Strip */}
      <div className="border-t border-plateBorder/80 bg-ground/95 px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-steel">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-segaYellow border border-black inline-block animate-pulse" />
          <span className="font-pixel text-base text-segaYellow tracking-wider">
            NEAR PROTOCOL TESTNET // INDUSTRIAL COBALT BLUEPRINT
          </span>
          <span className="text-plateBorder hidden sm:inline">|</span>
          <span className="text-steel hidden md:inline">
            ROOT CONTRACT:{" "}
            <a
              href={`${NEAR_CONFIG.explorerUrl}/address/${PROOF.contractId}`}
              target="_blank"
              rel="noreferrer"
              className="text-segaYellow hover:underline font-mono font-semibold"
            >
              {PROOF.contractId}
            </a>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-steel text-[11px] font-mono">
            ACTIVE FOUNDRY UNITS:{" "}
            <strong className="text-segaYellow font-pixel text-base">{agentCount} RECORDED</strong>
          </span>
        </div>
      </div>
    </header>
  );
};
