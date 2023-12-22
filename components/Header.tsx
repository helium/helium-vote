import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { PublicKey } from "@solana/web3.js";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { useNetwork } from "../hooks/useNetwork";

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

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { network } = useNetwork()

  return (
    <nav className="dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href={`/${network}`} className="flex items-center">
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
        <WalletMultiButton
          style={{
            backgroundColor: "transparent",
            border: "1px solid rgb(75 85 99)",
            borderRadius: 8,
          }}
        />
      </div>
    </nav>
  );
}
