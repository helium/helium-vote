"use client";

import { daysToSecs, getMinDurationFmt, onInstructions } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useAnchorProvider, useOwnedAmount } from "@helium/helium-react-hooks";
import { HNT_MINT, toBN, toNumber } from "@helium/spl-utils";
import {
  calcLockupMultiplier,
  useCreatePosition,
} from "@helium/voter-stake-registry-hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { FC, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LockTokensForm,
  LockTokensFormValues,
  LockupKind,
} from "./LockTokensForm";
import { StepIndicator } from "./StepIndicator";
import { SubDaoSelection } from "./SubDaoSelection";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";

export const CreatePositionModal: FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const provider = useAnchorProvider();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<LockTokensFormValues>();
  const [selectedSubDaoPk, setSelectedSubDaoPk] = useState<PublicKey>();
  const { publicKey: wallet } = useWallet();
  const {
    network,
    mint,
    subDaos,
    registrar,
    refetch: refetchState,
  } = useGovernance();
  const { amount: ownedAmount, decimals } = useOwnedAmount(wallet, mint);
  const { error: createPositionError, createPosition } = useCreatePosition();
  const steps = useMemo(() => (mint.equals(HNT_MINT) ? 3 : 2), [mint]);

  const maxLockupAmount =
    ownedAmount && decimals
      ? toNumber(new BN(ownedAmount.toString()), decimals)
      : 0;

  const selectedSubDao = useMemo(
    () =>
      selectedSubDaoPk &&
      subDaos?.find((subDao) => subDao.pubkey.equals(selectedSubDaoPk!))!,
    [selectedSubDaoPk, subDaos]
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

  const handleGoBack = () => {
    setStep(step - 1);
  };

  const handleOpenChange = () => {
    setIsSubmitting(false);
    setFormValues(undefined);
    setOpen(!open);
    setStep(1);
  };

  const handleSubmit = async (values: LockTokensFormValues) => {
    setFormValues(values);
    setStep(step + 1);
  };

  const handleLockTokens = async () => {
    try {
      const { amount, lockupPeriodInDays, lockupKind } = formValues!;
      setIsSubmitting(true);

      if (decimals) {
        const amountToLock = toBN(amount, decimals);
        await createPosition({
          amount: amountToLock,
          lockupPeriodsInDays: lockupPeriodInDays,
          lockupKind: lockupKind,
          mint,
          ...(subDaos && selectedSubDaoPk
            ? {
                subDao: subDaos.find((subDao) =>
                  subDao.pubkey.equals(selectedSubDaoPk!)
                )!,
              }
            : {}),
          onInstructions: onInstructions(provider),
        });

        toast.success("Position created successfully");
        setIsSubmitting(false);

        if (!createPositionError) {
          setOpen(false);
          refetchState();
        } else {
          toast(createPositionError.message);
        }
      }
    } catch (e) {
      setIsSubmitting(false);
      if (!(e instanceof WalletSignTransactionError) && e instanceof Error) {
        toast(e.message);
      }
    }
  };

  const verb =
    (step === 1 && "Create") ||
    (step > 2 && step === 2 && "Delegate") ||
    (step === steps && "Review");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-10 px-8 overflow-y-auto overflow-x-hidden max-md:min-w-full max-md:min-h-full max-h-screen">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <h3>{verb} Position</h3>
            <StepIndicator steps={steps} currentStep={step} />
          </div>
          <p className="text-sm">
            Boost your voting power by strategically locking your tokens for a
            specified period, opting for either a constant or decaying lockup
          </p>
        </div>

        {step === 1 && (
          <LockTokensForm
            initValues={formValues}
            submitText="Next"
            maxLockupAmount={maxLockupAmount}
            calcMultiplierFn={handleCalcLockupMultiplier}
            onCancel={() => setOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {steps > 2 && step === 2 && (
          <>
            <div className="flex flex-col gap-2">
              <SubDaoSelection
                selectedSubDaoPk={selectedSubDaoPk}
                onSelect={setSelectedSubDaoPk}
              />
              <div className="flex flex-col gap-4 p-4 text-sm bg-slate-600 rounded">
                <div>
                  <span className="font-medium">
                    By selecting a subnetwork, you indicate that:
                  </span>
                  <ul className="flex flex-col px-6 list-disc font-light">
                    <li>You believe in that subnetwork</li>
                    <li>
                      You wish to receive either MOBILE or IOT tokens as rewards
                      (which can be claimed on a daily basis)
                    </li>
                    <li>You help increase the DAO Utility Score</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium">
                    Remember the following before you delegate:
                  </span>
                  <ul className="flex flex-col px-6 list-disc font-light">
                    <li>
                      Delegated positions can only be un-delegated after
                      claiming all accrued rewards.
                    </li>
                    <li>
                      You cannot modify a delegated position; you must
                      undelegate (as well as relinquished all votes on it)
                      before conducting any of the following actions upon it:
                      decaying vs. pausing, extending, splitting, or merging
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                variant="secondary"
                className="flex-grow"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
              <Button
                className="flex-grow text-foreground gap-2"
                onClick={() => setStep(step + 1)}
              >
                Review
              </Button>
            </div>
          </>
        )}
        {step === steps && (
          <>
            <div className="flex flex-row gap-2 px-6 py-4 justiy-center items-center rounded-md bg-gradient-to-b from-background to-background/30">
              <div className="size-10 rounded-full relative mr-4 max-md:mr-1">
                <Image
                  alt={`${network} icon`}
                  src={`/images/${network}.svg`}
                  fill
                />
              </div>
              <div className="flex flex-col flex-1 text-xs">
                <div className="flex flex-row flex-wrap gap-1 font-light">
                  <span className="font-medium">
                    {formValues!.amount} {network.toUpperCase()}
                  </span>
                  <span className="text-foreground/80">for</span>
                  <span className="font-medium">
                    {getMinDurationFmt(
                      new BN(Date.now() / 1000),
                      new BN(
                        new Date().setDate(
                          new Date().getDate() + formValues!.lockupPeriodInDays
                        ) / 1000
                      )
                    )}
                  </span>
                  <span className="text-foreground/80">
                    {formValues!.lockupKind === LockupKind.cliff
                      ? "decaying starting today"
                      : "decaying delayed"}
                  </span>
                </div>
                {selectedSubDao && (
                  <div className="flex flex-row gap-1 font-normal items-center">
                    <span className="text-foreground/80">and delegated to</span>
                    <div className="size-6 rounded-full relative">
                      <Image
                        alt={selectedSubDao.dntMetadata.json?.name}
                        src={selectedSubDao.dntMetadata.json?.image}
                        fill
                      />
                    </div>
                    <span>{selectedSubDao.dntMetadata.symbol}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-grow justify-end">
              <div className="flex flex-row gap-2">
                <Button
                  variant="secondary"
                  className="flex-grow"
                  onClick={handleGoBack}
                  disabled={isSubmitting}
                >
                  Go Back
                </Button>
                <Button
                  className="flex-grow text-foreground gap-2"
                  onClick={handleLockTokens}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                  {isSubmitting ? "Creating Position..." : "Confirm"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
