"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AgentNFT } from "@/domain/models/agent.model";
import { fetchLiveAgentsFromRpc } from "@/infrastructure/repositories/agent-query.repo";

export function useAgents(onError?: (msg: string) => void) {
  const [agents, setAgents] = useState<AgentNFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const isFetchingRef = useRef(false);
  const hasLoadedOnceRef = useRef(false);

  const loadAgents = useCallback(async (quiet = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!quiet) setIsRefreshing(true);
    try {
      const liveTokens = await fetchLiveAgentsFromRpc();
      if (Array.isArray(liveTokens) && liveTokens.length > 0) {
        setAgents(liveTokens);
        hasLoadedOnceRef.current = true;
      }
      setError(null);
    } catch (err: any) {
      const msg = err?.message || "Failed to query NEAR Testnet RPC";
      console.warn("[useAgents] RPC fetch error:", msg);
      setError(msg);

      // Only alert user if we haven't loaded any data yet
      if (!hasLoadedOnceRef.current && onErrorRef.current) {
        onErrorRef.current(`Error connecting to NEAR Testnet RPC: ${msg}`);
      }
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAgents(false);

    // Poll every 30 seconds quietly in the background
    const interval = setInterval(() => {
      loadAgents(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadAgents]);

  return {
    agents,
    setAgents,
    isLoading,
    isRefreshing,
    error,
    refreshAgents: () => loadAgents(false),
    loadAgentsQuiet: () => loadAgents(true),
  };
}
