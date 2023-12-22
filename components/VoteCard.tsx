import BN from "bn.js";
import classNames from "classnames";
import Link from "next/link";
import CountdownTimer from "../components/CountdownTimer";
import { getBackgroundColor } from "../utils/colors";
import { truncatedHumanReadable } from "../utils/formatting";

export const VoteCard = ({
  id,
  href,
  name,
  endTs,
  results,
  totalVotes,
  decimals,
  tags
}: {
  id: string
  href: string
  name: string
  endTs?: number
  results: { index: number; percent: number; }[]
  totalVotes?: BN
  decimals?: number
  tags: string[]
}) => {
  return (
    <Link href={href} className="w-full flex flex-row cursor-pointer">
      <div className="flex flex-col items-stretch md:flex-row p-4 grow bg-gray-600 hover:bg-gray-500 rounded-lg justify-start md:items-center gap-4 inline-flex">
        <div className="md:w-1/2 flex-col justify-center items-start inline-flex">
          <div className="text-white text-xl font-bold leading-7">{name}</div>
          <div className="flex-row justify-start pr-16 items-start gap-1 inline-flex">
            {tags.map((tag) => (
              <div
                key={tag}
                className="px-2 py-1 bg-gray-400 rounded-lg flex-col justify-center items-start gap-2.5 flex"
              >
                <div className="text-center text-gray-50 text-xs font-medium leading-none">
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-full flex-col grow justify-between md:items-end inline-flex">
          <div className="text-white text-base font-normal leading-normal">
            <CountdownTimer endTs={endTs} key={id} />
          </div>
          <div className="mt-2 md:mt-0 flex flex-row items-center justify-center w-full pb-1">
            {!results ? (
              <div className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-400 rounded-lg animate-pulse" />
            ) : (
              results.map((outcome, i, { length }) => {
                const bg = getBackgroundColor(outcome.index);

                const sliceWidthString =
                  i === 0 || i === length - 1
                    ? // for the first and last, make them at least 5px to account for the rounding
                      `calc(${outcome.percent}% + 5px)`
                    : `calc(${outcome.percent}% - 10px)`;

                return (
                  <div
                    className={classNames("h-4", {
                      "rounded-l-full": i === 0,
                      "rounded-r-full": i === length - 1,
                      "bg-hv-green-500": bg === "green",
                      "bg-hv-blue-500": bg === "blue",
                      "bg-hv-purple-500": bg === "purple",
                      "bg-hv-orange-500": bg === "orange",
                      "bg-hv-turquoise-500": bg === "turquoise",
                    })}
                    style={{
                      width: sliceWidthString,
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="h-full flex-col justify-between items-start inline-flex">
          <div className="text-gray-50 text-base font-normal leading-normal">
            Votes
          </div>
          <div className="text-white text-base font-normal leading-normal">
            {decimals ? truncatedHumanReadable(totalVotes, decimals, 2) : "..."}
          </div>
        </div>
      </div>
    </Link>
  );
};
