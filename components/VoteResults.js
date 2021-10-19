import React from "react";
import classNames from "classnames";

const VoteResults = ({ votingResults, completed }) => {
  const { outcomesResults } = votingResults;

  return (
    <div className="pt-0">
      <div className="w-full">
        <p className="text-3xl text-white font-semibold tracking-tighter">
          {completed ? "Final Results" : "Preliminary Results"}
        </p>
      </div>
      {outcomesResults.map((r, i, { length }) => {
        return (
          <React.Fragment key={r.value}>
            <span className="text-md text-hv-gray-500">
              {r.value}
              {r.hntVoted.toString(2)}{" "}
              <span className="text-hv-gray-400 text-sm">
                (
                {r.hntPercent.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                %)
              </span>
            </span>
            <span className="text-md text-hv-gray-500">
              {r.uniqueWallets}{" "}
              <span className="text-hv-gray-400 text-sm">
                (
                {r.walletsPercent.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                %)
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default VoteResults;
