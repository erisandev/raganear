import React, { useState } from "react";
import { AgentNFT, CapabilityCategory, yoctoToNear } from "@/lib/near";
import { AgentIdentityCard } from "@/components/AgentIdentityCard";
import {
  Search,
  Activity,
  Zap,
  Cpu,
  Clock,
  PlusSquare,
  SlidersHorizontal,
} from "lucide-react";

interface MarketplaceViewProps {
  agents: AgentNFT[];
  currentAccount: string;
  onOpenRentModal: (agent: AgentNFT) => void;
  onOpenExecuteModal: (agent: AgentNFT) => void;
  onOpenTransferModal: (agent: AgentNFT) => void;
  onClaimRevenue: (agent: AgentNFT) => void;
  onGoToMint: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  agents,
  currentAccount,
  onOpenRentModal,
  onOpenExecuteModal,
  onOpenTransferModal,
  onClaimRevenue,
  onGoToMint,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AVAILABLE" | "RENTED">("ALL");

  const categories: CapabilityCategory[] = [
    "ALL",
    "Oracle / Arbitrage",
    "Security Auditor",
    "Data Intelligence",
    "Smart Contract Ops",
  ];

  const filteredAgents = agents.filter((agent) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = agent.name.toLowerCase().includes(q);
      const matchId = agent.token_id.toLowerCase().includes(q);
      const matchSub = agent.bound_subaccount.toLowerCase().includes(q);
      const matchCap = agent.capability.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchSub && !matchCap) return false;
    }

    if (selectedCategory !== "ALL" && agent.category !== selectedCategory) {
      return false;
    }

    if (statusFilter === "AVAILABLE" && agent.is_rented) return false;
    if (statusFilter === "RENTED" && !agent.is_rented) return false;

    return true;
  });

  const totalLifetimeRevenue = agents.reduce(
    (acc, a) => acc + yoctoToNear(a.total_revenue_accumulated),
    0
  );
  const avgHourlyRate = (
    agents.reduce((acc, a) => acc + a.hourly_rate_near, 0) / (agents.length || 1)
  ).toFixed(2);
  const totalRented = agents.filter((a) => a.is_rented).length;

  return (
    <div className="space-y-6">
      {/* Hero Telemetry Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sega-card p-4">
        <div className="border-b md:border-b-0 md:border-r border-plateBorder/80 pb-3 md:pb-0 md:pr-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-steel mb-1">
            <Cpu className="w-3.5 h-3.5 text-segaBlue" />
            <span>FOUNDRY UNITS REGISTERED</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-5xl font-black text-iceWhite tabular-nums">
              {agents.length.toString().padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-steel font-bold">ACTIVE FLEET</span>
          </div>
        </div>

        <div className="border-b md:border-b-0 md:border-r border-plateBorder/80 pb-3 md:pb-0 md:pr-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-steel mb-1">
            <Clock className="w-3.5 h-3.5 text-segaYellow" />
            <span>TIME-LOCKED / LEASED</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-5xl font-black text-segaYellow tabular-nums">
              {totalRented.toString().padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-steel font-bold">LOCKED UNITS</span>
          </div>
        </div>

        <div className="border-b md:border-b-0 md:border-r border-plateBorder/80 pb-3 md:pb-0 md:pr-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-steel mb-1">
            <Activity className="w-3.5 h-3.5 text-segaBlue" />
            <span>AVERAGE LEASE RATE</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-5xl font-black text-iceWhite tabular-nums">
              {avgHourlyRate}
            </span>
            <span className="font-mono text-xs text-steel font-bold">NEAR / HR</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-steel mb-1">
            <Zap className="w-3.5 h-3.5 text-segaYellow" />
            <span>FOUNDRY SETTLED YIELD</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-5xl font-black text-segaYellow tabular-nums">
              {totalLifetimeRevenue.toFixed(1)}
            </span>
            <span className="font-mono text-xs text-steel font-bold">NEAR ON-CHAIN</span>
          </div>
        </div>
      </div>

      {/* Arcade Hardware Filter & Selector Bar */}
      <div className="sega-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-steel absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Agent ID, Machine Sub-Account, or Capability..."
              className="w-full bg-ground border-2 border-black pl-9 pr-4 py-2 text-xs font-mono text-iceWhite placeholder:text-steelDark focus:outline-none focus:border-segaBlue shadow-sega-sm transition-colors"
            />
          </div>

          {/* Status Hardware Toggle Switch */}
          <div className="flex items-center gap-1 border-2 border-black bg-ground p-1 shadow-sega-sm">
            <span className="text-[10px] font-mono text-steelDark px-2 uppercase font-extrabold">
              STATUS:
            </span>
            {(["ALL", "AVAILABLE", "RENTED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-mono uppercase transition-all ${
                  statusFilter === st
                    ? "bg-segaBlue text-white font-bold border border-black shadow-sega-sm"
                    : "text-steel hover:text-iceWhite hover:bg-plateHover"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Capability Hardware Selector Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-plateBorder/80">
          <span className="text-xs font-mono text-steel uppercase flex items-center gap-1.5 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-segaYellow" />
            CLASS:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-mono uppercase transition-all border-2 ${
                selectedCategory === cat
                  ? "bg-segaYellow text-black border-black font-extrabold shadow-sega-sm"
                  : "border-black bg-ground text-steel hover:text-iceWhite hover:border-segaBlue shadow-sega-sm"
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={onGoToMint}
            className="sega-btn sega-btn-primary ml-auto py-1 px-3 text-base flex items-center gap-1"
          >
            <PlusSquare className="w-4 h-4 text-segaYellow" />
            + MINT NEW AGENT
          </button>
        </div>
      </div>

      {/* Grid of 16-Bit AI Worker ROM Cartridges */}
      {filteredAgents.length === 0 ? (
        <div className="sega-card p-12 text-center font-mono text-xs text-steel">
          <p className="font-pixel text-2xl text-segaYellow font-bold mb-2">NO MATCHING FOUNDRY UNITS FOUND</p>
          <p>Adjust search query or capability filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => (
            <AgentIdentityCard
              key={agent.token_id}
              agent={agent}
              currentViewerAccount={currentAccount}
              onOpenRentModal={onOpenRentModal}
              onOpenExecuteModal={onOpenExecuteModal}
              onOpenTransferModal={onOpenTransferModal}
              onClaimRevenue={onClaimRevenue}
            />
          ))}
        </div>
      )}
    </div>
  );
};
