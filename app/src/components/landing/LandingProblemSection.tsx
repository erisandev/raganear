import React from "react";

export const LandingProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-20 px-4 sm:px-6 border-b-2 border-plateBorder bg-plate/50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="font-mono text-xs text-segaYellow uppercase tracking-widest font-bold block">
            THE PARADIGM SHIFT
          </span>
          <h2 className="font-pixel text-4xl sm:text-5xl text-iceWhite uppercase leading-tight">
            A JPEG IS A CLAIM OF VALUE, NOT PRODUCTIVE CAPITAL.
          </h2>
          <p className="text-steel text-sm sm:text-base leading-relaxed font-sans">
            For four years, the industry treated Non-Fungible Tokens as static image pointers hosted on IPFS. They generate zero autonomous cashflow, require manual execution, and carry catastrophic private-key theft vectors. RAGA transforms NFTs into productive, revenue-generating autonomous capital.
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="border-2 border-plateBorder bg-ground overflow-x-auto shadow-sega">
          <table className="w-full border-collapse font-mono text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-plateBorder bg-plate text-left font-pixel text-base sm:text-lg uppercase">
                <th className="p-4 text-steel">DIMENSION</th>
                <th className="p-4 text-alertCrimson">STATIC COLLECTIBLE NFT (ERC-721 / CW)</th>
                <th className="p-4 text-segaYellow">RAGA TOKEN-BOUND WORKER (NEP-171/178)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plateBorder/60">
              <tr className="hover:bg-plateHover transition-colors">
                <td className="p-4 text-iceWhite font-bold uppercase">Operational Utility</td>
                <td className="p-4 text-steel">Static image JSON URI; 0 native execution ability</td>
                <td className="p-4 text-segaGreen font-bold">
                  Dedicated NEAR sub-account (<code className="text-segaYellow">agent.raga.testnet</code>)
                </td>
              </tr>
              <tr className="hover:bg-plateHover transition-colors">
                <td className="p-4 text-iceWhite font-bold uppercase">Key Custody &amp; Risk</td>
                <td className="p-4 text-alertCrimson">Centralized bot holds private key; vulnerable to drain</td>
                <td className="p-4 text-segaGreen font-bold">Zero private keys; parent contract is sole protocol authority</td>
              </tr>
              <tr className="hover:bg-plateHover transition-colors">
                <td className="p-4 text-iceWhite font-bold uppercase">Leasing &amp; SLA</td>
                <td className="p-4 text-steel">Weak off-chain trust; owner can sell mid-lease</td>
                <td className="p-4 text-segaYellow font-bold">NEP-178 transfer lock; panic freeze protects renter SLA</td>
              </tr>
              <tr className="hover:bg-plateHover transition-colors">
                <td className="p-4 text-iceWhite font-bold uppercase">Yield Settlement</td>
                <td className="p-4 text-steel">Zero yield; manual transfers via Web2 rails</td>
                <td className="p-4 text-segaGreen font-bold">Streaming per-second yoctoNEAR vault accrued on-chain</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
