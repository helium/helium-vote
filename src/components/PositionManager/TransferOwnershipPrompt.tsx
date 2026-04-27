"use client";

import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { Loader2, X } from "lucide-react";
import React, { FC, useMemo, useState } from "react";
import { PositionCard } from "../PositionCard";
import { StepIndicator } from "../StepIndicator";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const isValidSolanaAddress = (addr: string): boolean => {
  try {
    new PublicKey(addr);
    return true;
  } catch {
    return false;
  }
};

export const TransferOwnershipPrompt: FC<{
  position: PositionWithMeta;
  walletAddress: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (destinationWallet: string) => Promise<void>;
}> = ({ position, walletAddress, isSubmitting, onCancel, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");

  const validationError = useMemo(() => {
    if (!destination) return null;
    if (!isValidSolanaAddress(destination)) return "Invalid Solana address";
    if (destination === walletAddress)
      return "Cannot transfer to your own wallet";
    return null;
  }, [destination, walletAddress]);

  const canReview = destination.length > 0 && !validationError;

  const truncatedAddress = destination
    ? `${destination.slice(0, 4)}...${destination.slice(-4)}`
    : "";

  const handleSubmit = async () => {
    await onConfirm(destination);
  };

  return (
    <div className="flex flex-col h-full p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto md:justify-center">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col mb-4 gap-1">
        <div className="flex flex-row justify-between items-center">
          <h3>Transfer Ownership</h3>
          <StepIndicator steps={2} currentStep={step} />
        </div>
        <p>
          Transfer this position to another wallet.{" "}
          <span className="font-bold">This action is irreversible.</span> The
          position and all associated voting power, delegation, and rewards will
          move to the destination wallet.
        </p>
      </div>
      {step === 1 && (
        <>
          <div className="flex flex-col gap-4">
            <PositionCard position={position} compact={true} />
            <div className="flex flex-col gap-2">
              <span className="text-xs">Destination Wallet Address</span>
              <Input
                placeholder="Enter destination wallet address"
                value={destination}
                type="text"
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                onChange={(e) => setDestination(e.target.value.trim())}
              />
              {validationError && (
                <span className="text-xs text-destructive">
                  {validationError}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col max-md:flex-grow justify-end gap-2 mt-4">
            <div className="flex flex-row justify-between items-center gap-2">
              <Button variant="secondary" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                className="flex-1 text-foreground"
                disabled={!canReview}
                onClick={() => setStep(2)}
              >
                Review
              </Button>
            </div>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="flex flex-col gap-4">
            <PositionCard position={position} compact={true} />
            <div className="flex flex-col gap-2 p-4 rounded-md bg-background/50">
              <span className="text-xs text-muted-foreground">
                Transferring to
              </span>
              <span className="font-mono text-sm break-all">{destination}</span>
            </div>
            <p className="text-sm text-destructive">
              Please confirm you want to transfer this position to{" "}
              <span className="font-bold">{truncatedAddress}</span>. This cannot
              be undone.
            </p>
          </div>
          <div className="flex flex-col max-md:flex-grow justify-end gap-2 mt-4">
            <div className="flex flex-row justify-between items-center gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => setStep(1)}
              >
                Go Back
              </Button>
              <Button
                className="flex-1 text-foreground gap-2"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                {isSubmitting ? "Transferring..." : "Confirm Transfer"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              A network fee will be required
            </p>
          </div>
        </>
      )}
    </div>
  );
};
