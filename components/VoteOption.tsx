import { BN } from "bn.js";
import classNames from "classnames";
import { getBackgroundColor } from "../utils/colors";

export type Outcome = {
  percent: number;
  index: number;
  weight: BN;
  name: string;
};

const VoteOption: React.FC<{
  outcome: Outcome;
  index: number;
  length: number;
}> = ({ outcome, index, length }) => {
  const bg = getBackgroundColor(index);

  return (
    <div
      className={classNames(
        "flex flex-col mb-1 bg-white bg-opacity-5 rounded-none",
        {
          "sm:rounded-t-xl": index === 0,
          "sm:rounded-b-xl": index === length - 1,
        }
      )}
    >
      <div
        className={classNames(
          "flex w-full cursor-pointer sm:hover:bg-opacity-10 p-4 space-y-2 rounded-none flex-col items-start justify-start bg-white bg-opacity-0 hover:bg-opacity-5 transition-all duration-100",
          {
            "sm:rounded-t-xl": index === 0,
            "sm:rounded-b-xl": index === length - 1
          }
        )}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center justify-start">
              <span
                className={classNames("rounded-full w-4 h-4 mr-2 sm:mr-4", {
                  "bg-hv-green-500": bg === "green",
                  "bg-hv-blue-500": bg === "blue",
                  "bg-hv-purple-500": bg === "purple",
                })}
              />
              <p className="text-white text-md font-semibold tracking-tight pr-2 sm:pr-1 sm:text-xl md:text-2xl">
                {outcome.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteOption;
