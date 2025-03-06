"use client";

import { Button } from "./ui/button";
import React, { FC } from "react";
import classNames from "classnames";
import { useWallet } from "@/hooks/useWallet";
import { FaWallet } from "react-icons/fa6";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletConnectButton: FC<{
  shrink?: boolean;
  className?: string;
}> = ({ shrink = false, className = "" }) => {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (!connected && !connecting) {
    return (
      <Button
        variant="secondary"
        onClick={() => setVisible(true)}
        className={className}
      >
        <FaWallet
          className={classNames("hidden size-4", shrink && "max-md:flex")}
        />
        <span className={classNames(shrink && "max-md:hidden")}>
          Select Wallet
        </span>
      </Button>
    );
  }

  return (
    <div
      className={classNames(
        "h-11 px-4 md:px-6 py-2",
        "pr-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        shrink && "max-md:text-[0px] max-md:pr-1",
        className
      )}
    >
      <WalletMultiButton
        style={{
          margin: 0,
          padding: 0,
          borderRadius: 0,
          backgroundColor: "transparent",
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit",
          lineHeight: "inherit",
        }}
      />
    </div>
  );
};
