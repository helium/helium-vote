import classNames from "classnames";
import { getBackgroundColor } from "../utils/colors";
import { Outcome } from "./VoteOption";
import { humanReadable } from "../utils/formatting";

const VoteResults: React.FC<{
  outcomes: Outcome[];
  completed: boolean;
  decimals?: number;
}> = ({ decimals, outcomes, completed }) => {
  return (
    <div className="pt-0">
      <div className="flex flex-col space-y-4">
        {outcomes.sort((a, b) => b.percent - a.percent).map((r, i) => {
          let index = r.index;

          const bg = getBackgroundColor(index);

          return (
            <div key={r.name} className="w-full flex flex-col relative">
              <div className="w-full rounded-xl bg-gray-600 flex flex-row items-start justify-start">
                <div
                  className={classNames("h-6 rounded-xl", {
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
                <span className="flex flex-row items-center justify-start space-x-2">
                  <span className="text-white text-base font-bold">
                    {r.name}
                  </span>
                  <span className="flex text-white text-base font-bold">
                    (
                    {r.percent.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                    %)
                  </span>
                </span>
                <div className="space-x-2 flex flex-col items-center lg:flex-row">
                  {decimals && (
                    <div className="text-gray-400 text-base font-normal flex flex-col lg:flex-row space-x-0 lg:space-x-2">
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
