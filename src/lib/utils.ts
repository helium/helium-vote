import { AnchorProvider } from "@coral-xyz/anchor";
import { init as initProp } from "@helium/proposal-sdk";
import {
  HELIUM_COMMON_LUT,
  HELIUM_COMMON_LUT_DEVNET,
  batchInstructionsToTxsWithPriorityFee,
  bulkSendTransactions,
  sendAndConfirmWithRetry,
  toVersionedTx,
} from "@helium/spl-utils";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { Mint } from "@solana/spl-token";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import BN from "bn.js";
import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { MAX_TRANSACTIONS_PER_SIGNATURE_BATCH } from "./constants";
import { ILegacyProposal, ProposalState, ProposalV0 } from "./types";

export const DAYS_PER_YEAR = 365;
export const SECS_PER_DAY = 86400;
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
export const HOURS_PER_DAY = 24;
export const MINS_PER_HOUR = 60;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ellipsisMiddle = (wallet: string): string => {
  const length = wallet.length;
  const start = wallet.slice(0, 5);
  const end = wallet.slice(length - 5, length);
  const middle = "...";
  return start + middle + end;
};

export const formMetaTags = (args?: {
  title?: string;
  description?: string;
  openGraphImageAbsoluteUrl?: string;
  url?: string;
}) => {
  const { title, description, openGraphImageAbsoluteUrl, url } = args || {};
  const metaTitle = title ? `${title} — Helium Vote` : "Helium Vote";
  const metaDescription = description
    ? description
    : "Helium Vote is where the Helium Community comes together to make decisions on the Network.";
  const metaImage = openGraphImageAbsoluteUrl
    ? openGraphImageAbsoluteUrl
    : "https://heliumvote.com/images/o-g.png";
  const metaUrl = url ? url : "https://heliumvote.com";

  return {
    metadataBase: new URL("https://heliumvote.com"),
    icons: ["/favicon.ico"],
    title: metaTitle,
    description: metaDescription,
    itemProps: {
      name: metaTitle,
      description: metaDescription,
      image: metaImage,
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
      image: metaImage,
      card: "summary_large_image",
      site: "@helium",
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      image: metaImage,
      url: metaUrl,
      site_name: "Helium Vote",
      locale: "en_US",
      type: "website",
    },
  } as Metadata;
};

export const getLegacyProposalState = (
  proposal: ILegacyProposal
): ProposalState => {
  const totalVotes = proposal.outcomes.reduce((acc, o) => acc + o.hntVoted, 0);
  const forVotes = proposal.outcomes[0].hntVoted;
  const againstVotes = proposal.outcomes[1].hntVoted;
  const percentageOfForVotes = (forVotes / totalVotes) * 100;
  const passed = forVotes > againstVotes && percentageOfForVotes >= 66.67;

  return passed ? "passed" : "failed";
};

export const getDerivedProposalState = (
  proposal: ProposalV0
): ProposalState | undefined => {
  if (proposal?.state && proposal?.choices) {
    const keys = Object.keys(proposal.state);
    if (keys.includes("voting")) return "active";
    if (keys.includes("cancelled")) return "cancelled";
    if (keys.includes("resolved") && proposal.state.resolved) {
      if (proposal.choices.length > 2) {
        return "completed";
      }

      if (
        (proposal.state.resolved.choices.length === 1 &&
          proposal.choices[proposal.state.resolved.choices[0]].name.startsWith(
            "For"
          )) ||
        (proposal.state.resolved.choices.length === 1 &&
          proposal.choices[proposal.state.resolved.choices[0]].name.startsWith(
            "Yes"
          )) ||
        proposal.state.resolved.choices.length > 1
      ) {
        return "passed";
      }

      if (
        proposal.state.resolved.choices.length === 0 ||
        (proposal.state.resolved.choices.length === 1 &&
          proposal.choices[proposal.state.resolved.choices[0]].name.startsWith(
            "Against"
          )) ||
        (proposal.state.resolved.choices.length === 1 &&
          proposal.choices[proposal.state.resolved.choices[0]].name.startsWith(
            "No"
          ))
      ) {
        return "failed";
      }
    }
  }
};

