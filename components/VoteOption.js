import classNames from "classnames";
import QRCode from "react-qr-code";

const VoteOption = ({ outcome, expandedId, handleExpandClick }) => {
  const expanded = expandedId === outcome.address;

  const voteData = {
    type: "dc_burn",
    address: outcome.address,
    amount: "0.00000001",
  };

  return (
    <div className="w-full bg-white bg-opacity-5 rounded-xl p-4 flex space-y-2 flex-col items-start justify-start">
      <div className="flex justify-between items-center w-full">
        <p className="text-white text-md pr-2 sm:pr-1 sm:text-3xl">
          {outcome.value}
        </p>
        <button
          className="flex flex-row items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 outline-none border border-solid border-transparent focus:border-hv-blue-500 transition-all duration-100 rounded-lg w-min"
          onClick={() => {
            if (expandedId === outcome.address) {
              // if it's open, close it
              handleExpandClick(null);
            } else {
              handleExpandClick(outcome.address);
            }
          }}
        >
          <span className="text-xs sm:text-sm text-hv-blue-500 whitespace-nowrap pr-2">
            {expanded ? "Hide" : "Show"} voting instructions
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classNames("h-3 w-3 text-hv-blue-500", {
              "rotate-180": expanded,
            })}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {expanded && (
        <>
          <p className="text-gray-400 text-sm pb-4 max-w-xl">
            To vote for this option, scan the QR code below to burn HNT to the
            address associated with this option.
          </p>
          <p className="text-gray-400 text-sm pb-4 max-w-xl">
            By submitting this transaction before the voting deadline, the
            wallet balance of the sender address (including staked HNT) will be
            added to the votes (1 HNT = 1 Vote).
          </p>
          <div className="space-y-4 flex flex-col items-center justify-start w-full">
            <span className="flex flex-col items-center space-y-2">
              <p className="text-gray-300 text-sm">
                Scan this QR code with the Helium app:
              </p>
              <div className="flex justify-center items-center p-4 rounded-lg bg-white">
                <QRCode value={JSON.stringify(voteData)} size={175} />
              </div>
            </span>
            <span className="text-lg text-gray-500">OR</span>
            <span className="flex flex-col items-center space-y-2 w-full">
              <p className="text-gray-300 text-sm">
                Execute the following command with the CLI:
              </p>
              <div className="bg-hv-gray-900 rounded-lg p-2 flex flex-col items-start justify-start">
                <p className="text-hv-blue-500 font-mono text-sm break-all">{`helium-wallet burn --0.00000001 --payee ${outcome.address} --commit`}</p>
              </div>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default VoteOption;
