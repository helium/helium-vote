import classNames from "classnames";
import QRCode from "react-qr-code";
import base64 from "base-64";
import { getBackgroundColor, getTextColor } from "../utils/colors";
import CopyableText from "./CopyableText";

const VoteOption = ({
  outcome,
  expandedId,
  handleExpandClick,
  index,
  length,
}) => {
  const expanded = expandedId === outcome.address;

  const encodedMemo = base64.encode(index);
  const voteData = {
    type: "dc_burn",
    address: outcome.address,
    amount: "0.00000001",
    memo: encodedMemo,
  };

  const cliCommand = `helium-wallet burn --amount 0.00000001 --payee ${outcome.address} --commit`;

  const bg = getBackgroundColor(index);
  const fg = getTextColor(index);

  return (
    <>
      <div
        className={classNames(
          "flex w-full bg-white bg-opacity-5 sm:cursor-pointer sm:hover:bg-opacity-10 p-4 space-y-2 flex-col items-start justify-start",
          {
            // I'm sorry to anyone who has to look at this nightmare of rounded corner and margin logic
            // because "expanded" has no sense of breakpoints, these inscrutable cases below account for whether the card is expanded or not, for mobile & desktop
            "rounded-t-xl": index === 0,
            "rounded-b-xl": index === length - 1 && !expanded,
            "rounded-b-xl sm:rounded-b-none": index === length - 1 && expanded,
            "mb-2": index !== length - 1 && !expanded,
            "mb-2 sm:mb-0": index !== length - 1 && expanded,
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
          <div className="flex flex-row items-center justify-start">
            <span
              className={classNames("rounded-full w-4 h-4 mr-2 sm:mr-4", {
                "bg-hv-green-500": bg === "green",
                "bg-hv-blue-500": bg === "blue",
                "bg-hv-purple-500": bg === "purple",
              })}
            />
            <p className="text-white text-md pr-2 sm:pr-1 sm:text-xl md:text-3xl">
              {outcome.value}
            </p>
          </div>
          <div className="hidden sm:flex flex-row items-center justify-between px-3 py-2 outline-none border border-solid border-transparent focus:border-hv-green-500 transition-all duration-100 rounded-lg w-min">
            <span className="text-xs sm:text-sm text-hv-gray-300 whitespace-nowrap pr-2">
              {expanded ? "Hide" : "Show"} Voting Instructions
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={classNames("h-3 w-3 text-hv-gray-300", {
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
          </div>
          <div className="flex sm:hidden flex-col items-start justify-start w-full mt-2">
            <a
              className={classNames(
                "px-3 py-2 rounded-lg flex flex-row items-center justify-center w-full",
                {
                  "bg-hv-green-500": bg === "green",
                  "bg-hv-blue-500": bg === "blue",
                  "bg-hv-purple-500": bg === "purple",
                }
              )}
              href={`helium://dc_burn?address=${outcome.address}&amount=0.00000001&memo=${encodedMemo}`}
            >
              <span
                className={classNames("pr-1 font-sans", {
                  "text-white": fg === "white",
                  "text-black": fg === "black",
                })}
              >
                Vote with Helium app
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={classNames("ml-1 h-5 w-5", {
                  "text-white": fg === "white",
                  "text-black": fg === "black",
                })}
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
        </div>
      </div>
      {expanded && (
        <div
          className={classNames(
            "hidden sm:block w-full bg-white bg-opacity-5 p-4",
            {
              "rounded-b-xl": index === length - 1,
              "mb-2": index !== length - 1,
            }
          )}
        >
          <div className="space-y-4 flex flex-col md:flex-row items-center justify-start w-full h-full py-10">
            <span className="w-full flex flex-col items-center justify-center text-center">
              <div className="flex justify-center items-center p-4 rounded-lg bg-white">
                <QRCode value={JSON.stringify(voteData)} size={140} />
              </div>
              <div className="pt-5 max-w-xs px-14">
                <p className="text-white text-lg">Vote with QR Code</p>
                <p className="text-hv-gray-300 font-light leading-tight text-lg">
                  Scan this QR code with your Helium app
                </p>
              </div>
            </span>
            <div className="hidden md:flex bg-hv-gray-400 h-60 w-0.5 mx-5" />
            <span className="flex flex-col items-center space-y-2 w-full">
              <div className="bg-hv-gray-775 rounded-lg flex flex-col items-start justify-start relative">
                <div className="p-4">
                  <p className="w-72 text-hv-green-500 font-mono text-sm break-all">
                    {cliCommand}
                  </p>
                </div>
                <button className="rounded-b-lg bg-hv-gray-450 p-2 w-full flex flex-row items-center justify-center">
                  <span className="text-sm text-white font-sans font-light">
                    <CopyableText textToCopy={cliCommand} iconClasses="w-4 h-4">
                      Copy command to clipboard
                    </CopyableText>
                  </span>
                </button>
              </div>
              <div className="pt-5 max-w-xs px-14 text-center">
                <p className="text-white text-lg">Vote with CLI</p>
                <p className="text-hv-gray-300 font-light leading-tight text-lg">
                  Execute the following command with the CLI
                </p>
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default VoteOption;
