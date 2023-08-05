import BN from "bn.js";
import classNames from "classnames";
import { getBackgroundColor } from "../utils/colors";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import Loading, { LoadingIcon } from "./Loading";

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
  myWeight?: BN;
  canVote: boolean;
  canRelinquishVote: boolean;
  voting: boolean;
  onVote: () => void;
  onRelinquishVote: () => void;
}> = ({
  canVote,
  canRelinquishVote,
  myWeight,
  outcome,
  index,
  length,
  onVote,
  onRelinquishVote,
  voting,
}) => {
  const bg = getBackgroundColor(index);
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() =>
        canVote ? onVote() : canRelinquishVote ? onRelinquishVote() : null
      }
      className={classNames(
        "flex flex-col mb-1 bg-white bg-opacity-5 rounded-none",
        {
          "sm:rounded-t-xl": index === 0,
          "sm:rounded-b-xl": index === length - 1,
          "border-none": hover,
        }
      )}
    >
      <div
        className={classNames(
          "flex w-full p-4 space-y-2 rounded-none flex-col items-start justify-start bg-white bg-opacity-0 transition-all duration-100",
          {
            "sm:hover:bg-opacity-10": canVote || canRelinquishVote,
            "hover:bg-opacity-5": canVote || canRelinquishVote,
            'bg-opacity-10': !!myWeight,
            "cursor-pointer": canVote || canRelinquishVote,
            "sm:rounded-t-xl": index === 0,
            "sm:rounded-b-xl": index === length - 1,
          }
        )}
      >
        <div
          className={classNames(
            "flex flex-col sm:flex-row justify-between items-center w-full"
          )}
        >
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
          {!!myWeight && !voting && (
            <AiOutlineCloseCircle
              className={classNames("text-gray-500 w-6 h-6", {
                "text-red-700": hover,
              })}
            />
          )}
          {voting && <LoadingIcon h={6} w={6} className="text-gray-500" />}
        </div>
      </div>
    </div>
  );
};

export default VoteOption;
