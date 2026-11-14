import React, { useState } from "react";
import { AgentNFT } from "@/lib/near";
import { ArrowRightLeft, Lock, ShieldAlert, X } from "lucide-react";

interface TransferModalProps {
  agent: AgentNFT | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmTransfer: (agent: AgentNFT, receiverId: string) => Promise<void> | void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  agent,
  isOpen,
  onClose,
  onConfirmTransfer,
}) => {
  const [receiverId, setReceiverId] = useState<string>("charlie.testnet");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !agent) return null;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Enforce NEP-178 Time-Locked Rental Constraint
    if (agent.is_rented) {
      setError(
        `TRANSFER REJECTED: Agent is currently time-locked under an active rental to ${agent.effective_operator}. Under NEP-178 protocol rules, tokens locked in rental cannot be transferred or burned until lease expiration.`
      );
      return;
    }

    if (!receiverId || receiverId === agent.owner_id) {
      setError("Receiver account must be distinct from current owner");
      return;
    }

    setLoading(true);
    try {
      await onConfirmTransfer(agent, receiverId);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="sega-card w-full max-w-lg p-6 relative border-2 border-black shadow-sega-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-steel hover:text-white p-1 border-2 border-black bg-ground shadow-sega-sm transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ArrowRightLeft className="w-6 h-6 text-segaYellow" />
          <h2 className="font-pixel text-3xl font-bold text-iceWhite tracking-wider uppercase">
            TRANSFER NEP-171 MACHINE OWNERSHIP
          </h2>
        </div>

        <p className="text-xs text-steel font-mono mb-4">
          Transferring Token ID: <span className="text-segaYellow font-semibold">{agent.token_id}</span>
        </p>

        {/* Bound Sub-account Notice */}
        <div className="bg-ground border-2 border-black p-3 text-xs font-mono mb-4 shadow-sega-sm">
          <div className="text-[10px] text-steelDark uppercase mb-1 font-bold">
            SUB-ACCOUNT AUTHORITY
          </div>
          <div className="text-segaYellow font-bold">
            {agent.bound_subaccount}
          </div>
          <div className="text-[10px] text-steel mt-1">
            * The sub-account controller authority transfers to the new owner upon transaction settlement.
          </div>
        </div>

        {/* Rental lock warning if rented */}
        {agent.is_rented && (
          <div className="border-2 border-segaYellow bg-segaYellow/15 p-3 text-xs font-mono text-white mb-4 flex gap-2 shadow-sega-sm">
            <Lock className="w-5 h-5 shrink-0 text-segaYellow mt-0.5" />
            <div>
              <strong className="block font-bold text-segaYellow">TRANSACTION TIME-LOCKED</strong>
              This worker is actively leased until timestamp expiration. Neither the owner nor renter can transfer this token.
            </div>
          </div>
        )}

        {error && (
          <div className="border-2 border-segaRed bg-segaRed/15 p-3 text-xs font-mono text-white mb-4 flex gap-2 shadow-sega-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-segaRed mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
              RECIPIENT NEAR ACCOUNT ID
            </label>
            <input
              type="text"
              required
              disabled={agent.is_rented}
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="recipient.testnet"
              className="w-full bg-ground border-2 border-black p-2 text-iceWhite font-mono focus:outline-none focus:border-segaBlue disabled:opacity-50 shadow-sega-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="sega-btn sega-btn-dark py-2.5 text-base"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={agent.is_rented || loading}
              className={`sega-btn py-2.5 text-base flex items-center justify-center gap-1.5 ${
                agent.is_rented
                  ? "bg-ground border-2 border-plateBorder text-steelDark cursor-not-allowed opacity-50"
                  : "sega-btn-primary"
              }`}
            >
              {loading ? "TRANSFERRING..." : "CONFIRM TRANSFER (1 YOCTO)"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
