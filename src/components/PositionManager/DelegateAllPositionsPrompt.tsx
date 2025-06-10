import { useGovernance } from "@/providers/GovernanceProvider";
import {
  PositionWithMeta,
  SubDaoWithMeta,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { Loader2, X } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { AutomationSettings } from "../AutomationSettings";
import { DataSplitBars } from "../DataSplitBars";
import { StepIndicator } from "../StepIndicator";
import { SubDaoSelection } from "../SubDaoSelection";
import { Button } from "../ui/button";
import { ConfirmationItem } from "./ConfirmationItem";
import { Skeleton } from "../ui/skeleton";

export const DelegateAllPositionsPrompt: FC<{
  positions: PositionWithMeta[];
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (subDao?: SubDaoWithMeta) => Promise<void>;
  automationEnabled: boolean;
  setAutomationEnabled: (automationEnabled: boolean) => void;
  subDao: SubDaoWithMeta | null;
  setSubDao: (subDao: SubDaoWithMeta | null) => void;
  solFees?: number;
  prepaidTxFees?: number;
  error?: string | null;
  loading?: boolean;
  insufficientBalance?: boolean;
}> = ({
  positions,
  isSubmitting,
  onCancel,
  onConfirm,
  automationEnabled,
  setAutomationEnabled,
  subDao,
  setSubDao,
  solFees = 0,
  prepaidTxFees = 0,
  error,
  loading,
  insufficientBalance,
}) => {
  const [step, setStep] = useState(1);
  const { subDaos, loading: loadingGov } = useGovernance();

  const hasSelectedSubDao = !!subDao?.pubkey;

  const handleSubmit = async () => {
    await onConfirm(subDao || undefined);
  };

  const handleSelectSubDao = useCallback(
    (pkey: PublicKey | undefined) => {
      if (!pkey) {
        setSubDao(null);
      } else {
        const found = subDaos?.find((sd) => sd.pubkey.equals(pkey)) || null;
        setSubDao(found);
      }
    },
    [setSubDao, subDaos]
  );

  if (loadingGov || !subDaos) {
    return (
      <div className="w-full flex flex-col h-full justify-center max-md:justify-normal p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto">
        <div className="flex flex-row justify-between items-center mb-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex flex-row max-md:flex-col gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 flex-1 rounded-md bg-background"
            />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-center max-md:justify-normal p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col justify-center items-stretch">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between items-center">
              <h3>
                {step === 1 ? "Delegate All Positions" : "Review Delegation"}
              </h3>
              <StepIndicator steps={2} currentStep={step} />
            </div>
            {step === 1 ? (
              <>
                <p className="text-base">
                  Delegate all your positions to a subnetwork. This will update
                  delegation for <b>{positions.length}</b> positions at once.
                </p>
                <p className="text-base">
                  Delegating your position to a subnetwork and voting regularly
                  earns you HNT rewards. Select the subnetwork you believe
                  offers the greatest potential for future revenue. This choice
                  does not affect your HNT rewards for this delegation.
                  Delegation percentages drive the amount of HNT emissions that
                  go towards each subnetwork&apos;s growth.
                </p>
              </>
            ) : (
              <p className="text-base">
                Please review the following information before confirming
              </p>
            )}
          </div>
          {step === 1 && (
            <>
              <DataSplitBars />
              <SubDaoSelection
                hideNoneOption
                onSelect={handleSelectSubDao}
                selectedSubDaoPk={subDao?.pubkey}
              />
              <AutomationSettings
                automationEnabled={automationEnabled}
                setAutomationEnabled={setAutomationEnabled}
                solFees={solFees}
                prepaidTxFees={prepaidTxFees}
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row justify-end items-center gap-2">
                  <Button
                    variant="default"
                    disabled={!hasSelectedSubDao}
                    className="flex-1 text-foreground"
                    onClick={() => setStep(step + 1)}
                  >
                    Review
                  </Button>
                </div>
                {error && (
                  <p className="text-xs text-red-500 text-center">{error}</p>
                )}
                {insufficientBalance && (
                  <p className="text-xs text-red-500 text-center">
                    Insufficient SOL for fees
                  </p>
                )}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex flex-row">
                <ConfirmationItem
                  className="rounded-md bg-gradient-to-b from-background to-background/30 flex-1"
                  img={{
                    alt: subDao?.dntMetadata?.json?.name,
                    src: subDao?.dntMetadata?.json?.image,
                  }}
                  title="Delegating all positions to..."
                  description={subDao?.dntMetadata?.symbol?.toUpperCase()}
                />
              </div>
              <div className="flex flex-col gap-2 w-full mt-4">
                <div className="flex flex-row justify-between items-center gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={isSubmitting}
                    onClick={() => setStep(step - 1)}
                  >
                    Go Back
                  </Button>
                  <Button
                    className="flex-1 text-foreground gap-2"
                    disabled={isSubmitting || insufficientBalance}
                    onClick={handleSubmit}
                  >
                    {isSubmitting || loading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : null}
                    {isSubmitting || loading
                      ? "Delegating..."
                      : `Confirm (${positions.length} positions)`}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  A network fee will be required
                </p>
                {error && (
                  <p className="text-xs text-red-500 text-center">{error}</p>
                )}
                {insufficientBalance && (
                  <p className="text-xs text-red-500 text-center">
                    Insufficient SOL for fees
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
