"use client";

import {
  daysToSecs,
  getFormattedStringFromDays,
  getMinDurationFmt,
  getTimeLeftFromNowFmt,
  secsToDays,
} from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import {
  PositionWithMeta,
  calcLockupMultiplier,
} from "@helium/voter-stake-registry-hooks";
import BN from "bn.js";
import { Loader2, X } from "lucide-react";
import React, { FC, useCallback, useState } from "react";
import { FaCircleArrowDown } from "react-icons/fa6";
import { LockTokensForm, LockTokensFormValues } from "../LockTokensForm";
import { PositionCard } from "../PositionCard";
import { StepIndicator } from "../StepIndicator";
import { Button } from "../ui/button";
import { ConfirmationItem } from "./ConfirmationItem";

export const SplitPositionPrompt: FC<{
  position: PositionWithMeta;
  maxActionableAmount: number;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (values: LockTokensFormValues) => Promise<void>;
}> = ({ position, maxActionableAmount, isSubmitting, onCancel, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState<LockTokensFormValues>();
  const { mint, network, registrar } = useGovernance();
  const unixNow = useSolanaUnixNow() || Date.now() / 1000;
  const { lockup, votingMint } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";
  const minLockupTimeInDays = Math.ceil(
    isConstant
      ? secsToDays(
          position.lockup.endTs.sub(position.lockup.startTs).toNumber() + 1
        )
      : secsToDays(position.lockup.endTs.sub(new BN(unixNow)).toNumber())
  );

  const handleCalcLockupMultiplier = useCallback(
    (lockupPeriodInDays: number) =>
      (registrar &&
        calcLockupMultiplier({
          lockupSecs: daysToSecs(lockupPeriodInDays),
          registrar,
          mint,
        })) ||
      0,
    [mint, registrar]
  );

  const handleFormSubmit = async (values: LockTokensFormValues) => {
    setFormValues(values);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (formValues) {
      await onConfirm(formValues);
    }
  };

  const upperNetwork = network.toUpperCase();
  return (
    <div className="flex flex-col h-full p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto md:justify-center">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col mb-4">
        <div className="flex flex-row justify-between items-center">
          <h5>Split Position</h5>
          <StepIndicator steps={2} currentStep={step} />
        </div>
        {step === 1 ? (
          <p className="text-base">
            Positions can be split into another position, useful for delegating
            (if you're on the Helium network) to different networks or setting
            varied lockup times
          </p>
        ) : (
          <p className="text-base">
            Please review the following information before confirming and
            remember that by doing so you'll have to pay a network fee in order
            to finalize your decision.
          </p>
        )}
      </div>
      {step === 1 && (
        <LockTokensForm
          initValues={formValues}
          mode="split"
          submitText="Next"
          maxLockupAmount={maxActionableAmount}
          minLockupTimeInDays={minLockupTimeInDays}
          maxLockupTimeInDays={secsToDays(
            votingMint.lockupSaturationSecs.toNumber()
          )}
          calcMultiplierFn={handleCalcLockupMultiplier}
          onCancel={onCancel}
          onSubmit={handleFormSubmit}
        />
      )}
      {step === 2 && formValues && (
        <>
          <div className="flex flex-col relative bg-gradient-to-b from-background to-background/30 rounded mb-4">
            <PositionCard
              position={position}
              compact={true}
              className="bg-transparent px-6 pt-4 pb-0"
            />
            <FaCircleArrowDown className="size-6 relative left-[calc(50%-0.75rem)]" />
            <div className="flex flex-row">
              <ConfirmationItem
                img={{
                  alt: `${network} icon`,
                  src: `/images/${network}.svg`,
                }}
                title="Position #1"
                description={`${
                  maxActionableAmount - formValues.amount
                } ${upperNetwork} for ${
                  isConstant
                    ? getMinDurationFmt(
                        position.lockup.startTs,
                        position.lockup.endTs
                      )
                    : getTimeLeftFromNowFmt(position.lockup.endTs)
                }`}
              />
              <ConfirmationItem
                img={{
                  alt: `${network} icon`,
                  src: `/images/${network}.svg`,
                }}
                title="Position #2"
                description={`${
                  formValues.amount
                } ${upperNetwork} for ${getFormattedStringFromDays(
                  formValues.lockupPeriodInDays
                )}`}
              />
            </div>
          </div>
          <div className="flex flex-col max-md:flex-grow justify-end gap-2">
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
                className="flex-1 text-foreground"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                {isSubmitting ? "Splitting Position..." : "Confirm"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              A network fee will be required
            </p>
          </div>
        </>
      )}
    </div>
  );
};
