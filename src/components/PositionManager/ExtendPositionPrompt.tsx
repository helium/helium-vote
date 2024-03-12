"use client";

import {
  PositionWithMeta,
  calcLockupMultiplier,
} from "@helium/voter-stake-registry-hooks";
import React, { FC, useCallback, useState } from "react";
import { LockTokensForm, LockTokensFormValues } from "../LockTokensForm";
import { StepIndicator } from "../StepIndicator";
import { useGovernance } from "@/providers/GovernanceProvider";
import {
  daysToSecs,
  getFormattedStringFromDays,
  secsToDays,
} from "@/lib/utils";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import BN from "bn.js";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { ConfirmationItem } from "./ConfirmationItem";

export const ExtendPositionPrompt: FC<{
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
  const { lockup, hasRewards, isDelegated, votingMint } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";
  const minLockupTimeInDays = Math.ceil(
    isConstant
      ? secsToDays(
          position.lockup.endTs.sub(position.lockup.startTs).toNumber()
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

  return (
    <div className="flex flex-col h-full p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto md:justify-center">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col w-full mb-4 gap-1">
        <div className="flex flex-row justify-between items-center">
          <h3>Extend Position</h3>
          <StepIndicator steps={2} currentStep={step} />
        </div>
        {step === 1 ? (
          <p className="text-base">
            Extending your position increases the unlocking time and provides a
            larger multiplier for voting power or delegation (given that
            you&apos;re on Helium)
          </p>
        ) : (
          <p className="text-base">
            Please review the following information before confirming
          </p>
        )}
      </div>
      {step === 1 && (
        <LockTokensForm
          initValues={formValues}
          mode="extend"
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
      {step === 2 && (
        <>
          <div className="flex flex-row max-md:flex-col relative mb-4">
            <ConfirmationItem
              img={{
                alt: `${network} icon`,
                src: `/images/${network}.svg`,
              }}
              title="Current Lockup Duration"
              description={`${getFormattedStringFromDays(
                minLockupTimeInDays
              )} at ${handleCalcLockupMultiplier(minLockupTimeInDays)}x`}
              className="rounded-l-md bg-gradient-to-t from-background to-background/30 max-md:rounded-bl-none max-md:rounded-t-md"
            />
            <FaCircleArrowRight className="absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6 text-foreground max-mb:transform max-md:rotate-90" />
            <ConfirmationItem
              img={{
                alt: `${network} icon`,
                src: `/images/${network}.svg`,
              }}
              title="New Lockup Duration"
              description={`${getFormattedStringFromDays(
                formValues!.lockupPeriodInDays
              )} at ${handleCalcLockupMultiplier(
                formValues!.lockupPeriodInDays
              )}x`}
              className="rounded-r-md bg-gradient-to-b from-background to-background/30 max-md:rounded-tr-none max-md:rounded-b-md"
            />
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
                className="flex-1 text-foreground gap-2"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                {isSubmitting ? "Extending Position..." : "Confirm"}
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
