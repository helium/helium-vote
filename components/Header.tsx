import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { PublicKey } from "@solana/web3.js";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

// add this
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const DAOS = {
  [HNT_MINT.toBase58()]: "Helium",
  [IOT_MINT.toBase58()]: "Helium IOT",
  [MOBILE_MINT.toBase58()]: "Helium Mobile",
};

export function Header({
  votingMint,
  setVotingMint,
}: {
  votingMint: PublicKey;
  setVotingMint: (mint: PublicKey) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <img src="/images/logo.svg" className="h-8 mr-3" alt="Helium Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Helium
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={classNames("w-full md:block md:w-auto", {
            hidden: !isExpanded,
          })}
          id="navbar-default"
        >
          <ul className="items-center font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row space-y-4 md:space-y-0 md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
            <li className="flex flex-row items-center">
              <Link
                href="/staking"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                My Voting Power
              </Link>
            </li>
            <li>
              <div
                tabIndex={0}
                onBlur={(e) => {
                  setDropdownOpen(false);
                }}
              >
                <div
                  data-dropdown-toggle="dropdown"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex flex-row items-center hover:cursor-pointer items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  {DAOS[votingMint.toBase58()]}
                  <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </div>
                <div
                  id="dropdown"
                  className={classNames(
                    "absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700",
                    { hidden: !dropdownOpen }
                  )}
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    {Object.entries(DAOS).map(([mint, name]) => (
                      <li
                        key={mint}
                        className={
                          mint === votingMint.toBase58()
                            ? "bg-gray-100 dark:bg-gray-600"
                            : undefined
                        }
                      >
                        <div
                          onClick={(e) => {
                            setVotingMint(new PublicKey(mint));
                            setDropdownOpen(false);
                          }}
                          className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          {name}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            <li className="flex">
              <WalletMultiButton
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgb(75 85 99)",
                  borderRadius: 8,
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
