import { Balance, CurrencyType } from "@helium/currency";
import classNames from "classnames";
import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";
import CountdownTimer from "../CountdownTimer";
import { getBackgroundColor } from "../../utils/colors";

const fetcher = (url: string): any => fetch(url).then((r) => r.json());

export const LegacyVoteCard = ({ vote }) => {
  const { name, description, id, tags, endTs } = vote;

  const { data: results } = useSWR(`/api/results/${vote?.id}`, fetcher);

  const votingResults = useMemo(() => {
    if (!results) return {};

    const { outcomes } = results;

    const totalUniqueWallets = results?.outcomes?.reduce(
      (acc, { uniqueWallets: votes }) => acc + votes,
      0
    );
    const totalHntVoted = outcomes.reduce(
      (acc, { hntVoted }) => acc + hntVoted,
      0
    );

    const outcomesResults = outcomes
      .map((r) => ({
        ...r,
        hntPercent:
          r.uniqueWallets === 0 ? 0 : (r.hntVoted / totalHntVoted) * 100,
        walletsPercent:
          r.uniqueWallets === 0
            ? 0
            : (r.uniqueWallets / totalUniqueWallets) * 100,
        hntVoted: new Balance(r.hntVoted, CurrencyType.networkToken),
      }))
      .sort((a, b) => b.hntVoted.floatBalance - a.hntVoted.floatBalance);
    return { totalUniqueWallets, totalHntVoted, outcomesResults };
  }, [results]);

  const { outcomes: outcomesInitial } = vote;

  // to give each one an index so the colour code stays consistent, but we can still sort by votes
  const outcomes = outcomesInitial?.map((o, i) => ({ ...o, index: i }));

  return (
    <div className="flex-shrink-1 w-full basis-full mb-2 sm:mb-0 md:basis-6/12 lg:w-4/12 sm:p-5">
      <Link
        href={`/legacy/${id}`}
        className="group h-full w-full flex flex-col transition-all duration-150 outline-none border border-solid border-opacity-0 focus:border-opacity-50 border-hv-green-500 rounded-3xl"
      >
        <span className="py-5 px-5 rounded-t-3xl bg-hv-gray-450 group-hover:bg-hv-gray-400 lg:min-h-[200px] transition-all duration-150">
          {tags && (
            <div className="flex flex-row items-center justify-end">
              {(tags?.primary || tags?.secondary) && (
                <div className="py-0.5 px-2 bg-hv-gray-500 group-hover:bg-hv-gray-550 transition-all duration-150 rounded-lg">
                  <span className="text-xs sm:text-sm text-hv-gray-350 font-light whitespace-nowrap">
                    {tags?.primary
                      ? tags.primary
                      : tags?.secondary && !tags?.primary
                      ? tags.secondary
                      : ""}
                  </span>
                </div>
              )}

              {tags?.tertiary && (
                <div className="py-0.5 px-2 bg-yellow-400 rounded-lg ml-2">
                  <span className="text-xs sm:text-sm text-black font-reg whitespace-nowrap">
                    {tags.tertiary}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-start justify-between">
            <p className="text-white text-xl tracking-tight leading-tight pb-2 pt-4">
              {name}
            </p>
          </div>
          <p className="text-hv-gray-300 h-6 lg:h-14 overflow-hidden text-sm leading-tight">
            {description?.substring(0, 80)}...
          </p>
        </span>
        <div className="rounded-b-3xl bg-hv-gray-500 group-hover:bg-hv-gray-550 transition-all duration-150 p-5">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-hv-gray-200">
                Est. Time Remaining
              </span>
              <span className="text-sm text-white">
                <CountdownTimer endTs={endTs} key={id} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-hv-gray-200 text-right">Votes</span>
              <span className="text-sm text-white text-right">
                {votingResults?.totalUniqueWallets?.toLocaleString()}
              </span>
            </div>
          </div>
          {votingResults && votingResults.totalHntVoted > 0 && (
            <div className="flex flex-row items-center justify-center w-full pt-5 pb-2">
              <div className="rounded-full w-full h-2.5 flex flex-row items-center">
                {votingResults?.outcomesResults?.map(
                  (outcome, i, { length }) => {
                    const initial = outcomes.find(
                      (o) => o.address === outcome.address
                    );
                    let outcomeInitialIndex = 2;
                    if (initial) {
                      outcomeInitialIndex = initial?.index;
                    }

                    const bg = initial?.color
                      ? "custom"
                      : getBackgroundColor(outcomeInitialIndex);

                    const sliceWidthString =
                      i === 0 || i === length - 1
                        ? // for the first and last, make them at least 5px to account for the rounding
                          `calc(${outcome.hntPercent}% + 5px)`
                        : `calc(${outcome.hntPercent}% - 10px)`;

                    return (
                      <div
                        className={classNames("h-2.5", {
                          "rounded-l-full": i === 0,
                          "rounded-r-full": i === length - 1,
                          "bg-hv-green-500": bg === "green",
                          "bg-hv-blue-500": bg === "blue",
                          "bg-hv-purple-500": bg === "purple",
                          "bg-hv-orange-500": bg === "orange",
"bg-hv-turquoise-500": bg === "turquoise",
                        })}
                        style={
                          bg === "custom"
                            ? {
                                backgroundColor: initial?.color,
                                width: sliceWidthString,
                              }
                            : {
                                width: sliceWidthString,
                              }
                        }
                      />
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
