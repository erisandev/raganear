import React from "react";
import { THE_STACK } from "@/data/landing.data";

export const LandingStackSection: React.FC = () => {
  return (
    <section id="stack" className="py-20 px-4 sm:px-6 border-b-2 border-plateBorder bg-plate/40">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-segaBlue uppercase tracking-widest font-bold block">
            THE SYSTEM ARCHITECTURE
          </span>
          <h2 className="font-pixel text-4xl sm:text-5xl text-iceWhite uppercase leading-tight">
            THREE SERVICES, ONE HONEST LOOP.
          </h2>
          <p className="text-steel text-sm sm:text-base leading-relaxed font-sans">
            NEAR Protocol anchors sovereign sub-accounts, the NEP-171/178 Rust contract enforces ownership and transfer locks, and the TypeScript daemon drives off-chain telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THE_STACK.map((item) => (
            <div
              key={item.name}
              className="sega-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-segaYellow uppercase tracking-widest font-bold block">
                  {item.role}
                </span>
                <h3 className="font-pixel text-3xl text-iceWhite uppercase leading-snug">
                  {item.name}
                </h3>
                <p className="text-steel text-xs sm:text-sm font-sans leading-relaxed">
                  {item.body}
                </p>
              </div>

              <div className="pt-4 border-t border-plateBorder flex flex-wrap gap-1.5 font-mono text-[10px]">
                {item.facts.map((fact) => (
                  <span
                    key={fact}
                    className="px-2 py-0.5 bg-ground border border-plateBorder text-steel"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
