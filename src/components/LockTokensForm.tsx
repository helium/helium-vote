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
  const hasMaxLockup = maxLockupTimeInDays && maxLockupTimeInDays !== Infinity;

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
        Math.max(Number(mintMinAmount), Number(e.target.value)).toFixed(
          currentPrecision
        )
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
    <div className="flex flex-col max-md:h-full gap-4">
      {hasMinLockup ? (
        <span className="flex flex-col gap-1 p-2 text-xs bg-slate-600 rounded">
          Select a new lockup period longer than or equal to the existing{" "}
          {getFormattedStringFromDays(minLockupTimeInDays)}
          {mode === "split" && (
            <span>
              Splitting a Landrush position after the Landrush period will
              result in the split tokens losing the multiplier!
            </span>
          )}
        </span>
      ) : null}

      <div className="flex flex-col gap-4">
        {["lock", "split"].includes(mode) && (
          <div className="flex flex-col gap-1">
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
              min={mintMinAmount}
              value={amount}
              type="number"
              onChange={handleAmountChange}
              step={mintMinAmount}
            />
            {mode === "lock" && (
              <div className="p-2 text-xs bg-slate-600 rounded">
                ve{upperNetwork} is computed as a factor of token amount and
                lockup time and will decay linearly once unlocked
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between items-center text-sm">
            {!showCustomDuration ? (
              <span>Duration</span>
            ) : (
              <span>Duration (In Days)</span>
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
                      ? "surfaceSecondaryText !bg-info !border-info-foreground font-medium"
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
              <div className="flex flex-row flex-grow gap-2.5">
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
                        "flex flex-row flex-1 justify-center items-center py-2.5 rounded-md  bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
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
              type="number"
              min={hasMinLockup ? minLockupTimeInDays : 1}
              max={hasMaxLockup ? maxLockupTimeInDays : Infinity}
              step={1}
              onChange={({ target: { value } }) =>
                setLockupPeriodInDays(Number(value || 0))
              }
              onBlur={({ target: { value } }) => {
                const val = Number(value || 0);
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
        </div>

        <div className="flex flex-col gap-1">
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
          <div className="flex flex-row rounded-full items-center w-full h-2 overflow-hidden bg-background">
            <div
              style={{ width: `${lockupMultiplier}%` }}
              className={"h-2 flex bg-vote-6"}
            />
          </div>
        </div>

        {["lock", "split"].includes(mode) && (
          <div className="flex flex-col gap-1">
            <LockupChart
              type={lockupKind}
              lockupPeriodInDays={lockupPeriodInDays}
            />
            {lockupKind === LockupKind.cliff && (
              <span className="p-2 text-xs bg-slate-600 rounded">
                Cliff positions start decaying right away as soon as you create
                them. After {getFormattedStringFromDays(lockupPeriodInDays)}{" "}
                you&rsquo;ll be able to reclaim your tokens.
              </span>
            )}
            {lockupKind === LockupKind.constant && (
              <span className="p-2 text-xs bg-slate-600 rounded">
                Constant positions only start decaying once you initiate the
                decay. It will take{" "}
                {getFormattedStringFromDays(lockupPeriodInDays)} after you
                initiate decaying of this position for the locked tokens to be
                available for reclaiming. 2 years is used as an example here.
                You can initiate the decay at any time
              </span>
            )}
          </div>
        )}

        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            className="size-5"
            checked={lockupKind === LockupKind.constant}
            onClick={handleToggleLockupKind}
          />
          <p className="text-sm font-medium">
            Delay the decay of this position?
          </p>
        </div>
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
                  amount > maxLockupAmount ||
                  !lockupPeriod.value ||
                  lockupPeriod.value === 0 ||
                  isSubmitting,
                extend:
                  !lockupPeriod.value ||
                  lockupPeriod.value === 0 ||
                  isSubmitting,
                split:
                  !amount ||
                  amount > maxLockupAmount ||
                  !lockupPeriod.value ||
                  lockupPeriod.value === 0 ||
                  isSubmitting,
              }[mode]
            }
          >
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            {!amount || amount <= maxLockupAmount
              ? submitText
              : `Insufficient ${upperNetwork}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
