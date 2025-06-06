"use client";

import { daysToSecs, onInstructions } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import {
  useAnchorProvider,
  useMint,
  useOwnedAmount,
} from "@helium/helium-react-hooks";
import { HNT_MINT, toBN, toNumber } from "@helium/spl-utils";
import {
  PositionWithMeta,
  calcLockupMultiplier,
  useCreatePosition,
} from "@helium/voter-stake-registry-hooks";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useWallet } from "@/hooks/useWallet";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Loader2 } from "lucide-react";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import { PositionPreview } from "./PositionPreview";
import { MOBILE_SUB_DAO_KEY } from "@/lib/constants";
import { DataSplitBars } from "./DataSplitBars";
import { AutomationSettings } from "./AutomationSettings";

export const CreatePositionModal: FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const provider = useAnchorProvider();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<LockTokensFormValues>();
  const [selectedSubDaoPk, setSelectedSubDaoPk] = useState<PublicKey>();
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const { publicKey: wallet } = useWallet();
  const { mint, subDaos, registrar, refetch: refetchState } = useGovernance();
  const { amount: ownedAmount, decimals } = useOwnedAmount(wallet, mint);
  const { error: createPositionError, createPosition, rentFee, prepaidTxFees, insufficientBalance } = useCreatePosition({
    automationEnabled,
  });
  const steps = useMemo(() => (mint.equals(HNT_MINT) ? 3 : 2), [mint]);

  useEffect(() => {
    if (subDaos && !selectedSubDaoPk) {
      setSelectedSubDaoPk(
        subDaos.find((subDao) => subDao.pubkey.equals(MOBILE_SUB_DAO_KEY))
          ?.pubkey || undefined
      );
    }
  }, [subDaos, selectedSubDaoPk, setSelectedSubDaoPk]);

  const maxLockupAmount =
    ownedAmount && decimals
      ? toNumber(new BN(ownedAmount.toString()), decimals)
      : 0;

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
  const { info: mintAcc } = useMint(mint);

  const draftPosition: Partial<PositionWithMeta> | undefined = useMemo(
    () =>
      formValues && {
        lockup: {
          startTs: new BN(new Date().getTime() / 1000),
          endTs: new BN(
            new Date().setDate(
              new Date().getDate() + formValues.lockupPeriodInDays
            ) / 1000
          ),
          kind:
            formValues!.lockupKind == LockupKind.cliff
              ? ({ cliff: {} } as any)
              : ({ decay: {} } as any),
        },
        amountDepositedNative: toBN(formValues!.amount, mintAcc?.decimals || 6),
        delegatedSubDao: selectedSubDaoPk,
        // @ts-ignore
        registrar: registrar?.pubkey,
      },
    [formValues, mintAcc, selectedSubDaoPk, registrar]
  );

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
    } catch (e: any) {
      setIsSubmitting(false);
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Position creation failed, please try again");
      }
    }
  };

  const verb =
    (step === 1 && "Create") ||
    (steps > 2 && step === 2 && "Delegate") ||
    (step === steps && "Review");

  const subheading =
    (step === 1 &&
      "Boost your voting power by strategically locking your tokens for a specified period, opting for either a constant or decaying lockup") ||
    (steps > 2 && step === 2 && "Choose a subnetwork to delegate to") ||
    (step === steps && "Review your position before creating it");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-10 px-8 overflow-y-auto overflow-x-hidden max-md:min-w-full max-md:min-h-full max-h-screen">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <h3>{verb} Position</h3>
            <StepIndicator steps={steps} currentStep={step} />
          </div>
          <p className="text-sm">{subheading}</p>
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
              <div className="flex flex-col gap-4 p-4 text-sm bg-slate-600 rounded">
                Delegating your position to a subnetwork and voting regularly
                earns you HNT rewards. Select the subnetwork you believe offers
                the greatest potential for future revenue. This choice does not
                affect your HNT rewards for this delegation. Delegation
                percentages drive the amount of HNT emissions that go towards
                each subnetwork&apos;s growth.
              </div>

              <DataSplitBars />

              <SubDaoSelection
                hideNoneOption
                selectedSubDaoPk={selectedSubDaoPk}
                onSelect={setSelectedSubDaoPk}
              />

              <AutomationSettings
                automationEnabled={automationEnabled}
                setAutomationEnabled={setAutomationEnabled}
                solFees={rentFee}
                prepaidTxFees={prepaidTxFees}
              />

              <div className="flex flex-col gap-4 p-4 text-sm bg-slate-600 rounded">
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
                disabled={!!insufficientBalance}
              >
                {insufficientBalance ? "Insufficient SOL" : "Review"}
              </Button>
            </div>
          </>
        )}
        {step === steps && (
          <>
            {draftPosition && <PositionPreview position={draftPosition} />}
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
