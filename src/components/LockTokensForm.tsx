"use client";

import {
  getFormattedStringFromDays,
  getMintMinAmountAsDecimal,
  precision,
  yearsToDays,
} from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import classNames from "classnames";
import { Loader2 } from "lucide-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { LockupChart } from "./LockupChart";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";

export const defaultLockupPeriods = [
  {
    value: 183,
    display: "6m",
    blurb: "6 months",
  },
  {
    value: yearsToDays(1),
    display: "1y",
    blurb: "1 year",
  },
  {
    value: yearsToDays(2),
    display: "2y",
    blurb: "2 years",
  },
  {
    value: yearsToDays(3),
    display: "3y",
    blurb: "3 years",
  },
  {
    value: yearsToDays(4),
    display: "4y",
    blurb: "4 years",
  },
];

export enum LockupKind {
  cliff = "cliff",
  constant = "constant",
}

export interface LockTokensFormValues {
  lockupKind: LockupKind;
  amount: number;
  lockupPeriod: (typeof defaultLockupPeriods)[0];
  lockupPeriodInDays: number;
}

export const LockTokensForm: FC<{
  initValues?: Partial<LockTokensFormValues>;
  mode?: "lock" | "extend" | "split";
  minLockupTimeInDays?: number;
  maxLockupTimeInDays?: number;
  maxLockupAmount: number;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  calcMultiplierFn: (lockupPeriodInDays: number) => number;
  onCancel?: () => void;
  onSubmit: (values: LockTokensFormValues) => Promise<void>;
}> = ({
  initValues,
  mode = "lock",
  minLockupTimeInDays = 0,
  maxLockupTimeInDays = 1460, // 4 years
  maxLockupAmount,
  calcMultiplierFn,
  isSubmitting = false,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  onSubmit,
}) => {
  const { network, mintAcc } = useGovernance();
  const mintMinAmount = mintAcc ? getMintMinAmountAsDecimal(mintAcc) : 1;
  const currentPrecision = precision(mintMinAmount);
  const hasMinLockup = minLockupTimeInDays && minLockupTimeInDays > 0;

  const lockupPeriodOptions = [
    ...(hasMinLockup
      ? [
          {
            value: minLockupTimeInDays,
            display: "min",
            blurb: minLockupTimeInDays + " days",
          },
        ]
      : []),
    ...defaultLockupPeriods.filter(
      (lp) => lp.value > minLockupTimeInDays && lp.value <= maxLockupTimeInDays
    ),
  ];

  const [amount, setAmount] = useState<number | undefined>(initValues?.amount);

  const [lockupKind, setLockupKind] = useState(
    initValues?.lockupKind || LockupKind.cliff
  );

  const [lockupPeriod, setLockupPeriod] = useState(
    initValues?.lockupPeriod || lockupPeriodOptions[0]
  );

  const [lockupPeriodInDays, setLockupPeriodInDays] = useState<number>(
    initValues?.lockupPeriodInDays || lockupPeriodOptions[0].value
  );

  const [showCustomDuration, setShowCustomDuration] = useState<boolean>(
    initValues?.lockupPeriodInDays
      ? !lockupPeriodOptions.some(
          (lp) => lp.value === initValues.lockupPeriodInDays
        )
      : false
  );

  const lockupMultiplier = useMemo(
    () => calcMultiplierFn(lockupPeriodInDays),
    [lockupPeriodInDays, calcMultiplierFn]
  );

  useEffect(() => {
    if (lockupPeriod && !showCustomDuration) {
      setLockupPeriodInDays(lockupPeriod.value);
    }
  }, [lockupPeriod, showCustomDuration, setLockupPeriodInDays]);

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
          Math.min(Number(maxLockupAmount), Number(e.target.value))
        ).toFixed(currentPrecision)
      )
    );
  };

  const handleSubmit = async () => {
    await onSubmit({
      lockupKind,
      lockupPeriod,
      amount: amount!,
      lockupPeriodInDays,
    });
  };

  const handleToggleLockupKind = () =>
    setLockupKind(
      lockupKind === LockupKind.cliff ? LockupKind.constant : LockupKind.cliff
    );

  const upperNetwork = network.toUpperCase();

  return (
    <div className="flex flex-col max-md:h-full gap-6">
      {hasMinLockup ? (
        <div className="flex flex-col gap-2">
          <span className="flex flex-col gap-2 text-sm px-4 py-2 bg-slate-600 rounded">
            Select a new lockup period longer than or equal to the existing{" "}
            {getFormattedStringFromDays(minLockupTimeInDays)}
            {mode === "split" && (
              <span>
                Splitting a Landrush position after the Landrush period will
                result in the split tokens losing the multiplier!
              </span>
            )}
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        {["lock", "split"].includes(mode) && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center text-sm">
              <span>Lockup Amount</span>
              <div className="flex flex-row gap-1 items-center">
                <span
                  className="underline cursor-pointer"
                  onClick={() => setAmount(maxLockupAmount)}
                >
                  Max Amount:
                </span>
                <span>
                  {maxLockupAmount} {upperNetwork}
                </span>
              </div>
            </div>
            <Input
              placeholder="Enter amount"
              max={maxLockupAmount}
              min={mintMinAmount}
              value={amount}
              type="number"
              onChange={handleAmountChange}
              step={mintMinAmount}
            />
            {mode === "lock" && (
              <div className="p-2 text-sm bg-slate-600 rounded">
                <span>
                  ve{upperNetwork} is computed as a factor of token amount and
                  lockup time i.e. 100 {upperNetwork} will provide 500 ve
                  {upperNetwork} (voting power) in the Helium network which will
                  decay linearly once unlocked.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center text-sm">
            {!showCustomDuration ? (
              <span>Duration</span>
            ) : (
              <span>Duration (days)</span>
            )}
            <div className="flex flex-row gap-1 items-center">
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  setShowCustomDuration(!showCustomDuration);
                  setLockupPeriodInDays(lockupPeriod.value);
                }}
              >
                Custom Duration
              </span>
            </div>
          </div>
          {!showCustomDuration ? (
            <div className="flex flex-col flex-grow gap-4">
              {hasMinLockup ? (
                <div
                  className={classNames(
                    "flex flex-row flex-1 justify-center items-center py-4 rounded-md  bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
                    lockupPeriodOptions[0].value === lockupPeriod.value
                      ? "surfaceSecondaryText" &&
                          "!bg-info !border-info-foreground font-medium"
                      : "primaryText"
                  )}
                  onClick={() => {
                    setLockupPeriod(lockupPeriodOptions[0]);
                    setShowCustomDuration(false);
                  }}
                >
                  {getFormattedStringFromDays(minLockupTimeInDays)}
                </div>
              ) : null}
              <div className="flex flex-row flex-grow gap-4">
                {(hasMinLockup
                  ? [...lockupPeriodOptions.splice(1)]
                  : lockupPeriodOptions
                ).map((option) => {
                  const isActive =
                    !showCustomDuration && option.value === lockupPeriod.value;

                  return (
                    <div
                      key={option.value}
                      className={classNames(
                        "flex flex-row flex-1 justify-center items-center py-4 rounded-md  bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
                        isActive &&
                          "!bg-info !border-info-foreground font-medium"
                      )}
                      onClick={() => setLockupPeriod(option)}
                    >
                      {option.display}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <Input
              placeholder="Enter amount"
              value={lockupPeriodInDays}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onChange={(e) =>
                setLockupPeriodInDays(Number(e.target.value || 0))
              }
              onBlur={() => {
                const val = lockupPeriodInDays;

                setLockupPeriodInDays(
                  val > minLockupTimeInDays
                    ? val > maxLockupTimeInDays
                      ? maxLockupTimeInDays
                      : val
                    : minLockupTimeInDays
                );
              }}
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center text-sm">
              {lockupKind === LockupKind.constant ? (
                <span>Vote Weight Multiplier</span>
              ) : (
                <HoverCard>
                  <HoverCardTrigger className="flex flex-row gap-2 justify-center items-center">
                    <FaCircleInfo /> <span>Initial Vote Power Multiplier:</span>
                  </HoverCardTrigger>
                  <HoverCardContent side="top">
                    The multiplier will decline linearly over time
                  </HoverCardContent>
                </HoverCard>
              )}
              <span>{lockupMultiplier}x</span>
            </div>
            <div className="flex flex-row rounded-full items-center w-full h-3 overflow-hidden bg-background">
              <div
                style={{ width: `${lockupMultiplier}%` }}
                className={"h-3 flex bg-vote-6"}
              />
            </div>
          </div>
        </div>
        {["lock", "split"].includes(mode) && (
          <>
            <LockupChart
              type={lockupKind}
              lockupPeriodInDays={lockupPeriodInDays}
            />
            {lockupKind === LockupKind.cliff && (
              <span className="px-4 py-2 text-sm bg-slate-600 rounded">
                After {getFormattedStringFromDays(lockupPeriodInDays)} you'll be
                able to reclaim your tokens; your voting power will decay over
                time as soon as you create this position.
              </span>
            )}
            {lockupKind === LockupKind.constant && (
              <span className="px-4 py-2 text-sm bg-slate-600 rounded">
                It will take {getFormattedStringFromDays(lockupPeriodInDays)}{" "}
                after you initiate decaying of this position for the locked
                tokens to be available for reclaiming. You can initiate the
                decay at any time.
              </span>
            )}
            <div className="flex flex-row gap-2 items-center py-2">
              <Checkbox
                className="size-7"
                checked={lockupKind === LockupKind.constant}
                onClick={handleToggleLockupKind}
              />
              <h5>Delay the decay of this position?</h5>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col flex-grow justify-end">
        <div className="flex flex-row gap-2">
          {onCancel && (
            <Button
              variant="secondary"
              className="flex-grow"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
          <Button
            className="flex-grow text-foreground gap-2"
            onClick={handleSubmit}
            disabled={
              {
                lock:
                  !amount ||
                  !maxLockupAmount ||
                  !lockupPeriod.value ||
                  lockupPeriod.value === 0 ||
                  isSubmitting,
                extend:
                  !lockupPeriod.value ||
                  lockupPeriod.value === 0 ||
                  isSubmitting,
                split:
                  !amount ||
                  !maxLockupAmount ||
                  !lockupPeriod.value ||
                  lockupPeriod.value === 0 ||
                  isSubmitting,
              }[mode]
            }
          >
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  );
};
