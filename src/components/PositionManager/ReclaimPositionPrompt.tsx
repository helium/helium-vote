"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";
import { FaBolt } from "react-icons/fa6";
import { Button } from "../ui/button";

export const ReclaimPositionPrompt: FC<{
  position: PositionWithMeta;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (position: PositionWithMeta) => Promise<void>;
}> = ({ position, isSubmitting, onCancel, onConfirm }) => {
  const { network } = useGovernance();

  const handleSubmit = async () => {
    await onConfirm(position);
  };

  const upperNetwork = network.toUpperCase();
  return (
    <div className="flex flex-col gap-4 h-full p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto md:justify-center">
      <div className="hidden max-md:flex flex-row w-full justify-end">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-row justify-center">
        <div className="relative size-52">
          <Image
            alt={`illustration-%{network}`}
            src={`/images/illustration-${network}.png`}
            fill
          />
        </div>
      </div>
      <h5 className="text-center">Congratulations!</h5>
      <p className="text-center text-muted-foreground max-md:text-sm">
        a Your position has decayed now, so you can reclaim your position. This
        would mean converting your ve{upperNetwork} back into the original{" "}
        {upperNetwork} amount that you locked as well as claiming all accrued
        rewards that were unclaimed
      </p>
      <div className="flex flex-col max-md:flex-grow justify-end">
        <div className="flex flex-row justify-between items-center gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2 text-foreground"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            {!isSubmitting && <FaBolt className="size-4" />}
            {isSubmitting ? "Reclaiming Position..." : "Reclaim Position"}
          </Button>
        </div>
      </div>
    </div>
  );
};
