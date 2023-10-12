import classNames from "classnames";
import { getBackgroundColor } from "../utils/colors";
import { Outcome } from "./VoteOption";
import { humanReadable } from "../utils/formatting";

const VoteResults: React.FC<{
  outcomes: Outcome[];
  completed: boolean;
  decimals?: number;
}> = ({ decimals, outcomes, completed }) => {

  // const winner = outcomesResults[0];

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
      <div className="flex flex-col space-y-10">
        {outcomes.map((r, i) => {
          let index = r.index;

          const bg = getBackgroundColor(index);

          return (
            <div key={r.name} className="w-full flex flex-col relative">
              {completed && r.percent > 66 && (
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
                    "bg-hv-orange-500": bg === "orange",
"bg-hv-turquoise-500": bg === "turquoise",
                  })}
                />
                <div
                  className={classNames("h-3 rounded-r-xl", {
                    "bg-hv-green-500": bg === "green",
                    "bg-hv-blue-500": bg === "blue",
                    "bg-hv-purple-500": bg === "purple",
                    "bg-hv-orange-500": bg === "orange",
"bg-hv-turquoise-500": bg === "turquoise",
                  })}
                  style={{
                    width: `${r.percent}%`,
                  }}
                />
              </div>
              <div className="w-full flex flex-col items-start lg:flex-row lg:items-center justify-between pt-1.5">
                <h3 className="font-sans text-lg text-white font-semibold tracking-tighter">
                  <span className="flex flex-row items-center justify-start space-x-2">
                    <span>{r.name}</span>
                    <span className="flex lg:hidden">
                      (
                      {r.percent.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      %)
                    </span>
                    {completed && r.percent > 66 && (
                      <img
                        className="w-5 h-5 flex xl:hidden mb-1"
                        src="/images/star.svg"
                      />
                    )}
                  </span>
                </h3>
                <div className="space-x-2 flex flex-col lg:flex-row">
                  {decimals && (
                    <div className="text-hv-gray-400 text-lg font-light font-sans flex flex-col lg:flex-row space-x-0 lg:space-x-2">
                      <span>{humanReadable(r.weight, decimals)}</span>
                    </div>
                  )}
                  <span className="text-white text-lg font-sans">
                    <span className="text-white hidden lg:flex">
                      {r.percent.toLocaleString(undefined, {
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
