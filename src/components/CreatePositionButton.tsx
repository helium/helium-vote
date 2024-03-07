"use client";

import { FaBolt } from "react-icons/fa6";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { CreatePositionModal } from "./CreatePositionModal";
import { useWallet } from "@solana/wallet-adapter-react";
import classNames from "classnames";

export const CreatePositionButton: FC<{ className?: string }> = ({
  className = "",
}) => {
  const { connected } = useWallet();

  return (
    <CreatePositionModal>
      <Button
        variant="secondary"
        disabled={!connected}
        className={classNames("gap-2 px-4 sm:px-6", className)}
      >
        <FaBolt className="size-4" />
        <span className="max-md:hidden ">Create Position</span>
      </Button>
    </CreatePositionModal>
  );
};
