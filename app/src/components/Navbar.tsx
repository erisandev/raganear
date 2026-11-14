import React from "react";
import {
  Cpu,
  Layers,
  Send,
  PlusSquare,
  ShieldCheck,
  FileCode,
  UserCheck,
  Terminal,
  Compass,
} from "lucide-react";
import { NEAR_CONFIG } from "@/lib/near";

export type NavTab =
  | "MARKETPLACE"
  | "FLEET"
  | "DISPATCH"
  | "MINT_STUDIO"
  | "AUDITOR"
  | "AGENT_DOCS";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentAccount: string;
  onChangeAccount: (account: string) => void;
  ownedCount: number;
  rentedCount: number;
  onGoToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentAccount,
  onChangeAccount,
  ownedCount,
  rentedCount,
  onGoToLanding,
}) => {
  const navTabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number | string; badgeAmber?: boolean }[] = [
    {
      id: "MARKETPLACE",
      label: "MARKETPLACE",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "FLEET",
      label: "MY FLEET",
      icon: <Cpu className="w-3.5 h-3.5" />,
      badge: ownedCount > 0 ? `${ownedCount} OWNED` : undefined,
      badgeAmber: false,
    },
    {
      id: "DISPATCH",
      label: "DISPATCH",
      icon: <Send className="w-3.5 h-3.5" />,
      badge: rentedCount > 0 ? `${rentedCount} LEASED` : undefined,
      badgeAmber: true,
    },
    {
      id: "MINT_STUDIO",
      label: "MINT STUDIO",
      icon: <PlusSquare className="w-3.5 h-3.5" />,
    },
    {
      id: "AUDITOR",
      label: "AUDITOR",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: "AGENT_DOCS",
      label: "AGENT DOCS",
      icon: <FileCode className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="border-b-2 border-plateBorder bg-plate sticky top-0 z-40 w-full shadow-sega">
      {/* Top Protocol Status Bar */}
      <div className="border-b border-plateBorder/80 bg-ground/95 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-steel">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white font-semibold">
            <span className="w-2.5 h-2.5 bg-segaBlue border border-black inline-block" />
            <span className="font-pixel text-base text-segaYellow tracking-wider">SEGA ARCADE CORE: NEAR TESTNET</span>
          </div>
          <span className="text-plateBorder">|</span>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-segaBlue" />
            <span className="text-steelDark">ROOT CONTRACT:</span>
            <span className="text-iceWhite font-mono font-semibold">{NEAR_CONFIG.contractId}</span>
          </div>
          <span className="text-plateBorder hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-steel">
            <Compass className="w-3 h-3 text-steel" />
            <span>NEP-171 + NEP-178 TRANSFER FREEZE</span>
          </div>
        </div>

        {/* Identity Role Switcher */}
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-segaYellow" />
          <span className="text-[10px] text-steel uppercase font-bold hidden sm:inline">
            PLAYER IDENT:
          </span>
          <select
            value={currentAccount}
            onChange={(e) => onChangeAccount(e.target.value)}
            className="bg-ground border-2 border-black text-iceWhite text-[11px] font-mono px-2 py-0.5 focus:outline-none focus:border-segaBlue cursor-pointer shadow-sega-sm transition-all"
          >
            <option value="raga-renter-mw94dqty.testnet">
              raga-renter-mw94dqty.testnet (Tenant / Active Renter)
            </option>
            <option value="raga-operator-mw94dqty.testnet">
              raga-operator-mw94dqty.testnet (Worker Operator Daemon)
            </option>
            <option value="raga-protocol-mw93m309.testnet">
              raga-protocol-mw93m309.testnet (Foundry Owner & Vault)
            </option>
            <option value="judge.testnet">judge.testnet (NEAR AI Hackathon Judge)</option>
          </select>
        </div>
      </div>

      {/* Main Foundry Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between">
        {/* Brand & Sega Arcade Lockup */}
        <div className="py-2.5 flex items-center justify-between sm:justify-start gap-3 pr-6 border-b md:border-b-0 border-plateBorder/60">
          <button
            type="button"
            onClick={onGoToLanding}
            className="flex items-center gap-3 text-left group select-none focus:outline-none"
            title="Return to RAGA Landing & Brainstorming Page"
          >
            <div className="w-10 h-10 bg-segaBlue border-2 border-black flex items-center justify-center font-pixel font-bold text-segaYellow text-2xl shadow-sega-sm relative group-hover:scale-105 transition-transform">
              <span>R</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-segaYellow border border-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-3xl font-black text-iceWhite tracking-widest group-hover:text-segaYellow transition-colors">
                  RAGA
                </span>
                <span className="text-xs font-pixel bg-segaYellow text-black border border-black px-1.5 py-0.2 font-bold uppercase tracking-wider shadow-sega-sm">
                  ARCADE 16-BIT
                </span>
                {onGoToLanding && (
                  <span className="text-[10px] font-mono text-segaYellow bg-ground border border-segaYellow/60 px-1.5 py-0.5 group-hover:bg-segaYellow group-hover:text-black transition-colors hidden sm:inline font-bold">
                    ← LANDING &amp; SPECS
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-steel tracking-tight leading-none uppercase mt-0.5">
                TOKEN-BOUND MACHINE CARTRIDGE PROTOCOL // NEAR TESTNET
              </p>
            </div>
          </button>
        </div>

        {/* 6 Tabs */}
        <nav className="flex items-center overflow-x-auto no-scrollbar py-1 md:py-0 gap-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-segaYellow text-segaYellow bg-plateHover shadow-sega-sm"
                    : "border-transparent text-steel hover:text-iceWhite hover:bg-plateHover"
                }`}
              >
                <span className={isActive ? "text-segaYellow" : "text-steel"}>{tab.icon}</span>
                <span className="font-pixel text-base">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 border border-black ${
                      tab.badgeAmber
                        ? "bg-segaYellow text-black font-extrabold shadow-sega-sm"
                        : isActive
                        ? "bg-segaBlue text-white font-bold shadow-sega-sm"
                        : "bg-ground text-steel"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
