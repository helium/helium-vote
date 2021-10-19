import React from "react";
import classNames from "classnames";

const VoteResultsColumn = ({
  children,
  isFirstColumn,
  isLastColumn,
  isHeaderColumn,
  isInLastRow,
  className,
}) => {
  const baseTextClasses = "text-white text-xs sm:text-lg text-md";
  const baseLayoutClasses = "px-2.5 py-2 sm:px-4 sm:py-2.5";
  const baseBorderClasses =
    "border sm:border-4 border-solid border-opacity-5 border-white";

  const baseClasses = [
    baseTextClasses,
    baseLayoutClasses,
    baseBorderClasses,
  ].join(" ");

  const firstColumnWidth = "col-span-2 sm:col-span-1";

  const noLeftBorder = "border-l-0 sm:border-l-0";
  const noTopBorder = "border-t-0 sm:border-t-0";

  const headerClasses = "font-bold bg-gray-600 bg-opacity-10";
  const bodyClasses = "bg-white bg-opacity-5 break-words";

  const topleft = "rounded-tl-xl";
  const topRight = "rounded-tr-xl";
  const bottomLeft = "rounded-bl-xl";
  const bottomRight = "rounded-br-xl";

  return (
    <div
      className={classNames(className, baseClasses, {
        [headerClasses]: isHeaderColumn,
        [bodyClasses]: !isHeaderColumn,
        [noLeftBorder]: !isFirstColumn,
        [noTopBorder]: !isHeaderColumn,
        [topleft]: isFirstColumn && isHeaderColumn,
        [topRight]: isLastColumn && isHeaderColumn,
        [bottomLeft]: isFirstColumn && isInLastRow,
        [bottomRight]: isLastColumn && isInLastRow,
        [firstColumnWidth]: isFirstColumn,
      })}
    >
      {children}
    </div>
  );
};

const VoteResultsTable = ({ votingResults }) => {
  const { outcomesResults } = votingResults;
  return (
    <div className="grid grid-cols-4 sm:grid-cols-3">
      <VoteResultsColumn isHeaderColumn isFirstColumn>
        Vote Option
      </VoteResultsColumn>
      <VoteResultsColumn className="text-right" isHeaderColumn>
        Total Voting Power
      </VoteResultsColumn>
      <VoteResultsColumn className="text-right" isHeaderColumn isLastColumn>
        Unique Voting Wallets
      </VoteResultsColumn>

      {outcomesResults.map((r, i, { length }) => {
        return (
          <React.Fragment key={r.value}>
            <VoteResultsColumn isFirstColumn isInLastRow={i === length - 1}>
              {r.value}
            </VoteResultsColumn>
            <VoteResultsColumn className="text-right">
              {r.hntVoted.toString(2)}{" "}
              <span className="text-hv-gray-400 text-sm">
                (
                {r.hntPercent.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                %)
              </span>
            </VoteResultsColumn>
            <VoteResultsColumn
              className="text-right"
              isLastColumn
              isInLastRow={i === length - 1}
            >
              {r.uniqueWallets}{" "}
              <span className="text-hv-gray-400 text-sm">
                (
                {r.walletsPercent.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                %)
              </span>
            </VoteResultsColumn>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default VoteResultsTable;
