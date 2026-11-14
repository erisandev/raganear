"use client";

import React, { useState, useCallback } from "react";
import { AgentNFT, NEAR_CONFIG, TaskExecutionRecord } from "@/lib/near";
import { useAgents } from "@/application/hooks/useAgents";
import { useRentalActions } from "@/application/hooks/useRentalActions";
import { Navbar, NavTab } from "@/components/Navbar";
import { MarketplaceView } from "@/components/views/MarketplaceView";
import { FleetVaultView } from "@/components/views/FleetVaultView";
import { DispatchView } from "@/components/views/DispatchView";
import { MintStudioView } from "@/components/views/MintStudioView";
import { AuditorView } from "@/components/views/AuditorView";
import { AgentDocsView } from "@/components/views/AgentDocsView";
import { RentModal } from "@/components/RentModal";
import { ExecuteActionModal } from "@/components/ExecuteActionModal";
import { MintAgentModal } from "@/components/MintAgentModal";
import { TransferModal } from "@/components/TransferModal";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";

export interface FoundryWorkspaceProps {
  initialTab?: NavTab;
  onGoToLanding?: () => void;
}

export const FoundryWorkspace: React.FC<FoundryWorkspaceProps> = ({
  initialTab = "MARKETPLACE",
  onGoToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);
  const [tasks, setTasks] = useState<TaskExecutionRecord[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string>("raga-renter-mw94dqty.testnet");

  // Modals state
  const [selectedAgent, setSelectedAgent] = useState<AgentNFT | null>(null);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Flash Notification Banner
  const [notification, setNotification] = useState<{
    type: "SUCCESS" | "WARNING" | "INFO";
    message: string;
    txHash?: string;
  } | null>(null);

  const showNotification = useCallback(
    (
      type: "SUCCESS" | "WARNING" | "INFO",
      message: string,
      txHash?: string
    ) => {
      setNotification({ type, message, txHash });
      setTimeout(() => setNotification(null), 10000);
    },
    []
  );

  const handleRpcError = useCallback(
    (msg: string) => {
      showNotification("WARNING", msg);
    },
    [showNotification]
  );

  // Domain & Infrastructure Hooks
  const { agents, isLoading, isRefreshing, refreshAgents, loadAgentsQuiet } =
    useAgents(handleRpcError);

  const {
    rentAgent,
    executeAction,
    mintAgent,
    transferAgent,
    claimSingle,
    claimAll,
  } = useRentalActions({
    currentAccount,
    agents,
    onNotify: showNotification,
    onRefresh: loadAgentsQuiet,
    onAddTask: (record) => setTasks((prev) => [record, ...prev]),
  });

  const ownedCount = agents.filter((a) => a.owner_id === currentAccount).length;
  const rentedCount = agents.filter(
    (a) => a.effective_operator === currentAccount && a.is_rented
  ).length;

  const handleUpdateRate = (_agent: AgentNFT, newRate: number) => {
    showNotification(
      "INFO",
      `Note: Rental rates are set during mint or updated via contract call. Selected: ${newRate.toFixed(2)} NEAR/hr.`
    );
  };

  const openRentModal = (agent: AgentNFT) => {
    setSelectedAgent(agent);
    setIsRentModalOpen(true);
  };

  const openExecuteModal = (agent: AgentNFT) => {
    setSelectedAgent(agent);
    setIsExecuteModalOpen(true);
  };

  const openTransferModal = (agent: AgentNFT) => {
    setSelectedAgent(agent);
    setIsTransferModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ground sega-arcade-grid text-iceWhite flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentAccount={currentAccount}
        onChangeAccount={(acc) => {
          setCurrentAccount(acc);
          showNotification("INFO", `Switched operating identity to: ${acc}`);
        }}
        ownedCount={ownedCount}
        rentedCount={rentedCount}
        onGoToLanding={onGoToLanding}
      />

      {/* Sega Arcade On-Chain Sync Bar */}
      <div className="bg-plate border-b-2 border-plateBorder px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono shadow-sega-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-segaYellow border border-black inline-block" />
          <span className="font-pixel text-base text-segaYellow tracking-wider font-bold uppercase">
            FOUNDRY RUNTIME: 100% REAL NEAR TESTNET
          </span>
          <span className="text-plateBorder">|</span>
          <span className="text-steel">
            CONTRACT:{" "}
            <a
              href={`${NEAR_CONFIG.explorerUrl}/address/${NEAR_CONFIG.contractId}`}
              target="_blank"
              rel="noreferrer"
              className="text-segaYellow hover:underline inline-flex items-center gap-1 font-semibold"
            >
              {NEAR_CONFIG.contractId} <ExternalLink className="w-3 h-3 text-segaYellow" />
            </a>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-steel hidden sm:inline text-xs">
            FOUNDRY ASSETS:{" "}
            <strong className="font-pixel text-xl text-segaYellow tabular-nums">
              {agents.length}
            </strong>
          </span>
          <button
            onClick={refreshAgents}
            disabled={isRefreshing}
            className="sega-btn sega-btn-dark py-1 px-3 text-sm flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-segaYellow" : ""}`}
            />
            <span>{isRefreshing ? "SYNCING..." : "SYNC RPC"}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
          <div
            className={`p-3 text-xs font-mono flex items-center justify-between border-2 border-black shadow-sega ${
              notification.type === "SUCCESS"
                ? "bg-segaBlue text-white"
                : notification.type === "WARNING"
                ? "bg-segaYellow text-black font-extrabold"
                : "bg-plate text-iceWhite"
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {notification.type === "SUCCESS" && (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-segaYellow" />
              )}
              {notification.type === "WARNING" && (
                <AlertTriangle className="w-4 h-4 shrink-0 text-black" />
              )}
              {notification.type === "INFO" && (
                <Info className="w-4 h-4 shrink-0 text-segaYellow" />
              )}
              <span>{notification.message}</span>
              {notification.txHash && (
                <a
                  href={`${NEAR_CONFIG.explorerUrl}/txns/${notification.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-white inline-flex items-center gap-1 font-bold ml-1"
                >
                  VIEW ON NEARBLOCKS <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-[10px] uppercase font-bold px-2 py-0.5 border-2 border-black bg-ground text-white hover:bg-black transition-all shadow-sega-sm ml-2"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="sega-card p-12 text-center font-mono text-xs text-steel flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-segaYellow" />
            <p className="font-pixel text-2xl text-iceWhite font-bold uppercase tracking-wider">
              QUERYING LIVE ON-CHAIN STATE FROM NEAR TESTNET...
            </p>
            <p className="text-xs text-steel">NODE: {NEAR_CONFIG.nodeUrl}</p>
          </div>
        ) : (
          <>
            {activeTab === "MARKETPLACE" && (
              <MarketplaceView
                agents={agents}
                currentAccount={currentAccount}
                onOpenRentModal={openRentModal}
                onOpenExecuteModal={openExecuteModal}
                onOpenTransferModal={openTransferModal}
                onClaimRevenue={claimSingle}
                onGoToMint={() => setActiveTab("MINT_STUDIO")}
              />
            )}

            {activeTab === "FLEET" && (
              <FleetVaultView
                agents={agents}
                currentAccount={currentAccount}
                onClaimAll={claimAll}
                onClaimSingle={claimSingle}
                onOpenTransferModal={openTransferModal}
                onUpdateRate={handleUpdateRate}
                onGoToMint={() => setActiveTab("MINT_STUDIO")}
              />
            )}

            {activeTab === "DISPATCH" && (
              <DispatchView
                agents={agents}
                tasks={tasks}
                currentAccount={currentAccount}
                onExecuteWorkload={executeAction}
                onOpenExecuteModal={openExecuteModal}
              />
            )}

            {activeTab === "MINT_STUDIO" && (
              <MintStudioView
                currentAccount={currentAccount}
                onMintSuccess={mintAgent}
                onGoToMarketplace={() => setActiveTab("MARKETPLACE")}
              />
            )}

            {activeTab === "AUDITOR" && (
              <AuditorView agents={agents} currentAccount={currentAccount} />
            )}

            {activeTab === "AGENT_DOCS" && <AgentDocsView />}
          </>
        )}
      </main>

      {/* Modals */}
      <RentModal
        agent={selectedAgent}
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        onConfirmRent={rentAgent}
      />

      <ExecuteActionModal
        agent={selectedAgent}
        isOpen={isExecuteModalOpen}
        onClose={() => setIsExecuteModalOpen(false)}
        onExecute={executeAction}
      />

      <MintAgentModal
        isOpen={isMintModalOpen}
        contractId={NEAR_CONFIG.contractId}
        onClose={() => setIsMintModalOpen(false)}
        onMint={mintAgent}
      />

      <TransferModal
        agent={selectedAgent}
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onConfirmTransfer={transferAgent}
      />

      {/* Sega Arcade Cabinet Footer */}
      <footer className="border-t-2 border-plateBorder bg-plate py-6 text-xs font-mono text-steel mt-12 shadow-sega">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-segaBlue border-2 border-black text-segaYellow flex items-center justify-center font-pixel font-bold text-lg shadow-sega-sm">
              R
            </div>
            <div>
              <span className="font-pixel text-xl text-iceWhite font-bold">RAGA AI FOUNDRY</span>
              <span className="text-plateBorder mx-2">|</span>
              <span className="font-mono text-xs">
                100% REAL NEAR TESTNET: {NEAR_CONFIG.contractId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href={`${NEAR_CONFIG.explorerUrl}/address/${NEAR_CONFIG.contractId}`}
              target="_blank"
              rel="noreferrer"
              className="text-steel hover:text-segaYellow transition-colors flex items-center gap-1 font-semibold"
            >
              CONTRACT EXPLORER <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-plateBorder">|</span>
            <span className="text-steel">NEP-171 / NEP-178 ENGINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
