import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DOCS } from "@/server/data/docs-list";

export const LandingDocsGrid: React.FC = () => {
  return (
    <section id="docs" className="py-20 px-4 sm:px-6 border-b-2 border-plateBorder bg-plate/30">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs text-segaGreen uppercase tracking-widest font-bold block">
              ENGINEERING SPECIFICATIONS
            </span>
            <h2 className="font-pixel text-4xl sm:text-5xl text-iceWhite uppercase leading-tight">
              READ THE ACTUAL ENGINEERING.
            </h2>
            <p className="text-steel text-sm font-sans leading-relaxed">
              The documents below are the ones in the repository, rendered in the app via a zero-dependency AST Markdown engine.
            </p>
          </div>

          <Link
            href="/docs"
            className="text-segaYellow hover:underline font-mono text-xs uppercase font-bold flex items-center gap-1.5 shrink-0"
          >
            <span>ALL SPECIFICATIONS →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCS.slice(0, 3).map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="sega-card p-6 flex flex-col justify-between group hover:border-segaYellow transition-all"
            >
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-segaYellow uppercase tracking-widest font-bold px-2 py-0.5 bg-ground border border-plateBorder inline-block">
                  {doc.eyebrow}
                </span>
                <h3 className="font-pixel text-2xl text-iceWhite uppercase group-hover:text-segaYellow transition-colors">
                  {doc.title}
                </h3>
                <p className="text-steel text-xs font-sans leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-plateBorder text-segaYellow text-xs font-mono font-bold flex items-center gap-1">
                READ SPECIFICATION <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
