import classNames from "classnames";
import QRCode from "react-qr-code";
import base64 from "base-64";

const VoteOption = ({ outcome, expandedId, handleExpandClick, index }) => {
  const expanded = expandedId === outcome.address;

  const encodedMemo = base64.encode(index);
  const voteData = {
    type: "dc_burn",
    address: outcome.address,
    amount: "0.00000001",
    memo: encodedMemo,
  };

  return (
    <div className="flex w-full bg-white bg-opacity-5 rounded-xl p-4 space-y-2 flex-col items-start justify-start">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full">
        <p className="text-white text-md pr-2 sm:pr-1 sm:text-3xl">
          {outcome.value}
        </p>
        <button
          className="flex mt-2 sm:mt-0 flex-row items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 outline-none border border-solid border-transparent focus:border-hv-blue-500 transition-all duration-100 rounded-lg w-min"
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
          <div className="hidden sm:block">
            <p className="text-gray-400 text-sm pb-4 max-w-xl">
              To vote for this option, scan the QR code below to burn HNT to the
              address associated with this option.
            </p>
            <p className="text-gray-400 text-sm pb-4 max-w-xl">
              Your Vote Power is your HNT balance and staked HNT balance at the block deadline. The Wallet address used in the transaction determines Vote Power. 
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
          </div>
          <div className="flex flex-col sm:hidden">
            <p className="text-gray-400 text-sm pb-2 max-w-xl">
              To vote for this option, burn HNT to the address associated with
              this option before the voting deadline.
            </p>
            <p className="text-gray-400 text-sm pb-2 max-w-xl">
            Your Vote Power is your HNT balance and staked HNT balance at the block deadline. The Wallet address used in the transaction determines Vote Power. 
            </p>
            <p className="text-gray-400 text-sm pb-4 max-w-xl">
              To submit the transaction:
            </p>
            <p className="text-gray-100 text-sm pb-4 max-w-xl">
              1. Open the Helium app and open the QR Scanner.
            </p>
            <p className="text-gray-100 text-sm pb-4 max-w-xl">
              2. Come back to this page and click the button below:
            </p>
            <a
              className="px-2 py-1 bg-red-500 border rounded-lg border-solid border-red-400 flex flex-row items-center justify-center"
              href={`helium://dc_burn?address=${outcome.address}&amount=0.00000001&memo=${encodedMemo}`}
            >
              <span className="pr-1 text-white">Initiate transaction</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default VoteOption;
