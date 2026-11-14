"use client";

import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHeroProof } from "@/components/landing/LandingHeroProof";
import { LandingProblemSection } from "@/components/landing/LandingProblemSection";
import { LandingStagesSection } from "@/components/landing/LandingStagesSection";
import { LandingStackSection } from "@/components/landing/LandingStackSection";
import { LandingHonestySection } from "@/components/landing/LandingHonestySection";
import { LandingDocsGrid } from "@/components/landing/LandingDocsGrid";
import { LandingFooter } from "@/components/landing/LandingFooter";

interface LandingPageViewProps {
  onLaunchApp: (targetTab?: any) => void;
  agentCount?: number;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onLaunchApp,
  agentCount = 4,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-ground sega-arcade-grid text-iceWhite flex flex-col font-sans">
      <LandingHeader
        onLaunchApp={onLaunchApp}
        agentCount={agentCount}
        onScrollToSection={scrollToSection}
      />

      <LandingHeroProof
        onLaunchApp={onLaunchApp}
        onScrollToSection={scrollToSection}
      />

      <LandingProblemSection />

      <LandingStagesSection />

      <LandingStackSection />

      <LandingHonestySection />

      <LandingDocsGrid />

      <LandingFooter onLaunchApp={onLaunchApp} />
    </div>
  );
};
