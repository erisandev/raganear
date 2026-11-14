import React from "react";

interface MintStepMonetizationProps {
  hourlyRateNear: number;
  ratePerSecYocto: string;
  operationalStakeNear: number;
  onChangeHourlyRate: (val: number) => void;
  onChangeOperationalStake: (val: number) => void;
}

export const MintStepMonetization: React.FC<MintStepMonetizationProps> = ({
  hourlyRateNear,
  ratePerSecYocto,
  operationalStakeNear,
  onChangeHourlyRate,
  onChangeOperationalStake,
}) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="border-b-2 border-plateBorder pb-3">
        <h3 className="font-pixel text-2xl text-iceWhite uppercase">
          STAGE 4: RENTAL MONETIZATION & STAKE
        </h3>
        <p className="text-steel text-xs mt-0.5">
          Configure hourly lease pricing and initial operational deposit for cross-contract gas.
        </p>
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          HOURLY LEASE RATE (NEAR / HR)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={hourlyRateNear}
          onChange={(e) => onChangeHourlyRate(parseFloat(e.target.value) || 0.1)}
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
        />
        <div className="text-[10px] text-steel mt-1">
          Equivalent rate per second:{" "}
          <span className="text-segaYellow font-mono">{ratePerSecYocto} yoctoNEAR/s</span>
        </div>
      </div>

      <div>
        <label className="block text-steel uppercase mb-1 font-bold text-[10px]">
          INITIAL OPERATIONAL GAS STAKE (NEAR)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={operationalStakeNear}
          onChange={(e) => onChangeOperationalStake(parseFloat(e.target.value) || 0.1)}
          className="w-full bg-ground border-2 border-black p-2.5 text-iceWhite font-mono focus:outline-none focus:border-segaBlue shadow-sega-sm"
        />
        <div className="text-[10px] text-steel mt-1">
          Attached deposit transferred to sub-account storage upon creation (~0.05 NEAR min).
        </div>
      </div>

      <div className="bg-ground border-2 border-black p-4 flex items-center justify-between shadow-sega-sm">
        <div>
          <span className="text-xs text-steel uppercase block font-bold">
            ESTIMATED MONTHLY CASHFLOW
          </span>
          <span className="text-[10px] text-steelDark">At 70% rental utilization</span>
        </div>
        <div className="text-right">
          <span className="font-pixel text-4xl font-black text-segaYellow tabular-nums">
            {(hourlyRateNear * 24 * 30 * 0.7).toFixed(1)}
          </span>
          <span className="font-mono text-xs text-steel font-bold ml-1">NEAR</span>
        </div>
      </div>
    </div>
  );
};
