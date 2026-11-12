import BN from "bn.js";

// An amount in the mint's smallest unit.
export type BaseUnits = BN & { readonly __unit: "baseUnits" };

export const baseUnits = (amount: BN): BaseUnits => amount as BaseUnits;

// A token amount the user typed, parsed against their balance. Amounts are in
// the mint's smallest unit.
export type TokenAmount =
  | { kind: "invalid" }
  | { kind: "empty" }
  | { kind: "mintLoading" }
  | { kind: "zero" }
  | { kind: "exceedsBalance" }
  | { kind: "valid"; amount: BaseUnits };

// True when `raw` is a partial or complete decimal with at most `decimals`
// fraction digits. Partial text such as "0." must pass so the user can type.
// `decimals` is undefined while the mint loads; any fraction length passes.
export const isTokenAmountInput = (
  raw: string,
  decimals: number | undefined
): boolean => {
  if (decimals === 0) return /^\d*$/.test(raw);
  const fraction = decimals === undefined ? "*" : `{0,${decimals}}`;
  return new RegExp(`^\\d*(\\.\\d${fraction})?$`).test(raw);
};

// Reads a lone comma as the decimal separator, as comma-locale decimal keypads
// type it. Other text is unchanged.
export const normalizeTokenAmountInput = (raw: string): string =>
  !raw.includes(".") && raw.split(",").length === 2
    ? raw.replace(",", ".")
    : raw;

// True when the field may change from `prev` to `next`. An edit that shortens
// a decimal passes at any fraction length, so text with too many fraction
// digits (typed before the mint loaded) can be corrected with backspace.
export const isTokenAmountEdit = (
  prev: string,
  next: string,
  decimals: number | undefined
): boolean =>
  isTokenAmountInput(next, next.length < prev.length ? undefined : decimals);

// Parses decimal text into the mint's smallest unit, with no float step.
export const parseTokenAmount = (
  raw: string,
  decimals: number | undefined,
  balance: BaseUnits
): TokenAmount => {
  if (!isTokenAmountInput(raw, decimals)) return { kind: "invalid" };
  if (raw === "" || raw === ".") return { kind: "empty" };
  if (decimals === undefined) return { kind: "mintLoading" };

  const [whole, fraction = ""] = raw.split(".");
  const amount = baseUnits(new BN(whole + fraction.padEnd(decimals, "0")));
  if (amount.isZero()) return { kind: "zero" };
  if (amount.gt(balance)) return { kind: "exceedsBalance" };
  return { kind: "valid", amount };
};

// The amount as the blockchain API takes it: a whole number of base units.
export const toApiAmount = (amount: BaseUnits): string => amount.toString(10);

// Writes an amount in the mint's smallest unit as decimal text, without
// trailing fraction zeros.
export const formatTokenAmount = (amount: BaseUnits, decimals: number): string => {
  const digits = amount.toString().padStart(decimals + 1, "0");
  const whole = digits.slice(0, digits.length - decimals);
  const fraction = digits.slice(digits.length - decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
};