export function getFormattedStringFromDays(
  numberOfDays: number,
  fullFormat = false
) {
  const years = Math.floor(numberOfDays / DAYS_PER_YEAR);
  const months = Math.floor((numberOfDays % DAYS_PER_YEAR) / DAYS_PER_MONTH);
  const days = Math.floor((numberOfDays % DAYS_PER_YEAR) % DAYS_PER_MONTH);
  const hours = (numberOfDays - Math.floor(numberOfDays)) * HOURS_PER_DAY;
  const hoursInt = Math.floor(hours);
  const minutes = Math.floor((hours - hoursInt) * MINS_PER_HOUR);
  const yearSuffix = years > 1 ? " years" : " year";
  const monthSuffix = months > 1 ? " months" : " month";
  const daysSuffix = days > 1 ? " days" : " day";
  const yearsDisplay =
    years > 0 ? `${years}${fullFormat ? yearSuffix : "y"}` : null;
  const monthsDisplay =
    months > 0 ? `${months}${fullFormat ? monthSuffix : "m"}` : null;
  const daysDisplay =
    days > 0 ? `${days}${fullFormat ? daysSuffix : "d"}` : null;
  const hoursDisplay = hours > 0 ? `${hoursInt}h ${minutes}min` : null;
  const text =
    !years && !months && days <= 1
      ? [daysDisplay, hoursDisplay].filter(Boolean).join(" ")
      : [yearsDisplay, monthsDisplay, daysDisplay].filter(Boolean).join(" ");
  return text || 0;
}

export const yearsToDays = (years: number) => {
  return DAYS_PER_YEAR * years;
};
export const daysToYear = (days: number) => {
  return days / DAYS_PER_YEAR;
};
export const yearsToSecs = (years: number) => {
  return DAYS_PER_YEAR * years * SECS_PER_DAY;
};

export const daysToSecs = (days: number) => {
  return days * SECS_PER_DAY;
};

export const secsToDays = (secs: number) => {
  return secs / SECS_PER_DAY;
};

export const daysToMonths = (days: number) => {
  return days / DAYS_PER_MONTH;
};

export const getMinDurationFmt = (startTs: BN, endTs: BN) => {
  return getFormattedStringFromDays(getMinDurationInDays(startTs, endTs));
};

export const getTimeLeftFromNowFmt = (ts: BN, fullFormat = false) => {
  const dateNowSecTimeStampBN = new BN(Date.now() / 1000);
  return getFormattedStringFromDays(
    ts.sub(dateNowSecTimeStampBN).toNumber() / SECS_PER_DAY,
    fullFormat
  );
};

export const getTimeFromNowFmt = (ts: BN, fullFormat = false) => {
  const dateNowSecTimeStampBN = new BN(Date.now() / 1000);
  const adjustedTs = ts.sub(dateNowSecTimeStampBN).toNumber() / SECS_PER_DAY;
  return `${getFormattedStringFromDays(Math.abs(adjustedTs), fullFormat)}${
    adjustedTs < 0 ? " ago" : ""
  }`;
};

export const getMinDurationInDays = (startTs: BN, endTs: BN) => {
  return endTs.sub(startTs).toNumber() / SECS_PER_DAY;
};

export const humanReadable = (
  amount?: BN,
  decimals?: number
): string | undefined => {
  if (typeof decimals === "undefined" || typeof amount === "undefined") return;

  const input = amount.toString();

  // If amount is zero, return '0.00'
  if (input === "0") return "0.00";

  const integerPart =
    input.length > decimals ? input.slice(0, input.length - decimals) : "";
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  const decimalPart =
    decimals !== 0
      ? input
          .slice(-decimals)
          .padStart(decimals, "0") // Add prefix zeros
          .replace(/0+$/, "") // Remove trailing zeros
      : "";

  // Ensure that the decimal part has at most two decimal places
  const roundedDecimalPart =
    decimals !== 0 ? `.${decimalPart.slice(0, 2).padEnd(2, "0")}` : ".00";

  // Ensure that the integer part is rounded to two decimal places
  const roundedIntegerPart =
    formattedIntegerPart.length > 0 ? formattedIntegerPart : "0";

  return `${roundedIntegerPart}${roundedDecimalPart}`;
};

