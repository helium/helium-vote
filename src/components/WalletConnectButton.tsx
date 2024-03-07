"use client";

import { Button } from "./ui/button";
import React, { FC } from "react";
import classNames from "classnames";
import { useWallet } from "@solana/wallet-adapter-react";
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
    <Button
      variant="secondary"
      className={classNames(
        "pr-6",
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
    </Button>
  );
};
