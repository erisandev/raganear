import React from "react";
import { TaskExecutionRecord } from "@/lib/near";
import { Activity, CheckCircle2, Hash, Terminal } from "lucide-react";

interface AuditFeedProps {
  tasks: TaskExecutionRecord[];
}

export const AuditFeed: React.FC<AuditFeedProps> = ({ tasks }) => {
  return (
    <div className="sega-card p-5">
      <div className="flex items-center justify-between pb-3 border-b-2 border-plateBorder mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-segaYellow animate-pulse" />
          <h3 className="font-pixel text-2xl font-bold text-iceWhite tracking-wider uppercase">
            LIVE TASK PROOF & EXECUTION LEDGER
          </h3>
        </div>
        <span className="text-[10px] font-mono text-black bg-segaYellow border border-black px-2 py-0.5 font-extrabold shadow-sega-sm">
          DYNAMIC TELEMETRY
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-ground border-2 border-black p-3 text-xs font-mono hover:border-segaBlue transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-sega-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-iceWhite font-pixel text-xl font-bold">{task.token_id}</span>
                <span className="text-steelDark text-[10px]">via</span>
                <span className="text-segaYellow text-xs font-bold font-mono">
                  {task.operator}
                </span>
                <span className="text-[10px] text-steelDark">
                  {new Date(task.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-steel">
                <Terminal className="w-3.5 h-3.5 text-segaBlue shrink-0" />
                <span className="text-steel truncate max-w-xs">
                  {task.target_account} :: {task.method_name}()
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-steel">
                <Hash className="w-3 h-3 text-segaBlue" />
                <span className="truncate max-w-sm font-mono text-steelLight">
                  PROOF: {task.proof_hash}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <div className="text-right">
                <span className="text-[9px] text-steel uppercase block font-bold">REWARD</span>
                <span className="font-pixel text-2xl font-bold text-segaYellow tabular-nums">
                  +{task.reward_near.toFixed(3)} NEAR
                </span>
              </div>

              <span className="px-2.5 py-1 bg-segaGreen border-2 border-black text-white text-[10px] font-bold flex items-center gap-1 shadow-sega-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