export const getMintMinAmountAsDecimal = (mint: Mint) => {
  return 1 * 10 ** -mint.decimals;
};

export const getPositionVoteMultiplier = (position: PositionWithMeta) => {
  const { lockup } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const currentTs = new BN(Date.now() / 1000);
  const isConstant = lockupKind === "constant";
  const isDecayed = !isConstant && lockup.endTs.lte(currentTs);

  if (isDecayed) {
    return "0";
  }

  return (
    (position.votingPower.isZero()
      ? 0
      : // Mul by 100 to get 2 decimal places
        position.votingPower
          .mul(new BN(100))
          .div(position.amountDepositedNative)
          .toNumber() / 100) /
    (position.genesisEnd.gt(currentTs)
      ? position.votingMint.genesisVotePowerMultiplier
      : 1)
  ).toFixed(2);
};

export const precision = (a: number) => {
  if (!Number.isFinite(a)) return 0;
  let e = 1;
  let p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    // eslint-disable-next-line no-plusplus
    p++;
  }
  return p;
};

export const onInstructions =
  (
    provider?: AnchorProvider,
    {
      useFirstEstimateForAll = false,
    }: { useFirstEstimateForAll?: boolean } = {}
  ) =>
  async (instructions: TransactionInstruction[], sigs?: Keypair[]) => {
    if (provider) {
      const computeScaleUp = 1.4;

      if (sigs) {
        const transactions = await batchInstructionsToTxsWithPriorityFee(
          provider,
          instructions,
          {
            basePriorityFee: 2,
            extraSigners: sigs,
            addressLookupTableAddresses: [
              provider.connection.rpcEndpoint.includes("test")
                ? HELIUM_COMMON_LUT_DEVNET
                : HELIUM_COMMON_LUT,
            ],
            useFirstEstimateForAll,
            computeScaleUp,
          }
        );
        const asVersionedTx = transactions.map(toVersionedTx);
        let i = 0;
        for (const tx of await provider.wallet.signAllTransactions(
          asVersionedTx
        )) {
          const draft = transactions[i];
          sigs.forEach((sig) => {
            if (draft.signers?.some((s) => s.publicKey.equals(sig.publicKey))) {
              tx.sign([sig]);
            }
          });

          await sendAndConfirmWithRetry(
            provider.connection,
            Buffer.from(tx.serialize()),
            {
              skipPreflight: true,
            },
            "confirmed"
          );
          i++;
        }
      } else {
        const transactions = await batchInstructionsToTxsWithPriorityFee(
          provider,
          instructions,
          {
            basePriorityFee: 2,
            addressLookupTableAddresses: [
              provider.connection.rpcEndpoint.includes("test")
                ? HELIUM_COMMON_LUT_DEVNET
                : HELIUM_COMMON_LUT,
            ],
            useFirstEstimateForAll,
            computeScaleUp,
          }
        );

        await bulkSendTransactions(
          provider,
          transactions,
          undefined,
          5,
          sigs,
          MAX_TRANSACTIONS_PER_SIGNATURE_BATCH
        );
      }
    }
  };

export const abbreviateNumber = (number: number) => {
  let newNumber = number;
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  while (newNumber >= 1000) {
    newNumber /= 1000;
    suffixNum++;
  }

  return newNumber.toPrecision(3) + suffixes[suffixNum];
};

export const getProposalContent = async (proposalKey: PublicKey) => {
  const provider = new AnchorProvider(
    new Connection(
      process.env.NEXT_PUBLIC_SOLANA_URL ||
        clusterApiUrl(WalletAdapterNetwork.Mainnet),
      "confirmed"
    ),
    {} as any,
    {}
  );

  const proposalSdk = await initProp(provider);
  const proposal = await proposalSdk.account.proposalV0.fetch(
    new PublicKey(proposalKey)
  );

  const res = await fetch(proposal.uri, { next: { revalidate: 60 * 60 * 24 } });
  const content = await res.text();
  return { content, name: proposal.name };
};

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number
) {
  let timer: any;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

export const EPOCH_LENGTH = 60 * 60 * 24;
