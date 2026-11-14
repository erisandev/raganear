"use client";

import React, { useState, useCallback } from "react";
import { NavTab } from "@/components/Navbar";
import { LandingPageView } from "@/components/views/LandingPageView";
import { FoundryWorkspace } from "@/components/FoundryWorkspace";
import { useAgents } from "@/application/hooks/useAgents";

export default function RootPage() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<NavTab>("MARKETPLACE");
  const { agents } = useAgents();

  const handleLaunchApp = useCallback((targetTab?: NavTab) => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
    setViewMode("app");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  if (viewMode === "landing") {
    return (
      <LandingPageView
        onLaunchApp={handleLaunchApp}
        agentCount={agents.length || 4}
      />
    );
  }

  return (
    <FoundryWorkspace
      initialTab={activeTab}
      onGoToLanding={() => setViewMode("landing")}
    />
  );
}
