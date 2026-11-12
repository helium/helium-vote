"use client";

import {
  BaseUnits,
  formatTokenAmount,
  isTokenAmountEdit,
  normalizeTokenAmountInput,
  parseTokenAmount,
  TokenAmount,
} from "@/lib/tokenAmount";
import { useGovernance } from "@/providers/GovernanceProvider";
import React, { FC, useState } from "react";
import { Input } from "./ui/input";

type TokenAmountField = {
  text: string;
  amount: TokenAmount;
  decimals: number | undefined;
  symbol: string;
  setText: (text: string) => void;
};

// Keeps the text as the user types it, and parses it against `max` in the
// mint of the current Network. Amounts are in the mint's smallest unit.
export const useTokenAmountInput = (
  max: BaseUnits,
  initAmount?: BaseUnits
) => {
  const { mintAcc, network } = useGovernance();
  const decimals = mintAcc?.decimals;
  const [text, setText] = useState(() =>
    initAmount && decimals !== undefined
      ? formatTokenAmount(initAmount, decimals)
      : ""
  );
  // Undefined while the mint loads.
  const maxText =
    decimals === undefined ? undefined : formatTokenAmount(max, decimals);
  const field: TokenAmountField = {
    text,
    amount: parseTokenAmount(text, decimals, max),
    decimals,
    symbol: network.toUpperCase(),
    setText,
  };

  return {
    field,
    maxText,
    setMax: () => maxText !== undefined && setText(maxText),
  };
};

export const TokenAmountInput: FC<{
  field: TokenAmountField;
  // Shown when the amount is over `max`. Defaults to an insufficient balance.
  exceedsMaxMessage?: string;
}> = ({
  field: { text, amount, decimals, symbol, setText },
  exceedsMaxMessage,
}) => (
  <div className="flex flex-col gap-1">
    <Input
      placeholder="Enter amount"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={text}
      aria-invalid={amount.kind === "exceedsBalance" || amount.kind === "invalid"}
      onChange={({ target }) => {
        const next = normalizeTokenAmountInput(target.value);
        if (isTokenAmountEdit(text, next, decimals)) {
          setText(next);
        }
      }}
    />
    {amount.kind === "exceedsBalance" && (
      <p className="text-xs text-red-500">
        {exceedsMaxMessage ?? `Insufficient ${symbol} balance`}
      </p>
    )}
    {amount.kind === "invalid" && (
      <p className="text-xs text-red-500">
        {decimals === undefined
          ? "Enter a valid amount"
          : `Use at most ${decimals} decimal places`}
      </p>
    )}
  </div>
);
