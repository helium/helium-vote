"use client";

import {
  getMinDurationFmt,
  getMintMinAmountAsDecimal,
  getTimeLeftFromNowFmt,
  humanReadable,
  precision,
} from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { PositionWithMeta, useEnrolledPosition } from "@helium/voter-stake-registry-hooks";
import { Mint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import classNames from "classnames";
import { Loader2, X } from "lucide-react";
import React, { FC, useMemo, useState } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { PositionCard } from "../PositionCard";
import { StepIndicator } from "../StepIndicator";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ConfirmationItem } from "./ConfirmationItem";
import { enrolledPositionKey } from "@helium/position-voting-rewards-sdk";

const PositionBlurb = ({
  position,
  mint,
  network,
  title,
  className = "",
}: {
  position: PositionWithMeta;
  mint?: Mint;
  network: string;
  title: string;
  className?: string;
}) => {
  const { lockup, hasGenesisMultiplier } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";

  return (
    <ConfirmationItem
      img={{ alt: `${network} icon`, src: `/images/${network}.svg` }}
      title={title}
      description={`${humanReadable(
        position.amountDepositedNative,
        mint?.decimals
      )} for ${
        isConstant
          ? getMinDurationFmt(position.lockup.startTs, position.lockup.endTs)
          : getTimeLeftFromNowFmt(position.lockup.endTs)
      } left`}
      className={className}
    />
  );
};

export const MergePositionPrompt: FC<{
  position: PositionWithMeta;
  positions: PositionWithMeta[];
  maxActionableAmount: number;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (position: PositionWithMeta, amount: number) => Promise<void>;
}> = ({
  position,
  positions,
  maxActionableAmount,
  isSubmitting,
  onCancel,
  onConfirm,
}) => {
  const [step, setStep] = useState(1);
  const [selectedPosPk, setSelectedPosPk] = useState<PublicKey>();
  const [amount, setAmount] = useState<number>();
  const { mintAcc, network } = useGovernance();
  const mintMinAmount = mintAcc ? getMintMinAmountAsDecimal(mintAcc) : 1;
  const currentPrecision = precision(mintMinAmount);

  const enrolledPositionK = useMemo(
    () => enrolledPositionKey(position.pubkey)[0],
    [position.pubkey]
  );
  const enrolledPosition = useEnrolledPosition(enrolledPositionK);
  const numVotedProposals =
    (enrolledPosition && enrolledPosition.info?.recentProposals.length) || 0;

  const selectedPosition =
    selectedPosPk && positions.find((pos) => pos.pubkey.equals(selectedPosPk))!;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!Number(val)) {
      setAmount(undefined);
      return;
    }

    setAmount(
      parseFloat(
        Math.max(
          Number(mintMinAmount),
          Math.min(Number(maxActionableAmount), Number(e.target.value))
        ).toFixed(currentPrecision)
      )
    );
  };

  const handleSubmit = async () => {
    if (amount && selectedPosition) {
      await onConfirm(selectedPosition, amount);
    }
  };

  const canMerge = positions && positions.length > 0;
  const upperNetwork = network.toUpperCase();

  return (
    <div className="flex flex-col h-full p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto md:justify-center">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      {!canMerge && (
        <div className="flex flex-col flex-grow justify-center">
          <div className="flex flex-col max-md:flex-grow items-center justify-center">
            <div className="flex flex-col items-center">
              <h3 className="text-xl text-muted-foreground">Unable to Merge</h3>
              <p className="text-sm text-center text-muted-foreground">
                No positions meet the criteria for merging
              </p>
            </div>
          </div>
          <div className="flex flex-col max-md:flex-grow max-md:justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {canMerge && (
        <div className="flex flex-col mb-4 gap-1">
          <div className="flex flex-row justify-between items-center">
            <h3>Merge Position</h3>
            {canMerge && <StepIndicator steps={2} currentStep={step} />}
          </div>
          <p>
            Positions cannot be transferred between accounts; only within the
            same account. Transfers are limited to positions of{" "}
            <span className="font-bold">equal or greater duration</span>, useful
            for consolidation
          </p>
        </div>
      )}
      {canMerge && step === 1 && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center text-xs">
              <span>Lockup Amount</span>
              <div className="flex flex-row gap-1 items-center">
                <span
                  className="underline cursor-pointer"
                  onClick={() => setAmount(maxActionableAmount)}
                >
                  Max Amount:
                </span>
                <span>
                  {maxActionableAmount} {upperNetwork}
                </span>
              </div>
            </div>
            <Input
              placeholder="Enter amount"
              max={maxActionableAmount}
              min={mintMinAmount}
              value={amount}
              type="number"
              onChange={handleAmountChange}
              step={mintMinAmount}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col flex-shrink gap-2 mt-4">
              <div className="flex flex-row justify-between items-center text-xs">
                <span>Available Positions</span>
              </div>
              {positions.map((pos) => {
                const isActive = selectedPosPk?.equals(pos.pubkey);

                return (
                  <PositionCard
                    key={pos.pubkey.toBase58()}
                    position={pos}
                    compact={true}
                    onClick={() => setSelectedPosPk(pos.pubkey)}
                    className={classNames(
                      "bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
                      isActive && "!bg-info !border-info-foreground font-medium"
                    )}
                  />
                );
              })}
            </div>
            {numVotedProposals > 0 && (
              <span className="text-red-500">
                {numVotedProposals >= 2 &&
                  "Position is currently eligible for voting rewards. If you extend this position, you will need to vote on 2 more proposals to gain eligibility again."}
                {numVotedProposals === 1 &&
                  "You have voted on 1 proposal. Extending your position resets your voting progress. If you extend this position, you will need to vote on 2 more proposals before this position is eligible for rewards."}
              </span>
            )}
            <div className="flex flex-row flex-1 gap-2 w-full">
              <Button variant="secondary" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                className="flex-1 text-foreground"
                disabled={!amount || !selectedPosPk}
                onClick={() => setStep(step + 1)}
              >
                Review
              </Button>
            </div>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="flex flex-row max-md:flex-col relative">
            <PositionBlurb
              position={position}
              mint={mintAcc}
              network={network}
              title="Transfering from..."
              className="rounded-l-md bg-gradient-to-t from-background to-background/30 max-md:rounded-bl-none max-md:rounded-t-md"
            />
            <FaCircleArrowRight className="absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6 text-foreground max-mb:transform max-md:rotate-90" />
            <PositionBlurb
              position={selectedPosition!}
              mint={mintAcc}
              network={network}
              title="Transfering to..."
              className="rounded-r-md bg-gradient-to-b from-background to-background/30 max-md:rounded-tr-none max-md:rounded-b-md"
            />
          </div>
          <div className="flex flex-col max-md:flex-grow justify-end gap-2 mt-4">
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
                {isSubmitting ? "Merging Position..." : "Confirm"}
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
