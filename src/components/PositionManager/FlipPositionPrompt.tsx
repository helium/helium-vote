"use client";

import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import React, { FC } from "react";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import { PositionCard } from "../PositionCard";

export const FlipPositionPrompt: FC<{
  position: PositionWithMeta;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}> = ({ position, isSubmitting, onCancel, onConfirm }) => {
  const { lockup, hasRewards, isDelegated } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";

  const handleSubmit = async () => {
    await onConfirm();
  };

  return (
    <div className="flex flex-col h-full justify-center max-md:justify-normal p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col justify-center items-stretch">
        <div className="flex flex-col h-full justify-center gap-4 max-w-xl mx-auto">
          <div className="flex flex-col">
            <h5>{isConstant ? "Decay" : "Pause"}?</h5>
            <p className="text-base">
              Your current position is {isConstant ? "paused" : "decaying"},
              please confirm whether you'd like to{" "}
              {isConstant ? "let it decay" : "pause it"} or not?
            </p>
          </div>
          <PositionCard position={position} compact={true} />
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row justify-between items-center gap-2">
              <Button variant="secondary" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                className="text-foreground gap-2 flex-1"
                disabled={isSubmitting || hasRewards || isDelegated}
                onClick={handleSubmit}
              >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                {isSubmitting
                  ? isConstant
                    ? "Decaying..."
                    : "Pausing..."
                  : "Confirm"}
              </Button>
            </div>
            <div className="flex flex-row justify-center">
              <p className="text-xs text-muted-foreground text-center">
                A network fee will be required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};