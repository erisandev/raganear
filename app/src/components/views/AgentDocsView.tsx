import React, { useState } from "react";
import { NEAR_CONFIG } from "@/lib/near";
import {
  Terminal,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Compass,
} from "lucide-react";

export const AgentDocsView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const evalRoutines = [
    {
      step: 1,
      title: "MINT TOKEN-BOUND AI WORKER",
      description:
        `Mints a new NEP-171 agent token and assigns deterministic parent authority over <token_id>.${NEAR_CONFIG.contractId}.`,
      command: `near call ${NEAR_CONFIG.contractId} mint_agent '{"token_id":"agent-sentinel-01","name":"Aegis Sentinel-V1","capability":"Autonomous Security & Invariant Guardian","rental_rate_per_sec":"277777777777777777777"}' --accountId ${NEAR_CONFIG.contractId} --amount 0.05 --gas 100000000000000`,
      expectedOutcome: `EVENT_JSON:{"standard":"raga","version":"1.0.0","event":"agent_registered","data":[{"token_id":"agent-sentinel-01","owner_id":"${NEAR_CONFIG.contractId}","bound_subaccount":"agent-sentinel-01.${NEAR_CONFIG.contractId}","rental_rate_per_sec":"277777777777777777777"}]}`,
    },
    {
      step: 2,
      title: "TIME-LOCKED AGENT RENTAL (DELEGATION)",
      description:
        "Leases the worker for 3600 seconds (1 hour). Attached deposit routes to revenue vault; effective operator transfers to renter.",
      command: `near call ${NEAR_CONFIG.contractId} rent_agent '{"token_id":"agent-oracle-03","duration_sec":3600}' --accountId raga-renter-mw94dqty.testnet --amount 0.85 --gas 100000000000000`,
      expectedOutcome: `EVENT_JSON:{"standard":"raga","version":"1.0.0","event":"agent_rented","data":[{"token_id":"agent-oracle-03","renter_id":"raga-renter-mw94dqty.testnet","duration_sec":3600,"expires_at":1794540202652447390,"fee_paid":"850000000000000000000000"}]}`,
    },
    {
      step: 3,
      title: "DELEGATED SUB-ACCOUNT EXECUTION (PROXY CALL)",
      description:
        "Renter commands the worker to execute a task on a target contract via the agent sub-account proxy.",
      command: `near call ${NEAR_CONFIG.contractId} execute_as_agent '{"token_id":"agent-oracle-03","target_account_id":"${NEAR_CONFIG.contractId}","method_name":"get_contract_owner","args":[],"deposit":"0","gas":"10000000000000"}' --accountId raga-renter-mw94dqty.testnet --gas 60000000000000`,
      expectedOutcome: `EVENT_JSON:{"standard":"raga","version":"1.0.0","event":"agent_executed_action","data":[{"token_id":"agent-oracle-03","operator":"raga-renter-mw94dqty.testnet","target_account_id":"${NEAR_CONFIG.contractId}","method_name":"get_contract_owner","deposit":"0","bound_subaccount":"agent-oracle-03.${NEAR_CONFIG.contractId}"}]}`,
    },
    {
      step: 4,
      title: "PROVE NEP-178 TRANSFER LOCK ENFORCEMENT (ATTACK TEST)",
      description:
        "Attempt an unauthorized transfer while the active rental lease is running. Proves the smart contract strictly rejects rugpull attempts.",
      command: `near call ${NEAR_CONFIG.contractId} nft_transfer '{"receiver_id":"raga-operator-mw94dqty.testnet","token_id":"agent-oracle-03"}' --accountId ${NEAR_CONFIG.contractId} --depositYocto 1 --gas 60000000000000`,
      expectedOutcome: `Smart contract panicked: Transfer forbidden: token agent-oracle-03 is locked under active rental to raga-renter-mw94dqty.testnet until timestamp 1794540202652447390 ns`,
      isRevertTest: true,
    },
    {
      step: 5,
      title: "CLAIM ACCUMULATED STREAMING REVENUE",
      description:
        "Owner withdraws earned lease yield directly to their NEAR balance upon or during the lease.",
      command: `near call ${NEAR_CONFIG.contractId} claim_agent_revenue '{"token_id":"agent-oracle-03"}' --accountId ${NEAR_CONFIG.contractId} --gas 60000000000000`,
      expectedOutcome: `EVENT_JSON:{"standard":"raga","version":"1.0.0","event":"agent_revenue_claimed","data":[{"token_id":"agent-oracle-03","recipient":"${NEAR_CONFIG.contractId}","amount":"499999999999999999996800"}]}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="sega-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-segaYellow" />
              <h2 className="font-pixel text-3xl font-bold tracking-wider text-iceWhite uppercase">
                AGENT SPECIFICATION & CLI EVALUATION SUITE
              </h2>
            </div>
            <p className="text-xs text-steel font-mono">
              Deterministic &ldquo;do X &mdash; see Y&rdquo; evaluation routines conforming to NEAR AI benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-pixel px-3 py-1 bg-segaBlue text-white border-2 border-black uppercase font-bold shadow-sega-sm">
              AI JUDGE TEST SUITE
            </span>
          </div>
        </div>
      </div>

      {/* Architecture Spec Summary */}
      <div className="sega-card p-6 space-y-4 font-mono text-xs">
        <h3 className="font-pixel text-2xl text-iceWhite uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-5 h-5 text-segaYellow" />
          SYSTEM SPECIFICATION SUMMARY
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="bg-ground border-2 border-black p-3 space-y-1 shadow-sega-sm">
            <span className="text-[10px] text-steelDark uppercase block font-bold">TOKEN STANDARD</span>
            <div className="text-iceWhite font-bold font-pixel text-lg">NEP-171 / 177 / 178</div>
            <p className="text-[10px] text-steel">
              Core non-fungible token with metadata and time-locked transfer locks.
            </p>
          </div>

          <div className="bg-ground border-2 border-black p-3 space-y-1 shadow-sega-sm">
            <span className="text-[10px] text-steelDark uppercase block font-bold">AUTHORITY SCHEME</span>
            <div className="text-segaYellow font-bold font-pixel text-lg">Token-Bound Sub-Account</div>
            <p className="text-[10px] text-steel">
              Child account derived as <code className="text-iceWhite">token_id.{NEAR_CONFIG.contractId}</code> with contract-only control.
            </p>
          </div>

          <div className="bg-ground border-2 border-black p-3 space-y-1 shadow-sega-sm">
            <span className="text-[10px] text-steelDark uppercase block font-bold">OFF-CHAIN VERIFICATION</span>
            <div className="text-segaBlue font-bold font-pixel text-lg">Worker Daemon Proofs</div>
            <p className="text-[10px] text-steel">
              SHA-256 cryptographic state proofs emitted to NEAR logs and feed.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Evaluation Routines */}
      <div className="space-y-4">
        <h3 className="font-pixel text-2xl text-iceWhite uppercase tracking-wider px-1">
          DETERMINISTIC EVALUATION ROUTINES (DO X &mdash; SEE Y)
        </h3>

        {evalRoutines.map((routine, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={routine.step}
              className="sega-card p-5 space-y-3 font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-plateBorder pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-segaBlue border-2 border-black text-segaYellow text-sm font-pixel font-bold flex items-center justify-center shadow-sega-sm">
                    {routine.step}
                  </span>
                  <h4 className="font-pixel text-xl text-iceWhite uppercase">
                    {routine.title}
                  </h4>
                </div>

                {routine.isRevertTest ? (
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-segaRed text-white border-2 border-black font-extrabold self-start sm:self-auto flex items-center gap-1 shadow-sega-sm">
                    <AlertTriangle className="w-3 h-3 text-segaYellow" />
                    EXPECTED REVERT TEST
                  </span>
                ) : (
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-segaGreen text-white border-2 border-black font-bold self-start sm:self-auto shadow-sega-sm">
                    EXPECTED SUCCESS
                  </span>
                )}
              </div>

              <p className="text-steel text-xs">{routine.description}</p>

              {/* Command Box */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-steel">
                  <span className="font-bold text-segaYellow">DO X (EXECUTE COMMAND):</span>
                  <button
                    onClick={() => copyToClipboard(routine.command, idx)}
                    className="sega-btn sega-btn-dark text-xs px-2.5 py-1 flex items-center gap-1"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="w-3 h-3 text-segaGreen" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{isCopied ? "COPIED" : "COPY COMMAND"}</span>
                  </button>
                </div>
                <div className="bg-ground border-2 border-black p-3 text-xs text-iceWhite overflow-x-auto leading-relaxed select-all shadow-sega-sm">
                  <code>{routine.command}</code>
                </div>
              </div>

              {/* Expected Output Box */}
              <div className="space-y-1 pt-1">
                <div className="text-xs text-steel uppercase font-bold">
                  SEE Y (DETERMINISTIC ON-CHAIN OUTCOME):
                </div>
                <div
                  className={`border-2 border-black p-2.5 text-xs overflow-x-auto leading-relaxed shadow-sega-sm ${
                    routine.isRevertTest
                      ? "bg-segaRed/15 text-segaRed font-bold"
                      : "bg-ground text-segaYellow font-mono"
                  }`}
                >
                  <code>{routine.expectedOutcome}</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct JSON-RPC Read Query via curl */}
      <div className="sega-card p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b-2 border-plateBorder pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-segaYellow" />
            <h3 className="font-pixel text-2xl text-iceWhite uppercase tracking-wider">
              MACHINE-READABLE JSON-RPC INSPECTION VIA CURL
            </h3>
          </div>
          <span className="text-[10px] text-black bg-segaYellow border border-black px-2 py-0.5 uppercase font-extrabold shadow-sega-sm">
            READ-ONLY RPC
          </span>
        </div>

        <p className="text-steel text-xs">
          Directly inspect active rental state or token bound metadata from any shell without NEAR wallet credentials:
        </p>

        <div className="bg-ground border-2 border-black p-3 text-xs text-iceWhite overflow-x-auto leading-relaxed select-all shadow-sega-sm">
          <code>{`curl -s https://rpc.testnet.near.org -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "query",
  "params": {
    "request_type": "call_function",
    "finality": "final",
    "account_id": "${NEAR_CONFIG.contractId}",
    "method_name": "get_agent",
    "args_base64": "eyJ0b2tlbl9pZCI6ICJhZ2VudC1zZW50aW5lbC0wMSJ9"
  }
}'`}</code>
        </div>
      </div>
    </div>
  );
};
