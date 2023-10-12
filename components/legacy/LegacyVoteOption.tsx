import classNames from "classnames";
import QRCode from "react-qr-code";
import base64 from "base-64";
import { getBackgroundColor, getTextColor } from "../../utils/colors";
import CopyableText from "../CopyableText";
import { useState } from "react";

const WarningBox: React.FC = () => {
  return (
    <div className="bg-hv-red-500 bg-opacity-10 rounded-xl w-full flex flex-col p-5 mt-8">
      <span className="text-red-500 font-semibold text-left text-sm sm:text-base leading-tight">
        Warning!
      </span>
      <span className="text-white text-left opacity-50 font-light text-sm sm:text-base leading-tight">
        If you vote for multiple options, only your most recent vote will be
        counted. Your Vote is weighted by Vote Power (your HNT balance and
        staked HNT balance at the voting deadline). Payment transactions will
        also be counted as votes but is limited to addresses that have not been
        filtered in the vote configuration.
      </span>
    </div>
  );
};

export type Outcome = {
  index: number;
  address: string;
  color: string;
  value: string;
};

const LegacyVoteOption: React.FC<{
  outcome: Outcome;
  expandedId: string;
  handleExpandClick: (address: string | null) => void;
  index: number;
  length: number;
}> = ({ outcome, expandedId, handleExpandClick, index, length }) => {
  const expanded = expandedId === outcome.address;

  const encodedMemo = base64.encode(index);
  const voteData = {
    type: "dc_burn",
    address: outcome.address,
    amount: "0.00000001",
    memo: encodedMemo,
  };

  const cliCommand = `helium-wallet burn --amount 0.00000001 --payee ${outcome.address} --commit`;
  const ledgerCliCommand = `helium-ledger-cli burn --amount 0.00000001 --payee ${outcome.address}`;

  const bg = outcome?.color ? "custom" : getBackgroundColor(index);
  const fg = outcome?.color ? "custom" : getTextColor(index);

  const [tab, setTab] = useState(1);
  const [cliTab, setCliTab] = useState(0);

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
            "sm:rounded-b-xl": index === length - 1 && !expanded,
          }
        )}
        onClick={() => {
          if (expandedId === outcome.address) {
            // if it's open, close it
            handleExpandClick(null);
          } else {
            handleExpandClick(outcome.address);
          }
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center justify-start">
              <span
                className={classNames("rounded-full w-4 h-4 mr-2 sm:mr-4", {
                  "bg-hv-green-500": bg === "green",
                  "bg-hv-blue-500": bg === "blue",
                  "bg-hv-purple-500": bg === "purple",
                  "bg-hv-orange-500": bg === "orange",
"bg-hv-turquoise-500": bg === "turquoise",
                })}
                style={
                  bg === "custom" ? { backgroundColor: outcome.color } : {}
                }
              />
              <p className="text-white text-md font-semibold tracking-tight pr-2 sm:pr-1 sm:text-xl md:text-2xl">
                {outcome.value}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between px-3 py-2 outline-none border border-solid border-transparent focus:border-hv-green-500 transition-all duration-100 rounded-lg w-min">
              <span className="hidden sm:block text-xs sm:text-sm text-hv-gray-300 whitespace-nowrap pr-2">
                {expanded ? "Hide" : "Show"} Voting Instructions
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={classNames(
                  "h-5 sm:h-3 w-5 sm:w-3 text-hv-gray-300 transition-all duration-100",
                  {
                    "rotate-180": expanded,
                  }
                )}
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
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="flex flex-col items-start justify-start w-full mt-2 p-4">
          <div className="sm:hidden space-x-2 pb-4 w-full mx-auto flex flex-row items-center justify-center">
            <span
              className={classNames("cursor-pointer", {
                "text-white": tab === 0,
                "text-hv-gray-350": tab !== 0,
              })}
              onClick={() => {
                setTab(0);
              }}
            >
              Desktop
            </span>
            <span
              className={classNames("cursor-pointer", {
                "text-white": tab === 1,
                "text-hv-gray-350": tab !== 1,
              })}
              onClick={() => {
                setTab(1);
              }}
            >
              Mobile
            </span>
          </div>
          {tab === 1 && (
            <span className="w-full flex sm:hidden flex-col items-center justify-center text-center">
              <div className="max-w-xs px-14">
                <a
                  className={`bg-hv-${bg}-500 px-4 py-3 rounded-lg flex flex-row items-center justify-center w-full mb-4`}
                  style={
                    bg === "custom" ? { backgroundColor: outcome.color } : {}
                  }
                  href={`heliumwallet://dc_burn?address=${outcome.address}&amount=0.00000001&memo=${encodedMemo}`}
                >
                  <span
                    className={classNames("pr-1 font-sans", {
                      "text-black": fg === "custom" || fg === "white",
                      "text-white": fg === "white",
                    })}
                  >
                    Submit Vote in App
                  </span>
                </a>
                <p className="text-white text-md sm:text-lg">
                  Vote with Mobile App
                </p>
                <p className="text-hv-gray-300 font-light leading-tight text-md sm:text-lg">
                  Ensure you have Helium Wallet App installed
                </p>
              </div>
              {/* <WarningBox /> */}
            </span>
          )}
          <div
            className={classNames(
              "space-y-10 sm:space-y-4 sm:flex flex-col md:flex-row items-center justify-start w-full h-full py-10",
              { "hidden sm:flex": tab === 1 }
            )}
          >
            <span className="w-full flex flex-col items-center justify-center text-center">
              <div className="flex justify-center items-center p-4 rounded-lg bg-white">
                <QRCode value={JSON.stringify(voteData)} size={140} />
              </div>
              <div className="pt-5 max-w-xs px-14">
                <p className="text-white text-md sm:text-lg">
                  Vote with QR Code
                </p>
                <p className="text-hv-gray-300 font-light leading-tight text-md sm:text-lg">
                  Scan this QR code with your Helium Wallet app
                </p>
              </div>
            </span>
            <div className="hidden md:flex bg-hv-gray-400 sm:h-60 sm:w-0.5 mx-5 h-px w-full" />
            <span className="flex flex-col items-center space-y-2 w-full">
              <div className="space-x-5 pb-4 w-full mx-auto flex flex-row items-center justify-center">
                <span
                  className={classNames("cursor-pointer", {
                    "text-white": cliTab === 0,
                    "text-hv-gray-350": cliTab !== 0,
                  })}
                  onClick={() => {
                    setCliTab(0);
                  }}
                >
                  CLI
                </span>
                <span
                  className={classNames("cursor-pointer", {
                    "text-white": cliTab === 1,
                    "text-hv-gray-350": cliTab !== 1,
                  })}
                  onClick={() => {
                    setCliTab(1);
                  }}
                >
                  Ledger App
                </span>
              </div>
              <div className="bg-hv-gray-775 rounded-lg flex flex-col items-start justify-start relative pb-4">
                <div className="p-4">
                  <p className="w-72 text-hv-green-500 font-mono text-sm break-all">
                    {cliTab === 0 ? cliCommand : ledgerCliCommand}
                  </p>
                </div>
                <button className="absolute right-3 bottom-3 rounded-lg bg-hv-gray-1000 bg-opacity-50 hover:bg-opacity-25 transition-all duration-100 p-2 w-8 h-8 flex flex-row items-center justify-center">
                  <span className="text-sm flex items-center justify-center text-white font-sans font-light">
                    <CopyableText
                      textToCopy={cliTab === 0 ? cliCommand : ledgerCliCommand}
                      iconClasses="w-4 h-4"
                    ></CopyableText>
                  </span>
                </button>
              </div>
              <div className="pt-5 max-w-xs px-14 text-center">
                <p className="text-white text-md sm:text-lg">Vote with CLI</p>
                <p className="text-hv-gray-300 font-light leading-tight text-md sm:text-lg">
                  Execute the following command with the CLI
                </p>
              </div>
            </span>
          </div>
          <WarningBox />
        </div>
      )}
    </div>
  );
};

export default LegacyVoteOption;
