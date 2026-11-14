"use client";

import { useState } from "react";
import { AgentNFT } from "@/domain/models/agent.model";
import { TaskExecutionRecord } from "@/domain/models/task.model";
import {
  rentAgentOnChain,
  executeAsAgentOnChain,
  mintAgentOnChain,
  transferAgentOnChain,
  claimAgentRevenueOnChain,
} from "@/infrastructure/repositories/agent-tx.repo";
import { claimAllRevenueForOwner } from "@/application/services/revenue.service";

interface RentalActionsProps {
  currentAccount: string;
  agents: AgentNFT[];
  onNotify: (type: "SUCCESS" | "WARNING" | "INFO", message: string, txHash?: string) => void;
  onRefresh: () => Promise<void>;
  onAddTask: (task: TaskExecutionRecord) => void;
}

export function useRentalActions({ currentAccount, agents, onNotify, onRefresh, onAddTask }: RentalActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runTx = async (infoMsg: string, txFn: () => Promise<void>) => {
    onNotify("INFO", infoMsg);
    try {
      setIsSubmitting(true);
      await txFn();
      await onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const rentAgent = async (agent: AgentNFT, durationHours: number) => {
    await runTx(`Broadcasting rent_agent for ${agent.token_id}...`, async () => {
      try {
        const res = await rentAgentOnChain(agent.token_id, durationHours, agent.hourly_rate_near, currentAccount);
        onAddTask({
          id: `rent-${Date.now()}`,
          token_id: agent.token_id,
          operator: currentAccount,
          target_account: agent.bound_subaccount,
          method_name: "rent_agent",
          proof_hash: `0x${res.txHash.slice(0, 16)}...`,
          reward_near: agent.hourly_rate_near * durationHours,
          timestamp: Date.now(),
          status: "CONFIRMED",
          tx_hash: res.txHash,
        });
        onNotify("SUCCESS", `RENTAL ACTIVATED: ${agent.token_id} leased for ${durationHours}h.`, res.txHash);
      } catch (err: any) {
        onNotify("WARNING", `Rental failed: ${err.message}`);
      }
    });
  };

  const executeAction = async (agent: AgentNFT, target: string, method: string, argsJson: string) => {
    await runTx(`Proxying call via ${agent.bound_subaccount}...`, async () => {
      try {
        const res = await executeAsAgentOnChain(agent.token_id, target, method, argsJson, currentAccount);
        onAddTask({
          id: `task-${Date.now()}`,
          token_id: agent.token_id,
          operator: currentAccount,
          target_account: target,
          method_name: method,
          proof_hash: res.proofHash,
          reward_near: 0.125,
          timestamp: Date.now(),
          status: "CONFIRMED",
          tx_hash: res.txHash,
        });
        onNotify("SUCCESS", `ACTION EXECUTED: ${agent.token_id} invoked ${method}().`, res.txHash);
      } catch (err: any) {
        onNotify("WARNING", `Execution failed: ${err.message}`);
      }
    });
  };

  const mintAgent = async (newAgent: any) => {
    await runTx(`Minting NEP-171 token for ${newAgent.name}...`, async () => {
      try {
        const res = await mintAgentOnChain(newAgent, currentAccount);
        onNotify("SUCCESS", `AGENT MINTED: Registered ${newAgent.token_id} on-chain.`, res.txHash);
      } catch (err: any) {
        onNotify("WARNING", `Minting failed: ${err.message}`);
      }
    });
  };

  const transferAgent = async (agent: AgentNFT, receiverId: string) => {
    await runTx(`Transferring token ${agent.token_id} to ${receiverId}...`, async () => {
      try {
        const res = await transferAgentOnChain(agent.token_id, receiverId, currentAccount);
        onNotify("SUCCESS", `TRANSFER CONFIRMED: ${agent.token_id} sent to ${receiverId}.`, res.txHash);
      } catch (err: any) {
        onNotify("WARNING", `TRANSFER REJECTED: ${err.message}`);
      }
    });
  };

  const claimSingle = async (agent: AgentNFT) => {
    await runTx(`Claiming accumulated yield for ${agent.token_id}...`, async () => {
      try {
        const res = await claimAgentRevenueOnChain(agent.token_id, currentAccount);
        onNotify("SUCCESS", `REVENUE CLAIMED for ${agent.token_id}.`, res.txHash);
      } catch (err: any) {
        onNotify("WARNING", `Claim failed: ${err.message}`);
      }
    });
  };

  const claimAll = async () => {
    await runTx("Processing batch revenue withdrawal...", async () => {
      try {
        const res = await claimAllRevenueForOwner(agents, currentAccount);
        onNotify("SUCCESS", `BATCH CLAIM: Claimed ${res.totalClaimedNear.toFixed(4)} NEAR.`, res.lastTxHash);
      } catch (err: any) {
        onNotify("WARNING", `Batch claim error: ${err.message}`);
      }
    });
  };

  return { isSubmitting, rentAgent, executeAction, mintAgent, transferAgent, claimSingle, claimAll };
}
