import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Terminal, Shield, Zap, ExternalLink } from "lucide-react";
import { DOCS } from "@/server/data/docs";

export const metadata = {
  title: "Documentation | RAGA Protocol Specifications",
  description:
    "Zero-dependency engineering documentation for RAGA NEP-171/NEP-178 Token-Bound AI Accounts on NEAR Protocol.",
};

export default function DocsIndexPage() {
  return (
    <div className="min-h-screen bg-ground text-iceWhite">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-plate/95 backdrop-blur-md border-b-2 border-plateBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-segaBlue border-2 border-black flex items-center justify-center font-pixel font-bold text-segaYellow text-xl shadow-sega-sm">
              <span>R</span>
            </div>
            <div>
              <span className="font-pixel text-xl font-black text-iceWhite tracking-widest leading-none">
                RAGA
              </span>
              <span className="ml-1.5 text-[9px] font-pixel bg-segaYellow text-black border border-black px-1 font-bold">
                DOCS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 font-mono text-xs font-bold uppercase">
            <Link
              href="/"
              className="text-steel hover:text-segaYellow transition-colors flex items-center gap-1"
            >
              <span>← HOME</span>
            </Link>
            <Link
              href="/docs"
              className="text-segaYellow border-b-2 border-segaYellow pb-0.5"
            >
              DOCS INDEX
            </Link>
            <Link
              href="/docs/implementation"
              className="text-steel hover:text-segaYellow transition-colors"
            >
              IMPLEMENTATION
            </Link>
            <Link
              href="/docs/integrations"
              className="text-steel hover:text-segaYellow transition-colors"
            >
              INTEGRATIONS
            </Link>
          </nav>

          {/* POJOK KANAN ATAS: LAUNCH APP */}
          <Link
            href="/app"
            className="sega-btn sega-btn-secondary px-3.5 py-1.5 text-black font-extrabold text-xs flex items-center gap-2 shadow-sega hover:scale-105 active:scale-95 transition-transform"
          >
            <Zap className="w-3.5 h-3.5 fill-black text-black" />
            <span className="font-pixel text-base tracking-wider">LAUNCH APP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b-2 border-plateBorder bg-ground py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-segaYellow font-mono text-xs uppercase font-bold tracking-widest">
            <BookOpen className="w-4 h-4 text-segaGreen" />
            <span>ZERO-COPY TECHNICAL DOCUMENTATION ENGINE</span>
          </div>
          <h1 className="font-pixel text-4xl sm:text-5xl lg:text-6xl text-iceWhite uppercase tracking-wide leading-none">
            THE ENGINEERING DOCUMENTS THAT SHIP WITH THE CODE.
          </h1>
          <p className="text-steel max-w-3xl text-sm sm:text-base leading-relaxed font-sans">
            These are the literal Markdown files located in <code className="text-segaYellow font-mono bg-plate px-1.5 py-0.5 border border-plateBorder">docs/</code> within the repository, rendered on-demand with a zero-dependency AST parser. They document the token-bound account invariant, the nanosecond time-locked rental state machine, the NEP-178 anti-theft transfer freeze, and verifiable on-chain proofs on NEAR Testnet.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-plate border border-plateBorder text-steel flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-segaGreen" />
              ROOT CONTRACT: <code className="text-iceWhite">raga-protocol-mw93m309.testnet</code>
            </span>
            <span className="px-2.5 py-1 bg-plate border border-plateBorder text-steel flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-segaYellow" />
              STANDARDS: NEP-171, NEP-177, NEP-178, NEP-181
            </span>
          </div>
        </div>
      </section>

      {/* Docs Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCS.map((doc, idx) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="sega-card p-6 flex flex-col justify-between group hover:border-segaYellow transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-segaYellow uppercase tracking-widest font-bold px-2 py-0.5 bg-ground border border-plateBorder">
                    {doc.eyebrow}
                  </span>
                  <span className="font-pixel text-xl text-steelDark">
                    0{idx + 1}
                  </span>
                </div>
                <h2 className="font-pixel text-2xl text-iceWhite uppercase tracking-wide group-hover:text-segaYellow transition-colors">
                  {doc.title}
                </h2>
                <p className="text-steel text-xs sm:text-sm font-sans leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-plateBorder/80 flex items-center justify-between text-xs font-mono">
                <span className="text-steelDark truncate max-w-[180px]">
                  {doc.file}
                </span>
                <span className="text-segaYellow font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  READ SPEC <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Reading Order Guide for Hackathon Judges */}
        <div className="sega-card p-8 border-2 border-segaBlue bg-plate/60 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-segaYellow uppercase tracking-widest font-bold block">
              DETERMINISTIC EVALUATION GUIDE
            </span>
            <h3 className="font-pixel text-3xl text-iceWhite uppercase">
              RECOMMENDED READING ORDER FOR JUDGES & AUDITORS
            </h3>
            <p className="text-steel text-sm leading-relaxed max-w-4xl">
              If evaluating RAGA under time constraints, start with the{" "}
              <strong className="text-iceWhite">Implementation Specification</strong> to verify how the smart contract serves as the sole keyholder for bound sub-accounts and how the NEP-178 transfer lock prevents mid-lease asset theft. Then inspect{" "}
              <strong className="text-iceWhite">Integrations</strong> to inspect verified on-chain transaction hashes on NEARBlocks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              href="/docs/implementation"
              className="p-4 bg-ground border-2 border-plateBorder hover:border-segaYellow transition-colors space-y-2 block"
            >
              <div className="flex items-center gap-2 text-segaYellow font-pixel text-lg">
                <span>01. IMPLEMENTATION</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </div>
              <p className="text-xs font-mono text-steel">
                Zero private key invariant, time-lock state machine & transfer freeze.
              </p>
            </Link>

            <Link
              href="/docs/integrations"
              className="p-4 bg-ground border-2 border-plateBorder hover:border-segaYellow transition-colors space-y-2 block"
            >
              <div className="flex items-center gap-2 text-segaGreen font-pixel text-lg">
                <span>02. INTEGRATIONS</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </div>
              <p className="text-xs font-mono text-steel">
                NEARBlocks explorer links, live testnet transactions & daemon specs.
              </p>
            </Link>

            <Link
              href="/docs/deploy"
              className="p-4 bg-ground border-2 border-plateBorder hover:border-segaYellow transition-colors space-y-2 block"
            >
              <div className="flex items-center gap-2 text-segaBlue font-pixel text-lg">
                <span>03. RUNBOOK & DEPLOY</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </div>
              <p className="text-xs font-mono text-steel">
                Rust compile steps, Wasm optimization, and CLI audit routines.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-plateBorder bg-ground py-8 px-4 text-center font-mono text-xs text-steel">
        <p>
          RAGA PROTOCOL // NEP-171 TOKEN-BOUND SMART ACCOUNTS ON NEAR // 0-RADIUS SEGA ARCADE DESIGN SYSTEM
        </p>
      </footer>
    </div>
  );
}
