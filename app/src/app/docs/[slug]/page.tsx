import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, FileText, Zap } from "lucide-react";
import { MarkdownDocument } from "@/components/markdown/MarkdownDocument";
import { DOCS, findDoc, loadDoc } from "@/server/data/docs";

export const dynamic = "force-static";

export function generateStaticParams(): Array<{ slug: string }> {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = findDoc(params.slug);
  if (!entry) return { title: "Document Not Found | RAGA Docs" };
  return {
    title: `${entry.title} | RAGA Specifications`,
    description: entry.summary,
  };
}

export default function DocDetailPage({ params }: { params: { slug: string } }) {
  const entry = findDoc(params.slug);
  if (!entry) notFound();

  const doc = loadDoc(entry);
  const index = DOCS.findIndex((item) => item.slug === entry.slug);
  const previous = index > 0 ? DOCS[index - 1] : undefined;
  const next = index >= 0 && index < DOCS.length - 1 ? DOCS[index + 1] : undefined;

  return (
    <div className="min-h-screen bg-ground text-iceWhite">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-plate/95 backdrop-blur-md border-b-2 border-plateBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-segaBlue border-2 border-black flex items-center justify-center font-pixel font-bold text-segaYellow text-lg shadow-sega-sm">
                <span>R</span>
              </div>
              <span className="font-pixel text-xl font-black text-iceWhite tracking-widest hidden sm:inline">
                RAGA
              </span>
            </Link>

            <span className="text-steelDark font-mono text-xs hidden sm:inline">/</span>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <Link href="/docs" className="text-steel hover:text-segaYellow transition-colors">
                DOCS
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-steelDark" />
              <span className="text-segaYellow font-bold uppercase truncate max-w-[160px] sm:max-w-xs">
                {entry.slug}
              </span>
            </div>
          </div>

          {/* Quick Doc Switcher Dropdown / Links */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px]">
            {DOCS.map((d) => (
              <Link
                key={d.slug}
                href={`/docs/${d.slug}`}
                className={`px-2 py-1 uppercase transition-colors ${
                  d.slug === entry.slug
                    ? "bg-plate border border-segaYellow text-segaYellow font-bold"
                    : "text-steel hover:text-iceWhite"
                }`}
              >
                {d.slug}
              </Link>
            ))}
          </div>

          {/* POJOK KANAN ATAS: LAUNCH APP */}
          <Link
            href="/app"
            className="sega-btn sega-btn-secondary px-3 py-1.5 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sega hover:scale-105 active:scale-95 transition-transform shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-black text-black" />
            <span className="font-pixel text-base tracking-wider">LAUNCH APP</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main 2-Column Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10">
          {/* Left Column: Sticky Table of Contents (TOC) */}
          <aside className="lg:sticky lg:top-20 lg:self-start max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar space-y-6">
            <div className="p-4 bg-plate border-2 border-plateBorder space-y-4">
              <div>
                <span className="font-mono text-[10px] text-segaYellow uppercase tracking-widest font-bold block">
                  {entry.eyebrow}
                </span>
                <h3 className="font-pixel text-xl text-iceWhite uppercase mt-1 leading-snug">
                  {entry.title}
                </h3>
              </div>

              <div className="border-t border-plateBorder pt-3">
                <p className="font-mono text-[10px] text-steelDark uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-segaGreen" />
                  TABLE OF CONTENTS
                </p>
                <nav className="space-y-1 text-xs font-mono">
                  {doc.headings.length === 0 ? (
                    <span className="text-steelDark italic text-[11px]">No sub-headings</span>
                  ) : (
                    doc.headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block py-1 text-steel hover:text-segaYellow hover:border-l-2 hover:border-segaYellow transition-all leading-tight ${
                          heading.depth === 3
                            ? "pl-4 text-[11px] text-steel/80"
                            : "pl-2 border-l border-plateBorder text-xs font-semibold"
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))
                  )}
                </nav>
              </div>

              <div className="border-t border-plateBorder pt-3 flex flex-col gap-2 font-mono text-[11px]">
                <Link
                  href="/docs"
                  className="text-steel hover:text-segaYellow transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>ALL SPECIFICATIONS</span>
                </Link>
                <div className="flex items-center gap-1 text-steelDark">
                  <FileText className="w-3 h-3" />
                  <span className="truncate">{entry.file}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Rendered Markdown Content */}
          <article className="min-w-0 bg-plate/40 p-6 sm:p-10 border-2 border-plateBorder space-y-8">
            {/* Header info card */}
            <div className="pb-6 border-b-2 border-plateBorder space-y-2">
              <span className="font-mono text-xs text-segaYellow uppercase tracking-widest font-bold px-2 py-0.5 bg-ground border border-plateBorder inline-block">
                {entry.eyebrow}
              </span>
              <p className="text-steel text-xs sm:text-sm font-mono leading-relaxed mt-2">
                Source: <code className="text-iceWhite bg-ground px-1.5 py-0.5 border border-plateBorder">{entry.file}</code>
              </p>
            </div>

            {/* Markdown AST Document Body */}
            <MarkdownDocument blocks={doc.blocks} />

            {/* Bottom Pagination: Previous / Next Document Cards */}
            <nav className="mt-16 pt-8 border-t-2 border-plateBorder grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previous ? (
                <Link
                  href={`/docs/${previous.slug}`}
                  className="sega-card p-5 group hover:border-segaYellow transition-colors block text-left"
                >
                  <span className="font-mono text-[10px] text-steel uppercase tracking-widest block flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 text-segaYellow" /> PREVIOUS SPECIFICATION
                  </span>
                  <p className="font-pixel text-xl text-iceWhite uppercase group-hover:text-segaYellow transition-colors mt-1">
                    {previous.title}
                  </p>
                  <p className="text-steel text-xs font-mono line-clamp-1 mt-1">{previous.summary}</p>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/docs/${next.slug}`}
                  className="sega-card p-5 group hover:border-segaYellow transition-colors block sm:text-right"
                >
                  <span className="font-mono text-[10px] text-steel uppercase tracking-widest block flex items-center gap-1 sm:justify-end">
                    NEXT SPECIFICATION <ArrowRight className="w-3 h-3 text-segaYellow" />
                  </span>
                  <p className="font-pixel text-xl text-iceWhite uppercase group-hover:text-segaYellow transition-colors mt-1">
                    {next.title}
                  </p>
                  <p className="text-steel text-xs font-mono line-clamp-1 mt-1">{next.summary}</p>
                </Link>
              ) : null}
            </nav>
          </article>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-plateBorder bg-ground py-8 px-4 text-center font-mono text-xs text-steel">
        <p>
          RAGA PROTOCOL SPECIFICATIONS // NEAR TESTNET: <code className="text-segaYellow">raga-protocol-mw93m309.testnet</code>
        </p>
      </footer>
    </div>
  );
}
