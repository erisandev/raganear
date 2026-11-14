import React from "react";
import { HONESTY_ITEMS } from "@/data/landing.data";

export const LandingHonestySection: React.FC = () => {
  return (
    <section id="honesty" className="py-20 px-4 sm:px-6 border-b-2 border-plateBorder bg-ground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
        <div className="space-y-4">
          <span className="font-mono text-xs text-alertCrimson uppercase tracking-widest font-bold block">
            DESIGN BOUNDARIES &amp; LIMITS
          </span>
          <h2 className="font-pixel text-4xl sm:text-5xl text-iceWhite uppercase leading-tight">
            THE LIMITS ARE PART OF THE DESIGN.
          </h2>
          <p className="text-steel text-sm sm:text-base leading-relaxed font-sans">
            A verifiable on-chain mechanism must be explicit about what it can and cannot do. Pretending that heavy neural networks run inside smart contracts would be dishonest; here is exactly where the boundary lies.
          </p>
        </div>

        <ul className="space-y-3">
          {HONESTY_ITEMS.map((item, idx) => (
            <li
              key={idx}
              className="p-4 bg-plate border-2 border-plateBorder flex items-start gap-3 text-xs sm:text-sm font-mono text-steel leading-relaxed"
            >
              <span className="text-alertCrimson font-bold text-base shrink-0 leading-none mt-0.5">
                ✕
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
