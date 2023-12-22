import BN from "bn.js";
import dayjs from "dayjs";
import type { BigNumber } from "bignumber.js";
import { Mint } from "@solana/spl-token";
const relativeTime = require("dayjs/plugin/relativeTime");

export function getMintMinAmountAsDecimal(mint: Mint) {
  return 1 * Math.pow(10, -mint.decimals);
}


export const calculatePct = (c = new BN(0), total?: BN) => {
  if (total?.isZero()) {
    return 0;
  }

  return new BN(100)
    .mul(c)
    .div(total ?? new BN(1))
    .toNumber();
};

function getSeparator(separatorType) {
  const numberWithGroupAndDecimalSeparator = 1000.1;
  return Intl.NumberFormat()
    .formatToParts(numberWithGroupAndDecimalSeparator)
    .find((part) => part.type === separatorType).value;
}

export function humanReadable(
  amount?: BN,
  decimals?: number
): string | undefined {
  if (typeof decimals === "undefined" || typeof amount === "undefined") return;

  const input = amount.toString();
  const integerPart =
    input.length > decimals ? input.slice(0, input.length - decimals) : "";
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    getSeparator('group')
  );
  const decimalPart =
    decimals !== 0
      ? input
          .slice(-decimals)
          .padStart(decimals, "0") // Add prefix zeros
          .replace(/0+$/, "") // Remove trailing zeros
      : "";

  return `${formattedIntegerPart.length > 0 ? formattedIntegerPart : "0"}${
    Number(decimalPart) !== 0 ? `${getSeparator("decimal")}${decimalPart}` : ""
  }`;
}

export function truncatedHumanReadable(
  amount?: BN,
  decimals?: number,
  maxDecimals?: number
): string | undefined {
  if (typeof decimals === "undefined" || typeof amount === "undefined") return;
  if (amount.isZero()) {
    return "0";
  }

  const suffixes = ["", "K", "M", "B", "T", "Q", "Qu", "Sx", "Sp", "Oc"]; // Add more suffixes as needed
  const input = amount.toString();
  const integerPart =
    input.length > decimals ? input.slice(0, input.length - decimals) : "";
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    getSeparator("group")
  );
  const decimalPart =
    decimals !== 0
      ? input
          .slice(-decimals)
          .padStart(decimals, "0") // Add prefix zeros
          .replace(/0+$/, "") // Remove trailing zeros
      : "";

  const displayDecimals =
    typeof maxDecimals === "undefined"
      ? decimals
      : input.length > decimals
      ? maxDecimals
      : decimals;
  const num =
    formattedIntegerPart +
    (displayDecimals > 0 && Number(decimalPart) !== 0 ? `.${decimalPart.slice(0, displayDecimals)}` : "");
  const tier = (Math.log10(Number(integerPart)) / 3) | 0;

  if (tier === 0) return num.toString();

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);

  const scaled = Number(integerPart) / scale;
  return scaled.toFixed(displayDecimals) + suffix;
}

export const fmtTokenAmount = (c: BN, decimals?: number) =>
  c?.div(new BN(10).pow(new BN(decimals ?? 0))).toNumber() || 0;

dayjs.extend(relativeTime);
export const fmtUnixTime = (d: BN | BigNumber | number) =>
  //@ts-ignore
  dayjs(typeof d === "number" ? d * 1000 : d.toNumber() * 1000).fromNow();

export function precision(a) {
  if (!isFinite(a)) return 0;
  let e = 1,
    p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p++;
  }
  return p;
}

const fmtMsToTime = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;

  hours = hours % 24;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const fmtSecsToTime = (secs: number) => {
  return fmtMsToTime(secs * 1000);
};

export const fmtTimeToString = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const daysStr = days > 0 ? `${days}d : ` : "";
  const hoursStr = hours > 0 ? `${hours}h : ` : "";
  const minutesStr = minutes > 0 ? `${minutes}m` : "";

  return `${daysStr}${hoursStr}${minutesStr}${seconds}s`;
};

