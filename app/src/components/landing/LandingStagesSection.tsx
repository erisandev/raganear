import React from "react";
import { FOUR_STAGES } from "@/data/landing.data";

export const LandingStagesSection: React.FC = () => {
  return (
    <section id="stages" className="py-20 px-4 sm:px-6 border-b-2 border-plateBorder bg-ground">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-segaYellow uppercase tracking-widest font-bold block">
            HOW IT WORKS // THE WORKFLOW ENGINE
          </span>
          <h2 className="font-pixel text-4xl sm:text-5xl text-iceWhite uppercase leading-tight">
            HOW IT WORKS: 4 STAGES OF AUTONOMOUS OPERATION.
          </h2>
          <p className="text-steel text-sm sm:text-base leading-relaxed font-sans">
            From cryptographic sub-account instantiation to nanosecond time-locked micro-leasing and automated yield settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_STAGES.map((stage) => (
            <div
              key={stage.number}
              className="sega-card p-6 flex flex-col justify-between space-y-4 hover:border-segaYellow transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-plateBorder pb-2">
                  <span className="font-pixel text-4xl text-segaYellow leading-none">
                    {stage.number}
                  </span>
                  <span className="font-mono text-[10px] text-steel uppercase tracking-widest font-bold">
                    {stage.name}
                  </span>
                </div>
                <h3 className="font-pixel text-2xl text-iceWhite uppercase leading-snug">
                  {stage.lead}
                </h3>
                <p className="text-steel text-xs sm:text-sm font-sans leading-relaxed">
                  {stage.body}
                </p>
              </div>

              <div className="pt-3 border-t border-plateBorder font-mono text-[11px] text-segaGreen font-bold truncate">
                ✓ {stage.proof}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
