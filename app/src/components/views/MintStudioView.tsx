import React, { useState } from "react";
import { NEAR_CONFIG, nearToYocto } from "@/lib/near";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { MintProgressTrack } from "@/components/mint-studio/MintProgressTrack";
import { MintSuccessCard } from "@/components/mint-studio/MintSuccessCard";
import { MintStepIdentity } from "@/components/mint-studio/MintStepIdentity";
import { MintStepSkills, SpecializationType } from "@/components/mint-studio/MintStepSkills";
import { MintStepSubaccount } from "@/components/mint-studio/MintStepSubaccount";
import { MintStepMonetization } from "@/components/mint-studio/MintStepMonetization";
import { MintCartridgePreview } from "@/components/mint-studio/MintCartridgePreview";

interface MintStudioViewProps {
  currentAccount: string;
  onMintSuccess: (newAgent: {
    token_id: string;
    name: string;
    capability: string;
    hourly_rate_near: number;
    rental_rate_per_sec: string;
    specialization: SpecializationType;
    description: string;
  }) => Promise<void> | void;
  onGoToMarketplace: () => void;
}

export const MintStudioView: React.FC<MintStudioViewProps> = ({
  currentAccount,
  onMintSuccess,
  onGoToMarketplace,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>("Vanguard Sentinel-X1");
  const [tokenId, setTokenId] = useState<string>(
    "agent-sentinel-" + Math.floor(100 + Math.random() * 900)
  );
  const [description, setDescription] = useState<string>(
    "Autonomous security sentinel monitoring cross-contract call patterns and checking invariant conditions on-chain."
  );

  const [specialization, setSpecialization] = useState<SpecializationType>("SECURITY_SENTINEL");
  const [capability, setCapability] = useState<string>(
    "Autonomous Invariant Guardian & Mempool Monitor"
  );

  const [hourlyRateNear, setHourlyRateNear] = useState<number>(1.25);
  const [operationalStakeNear, setOperationalStakeNear] = useState<number>(0.5);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mintCompleted, setMintCompleted] = useState<boolean>(false);

  // Derived sub-account
  const boundSubaccount = `${tokenId}.${NEAR_CONFIG.contractId}`;
  const ratePerSecYocto = nearToYocto(hourlyRateNear / 3600);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onMintSuccess({
        token_id: tokenId,
        name,
        capability,
        hourly_rate_near: hourlyRateNear,
        rental_rate_per_sec: ratePerSecYocto,
        specialization,
        description,
      });
      setMintCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Track */}
      <MintProgressTrack
        currentAccount={currentAccount}
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
      />

      {mintCompleted ? (
        /* Mint Completion Success View */
        <MintSuccessCard
          tokenId={tokenId}
          boundSubaccount={boundSubaccount}
          onGoToMarketplace={onGoToMarketplace}
          onMintAnother={() => {
            setMintCompleted(false);
            setCurrentStep(1);
            setTokenId("agent-worker-" + Math.floor(100 + Math.random() * 900));
          }}
        />
      ) : (
        /* 2-Column Wizard Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Step Form Content */}
          <div className="lg:col-span-7 sega-card p-6 space-y-5">
            {currentStep === 1 && (
              <MintStepIdentity
                name={name}
                tokenId={tokenId}
                description={description}
                onChangeName={setName}
                onChangeTokenId={setTokenId}
                onChangeDescription={setDescription}
              />
            )}

            {currentStep === 2 && (
              <MintStepSkills
                specialization={specialization}
                capability={capability}
                onChangeSpecialization={setSpecialization}
                onChangeCapability={setCapability}
              />
            )}

            {currentStep === 3 && (
              <MintStepSubaccount boundSubaccount={boundSubaccount} />
            )}

            {currentStep === 4 && (
              <MintStepMonetization
                hourlyRateNear={hourlyRateNear}
                ratePerSecYocto={ratePerSecYocto}
                operationalStakeNear={operationalStakeNear}
                onChangeHourlyRate={setHourlyRateNear}
                onChangeOperationalStake={setOperationalStakeNear}
              />
            )}

            {/* Wizard Navigation Controls */}
            <div className="pt-4 border-t-2 border-plateBorder flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="sega-btn sega-btn-dark py-2 px-4 text-base flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  PREVIOUS
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="sega-btn sega-btn-primary py-2 px-6 text-base flex items-center gap-1.5"
                >
                  CONTINUE
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="sega-btn sega-btn-yellow py-2 px-6 text-base flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>REGISTERING ON NEAR...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      DEPLOY & REGISTER AGENT
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: Live Cartridge Preview */}
          <MintCartridgePreview
            currentStep={currentStep}
            tokenId={tokenId}
            name={name}
            description={description}
            boundSubaccount={boundSubaccount}
            hourlyRateNear={hourlyRateNear}
            currentAccount={currentAccount}
          />
        </div>
      )}
    </div>
  );
};
