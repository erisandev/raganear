import React, { useState } from "react";
import { AgentNFT, NEAR_CONFIG } from "@/lib/near";
import { AuditorBanner } from "@/components/auditor/AuditorBanner";
import { AuditorBindingProof } from "@/components/auditor/AuditorBindingProof";
import { AuditorTransferFreezeDiagram } from "@/components/auditor/AuditorTransferFreezeDiagram";
import { AuditorKeyComparisonTable } from "@/components/auditor/AuditorKeyComparisonTable";
import { AuditorBlueprintInspector } from "@/components/auditor/AuditorBlueprintInspector";

interface AuditorViewProps {
  agents: AgentNFT[];
  currentAccount: string;
}

export const AuditorView: React.FC<AuditorViewProps> = ({ agents }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string>(
    agents[0]?.token_id || "agent-sentinel-01"
  );
  const [customInputId, setCustomInputId] = useState<string>("");
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const inspectedAgent =
    agents.find((a) => a.token_id === (customInputId.trim() || selectedTokenId)) ||
    agents[0];

  const isLocked = inspectedAgent?.is_rented;
  const boundAccount = inspectedAgent
    ? `${inspectedAgent.token_id}.${NEAR_CONFIG.contractId}`
    : `unknown.${NEAR_CONFIG.contractId}`;

  const rawStatePayload = {
    token_id: inspectedAgent?.token_id,
    owner_id: inspectedAgent?.owner_id,
    bound_subaccount: boundAccount,
    active_rental: inspectedAgent?.is_rented
      ? {
          renter_id: inspectedAgent.effective_operator,
          expires_at_ns: inspectedAgent.rental_expires_at,
          expires_at_iso: inspectedAgent.rental_expires_at
            ? new Date(inspectedAgent.rental_expires_at / 1_000_000).toISOString()
            : null,
          rate_per_sec: inspectedAgent.rental_rate_per_sec,
          lock_state: "NEP178_TRANSFER_FREEZE_ACTIVE",
        }
      : null,
    invariants: {
      nep171_transfer_locked: isLocked,
      sole_authority_contract: NEAR_CONFIG.contractId,
      full_access_keys_count: 0,
      delegation_type: "SCOPED_CONTRACT_PROXY",
    },
    metadata: {
      title: inspectedAgent?.name,
      description: inspectedAgent?.description,
      capability: inspectedAgent?.capability,
      reputation: inspectedAgent?.reputation_score,
      total_accumulated_yocto: inspectedAgent?.total_revenue_accumulated,
      unclaimed_yocto: inspectedAgent?.unclaimed_revenue,
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawStatePayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      <AuditorBanner />

      {/* 2-Column Core Architecture Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuditorBindingProof boundAccount={boundAccount} />
        <AuditorTransferFreezeDiagram isLocked={isLocked} tokenId={inspectedAgent?.token_id} />
      </div>

      {/* Module 3: Key Sandboxing Comparison Table */}
      <AuditorKeyComparisonTable />

      {/* Module 4: Interactive Token Inspector */}
      <AuditorBlueprintInspector
        agents={agents}
        selectedTokenId={selectedTokenId}
        customInputId={customInputId}
        inspectedAgent={inspectedAgent}
        boundAccount={boundAccount}
        isLocked={isLocked}
        rawStatePayload={rawStatePayload}
        copiedJson={copiedJson}
        onSelectTokenId={(val) => {
          setSelectedTokenId(val);
          setCustomInputId("");
        }}
        onChangeCustomId={setCustomInputId}
        onCopyJson={handleCopyJson}
      />
    </div>
  );
};
