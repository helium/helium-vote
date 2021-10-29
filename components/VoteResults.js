import classNames from "classnames";
import { getBackgroundColor, getTextColor } from "../utils/colors";

const VoteResults = ({ votingResults, outcomes, completed }) => {
  const { outcomesResults } = votingResults;

  // the array has already been sorted by .hntVoted
  const winner = outcomesResults[0];

  return (
    <div className="pt-0">
      <div className="w-full flex flex-col lg:flex-row justify-between mb-5 sm:mb-10">
        <p className="text-xl sm:text-3xl text-white font-semibold tracking-tighter">
          {completed ? "Final Results" : "Preliminary Results"}
        </p>
        {/* {completed && (
          <p className="text-lg sm:text-3xl text-hv-gray-400 font-semibold tracking-tighter pt-4 lg:pt-0">
            <span className="text-white">{winner.value}</span> wins with{" "}
            {winner.hntPercent.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            % of Vote
          </p>
        )} */}
      </div>
      <div className="flex flex-col space-y-5">
        {outcomesResults.map((r, i) => {
          // find the initial index (the order it was in in the JSON for the vote) to keep the colour scheme consistent
          const initial = outcomes.find((o) => o.address === r.address);
          let outcomeInitialIndex = 2;
          if (initial) {
            outcomeInitialIndex = initial?.index;
          }

          const bg = initial?.color
            ? "custom"
            : getBackgroundColor(outcomeInitialIndex);

          return (
            <div key={r.value} className="w-full flex flex-col relative">
              {completed && i === 0 && (
                <div className="absolute -left-12 hidden xl:flex items-center justify-center h-full">
                  <img className="w-6 h-6 mr-1.5 mb-1" src="/images/star.svg" />
                  <div className="w-1 h-full bg-white" />
                </div>
              )}
              <div className="w-full rounded-xl bg-hv-gray-500 flex flex-row items-start justify-start">
                <div
                  className={classNames("w-1.5 rounded-l-xl h-3", {
                    "bg-hv-green-500": bg === "green",
                    "bg-hv-blue-500": bg === "blue",
                    "bg-hv-purple-500": bg === "purple",
                  })}
                  style={
                    bg === "custom" ? { backgroundColor: initial?.color } : {}
                  }
                />
                <div
                  className={classNames("h-3 rounded-r-xl", {
                    "bg-hv-green-500": bg === "green",
                    "bg-hv-blue-500": bg === "blue",
                    "bg-hv-purple-500": bg === "purple",
                  })}
                  style={
                    bg === "custom"
                      ? {
                          backgroundColor: initial?.color,
                          width: `${r.hntPercent}%`,
                        }
                      : { width: `${r.hntPercent}%` }
                  }
                />
              </div>
              <div className="w-full flex flex-col items-start lg:flex-row lg:items-center justify-between pt-1.5">
                <h3 className="font-sans text-lg text-white font-semibold tracking-tighter">
                  <span className="flex flex-row items-center justify-start space-x-2">
                    <span>{r.value}</span>
                    <span className="flex lg:hidden">
                      (
                      {r.hntPercent.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      %)
                    </span>
                    {completed && i === 0 && (
                      <img
                        className="w-5 h-5 flex xl:hidden mb-1"
                        src="/images/star.svg"
                      />
                    )}
                  </span>
                </h3>
                <div className="space-x-2 flex flex-col lg:flex-row">
                  <div className="text-hv-gray-400 text-lg font-light font-sans flex flex-col lg:flex-row space-x-0 lg:space-x-2">
                    <span>{r.hntVoted.toString(2)}</span>
                    <div className="hidden lg:flex">|</div>
                    <span>{r.uniqueWallets.toLocaleString()} Votes</span>
                  </div>
                  <span className="text-white text-lg font-sans">
                    <span className="text-white hidden lg:flex">
                      {r.hntPercent.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      %
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoteResults;
