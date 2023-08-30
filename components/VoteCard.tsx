import { IdlAccounts } from "@coral-xyz/anchor/dist/cjs/program/namespace/types";
import { useProposalConfig, useResolutionSettings } from "@helium/modular-governance-hooks";
import { Proposal } from "@helium/modular-governance-idls/lib/types/proposal";
import { PublicKey } from "@solana/web3.js";
import classNames from "classnames";
import Link from "next/link";
import { useMemo } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { getBackgroundColor } from "../utils/colors";
import BN from 'bn.js'
import { useNetwork } from "../hooks/useNetwork";

const fetcher = (url: string): any => fetch(url).then((r) => r.json());

export const VoteCard = ({
  proposal,
  proposalKey,
}: {
  proposal: IdlAccounts<Proposal>["proposalV0"];
  proposalKey: PublicKey;
}) => {
  const tags = proposal.tags;
  const id = proposalKey;
  const { name, proposalConfig: proposalConfigKey } = proposal;
  const { info: proposalConfig } = useProposalConfig(proposalConfigKey);
  const { info: resolution } = useResolutionSettings(proposalConfig?.stateController);
  const { network } = useNetwork();

  const endTs =
    resolution &&
    proposal?.state.voting.startTs.add(
      resolution.settings.nodes.find(
        (node) => typeof node.offsetFromStartTs !== "undefined"
      ).offsetFromStartTs.offset
    );

  const votingResults = useMemo(() => {
    const totalVotes: BN = proposal?.choices.reduce(
      (acc, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );

    const results = proposal?.choices
      .map((r, index) => ({
        ...r,
        index,
        percent: totalVotes?.isZero() ? (100 / proposal?.choices.length) : (r.weight.toNumber() / totalVotes.toNumber()) * 100,
      }))
      .sort((a, b) => b.percent - a.percent);
    return { results, totalVotes };
  }, [proposal?.choices]);

  return (
    <div className="flex-shrink-1 w-full basis-full mb-2 sm:mb-0 md:basis-6/12 lg:w-4/12 sm:p-5">
      <Link
        href={`/${id.toBase58()}?network=${network}`}
        className="group h-full w-full flex flex-col transition-all duration-150 outline-none border border-solid border-opacity-0 focus:border-opacity-50 border-hv-green-500 rounded-3xl"
      >
        <span className="py-5 px-5 rounded-t-3xl bg-hv-gray-450 group-hover:bg-hv-gray-400 lg:min-h-[200px] transition-all duration-150">
          {tags && (
            <div className="flex flex-row items-center justify-end">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="py-0.5 px-2 mx-1 bg-hv-gray-500 group-hover:bg-hv-gray-550 transition-all duration-150 rounded-lg"
                >
                  <span className="text-xs sm:text-sm text-hv-gray-350 font-light whitespace-nowrap">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-start justify-between">
            <p className="text-white text-xl tracking-tight leading-tight pb-2 pt-4">
              {name}
            </p>
          </div>
        </span>
        <div className="rounded-b-3xl bg-hv-gray-500 group-hover:bg-hv-gray-550 transition-all duration-150 p-5">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-hv-gray-200">
                Est. Time Remaining
              </span>
              <span className="text-sm text-white">
                <CountdownTimer endTs={endTs?.toNumber()} key={id.toBase58()} />
              </span>
            </div>
          </div>
          {votingResults && (
            <div className="flex flex-row items-center justify-center w-full pt-5 pb-2">
              <div className="rounded-full w-full h-2.5 flex flex-row items-center">
                {votingResults?.results?.map((outcome, i, { length }) => {
                  const bg = getBackgroundColor(outcome.index);

                  const sliceWidthString =
                    i === 0 || i === length - 1
                      ? // for the first and last, make them at least 5px to account for the rounding
                        `calc(${outcome.percent}% + 5px)`
                      : `calc(${outcome.percent}% - 10px)`;

                  return (
                    <div
                      className={classNames("h-2.5", {
                        "rounded-l-full": i === 0,
                        "rounded-r-full": i === length - 1,
                        "bg-hv-green-500": bg === "green",
                        "bg-hv-blue-500": bg === "blue",
                        "bg-hv-purple-500": bg === "purple",
                        "bg-hv-orange-500": bg === "orange",
                      })}
                      style={{
                        width: sliceWidthString,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
