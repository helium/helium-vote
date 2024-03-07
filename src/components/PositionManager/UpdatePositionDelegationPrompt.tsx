"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import {
  PositionWithMeta,
  SubDaoWithMeta,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import classNames from "classnames";
import { Loader2, X } from "lucide-react";
import React, { FC, useState } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { StepIndicator } from "../StepIndicator";
import { SubDaoSelection } from "../SubDaoSelection";
import { Button } from "../ui/button";
import { ConfirmationItem } from "./ConfirmationItem";

export const UpdatePositionDelegationPrompt: FC<{
  position: PositionWithMeta;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (subDao?: SubDaoWithMeta) => Promise<void>;
}> = ({ position, isSubmitting, onCancel, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [selectedSubDaoPk, setSelectedSubDaoPk] = useState<PublicKey>();
  const { subDaos } = useGovernance();
  const { lockup, isDelegated, delegatedSubDao } = position;
  const unixNow = useSolanaUnixNow() || Date.now() / 1000;
  const isDecayed = lockup.endTs.lte(new BN(unixNow));

  const hasSelectedSubDao =
    (selectedSubDaoPk && !delegatedSubDao) ||
    (selectedSubDaoPk && !selectedSubDaoPk.equals(delegatedSubDao!));

  const selectedSubDao =
    selectedSubDaoPk &&
    subDaos?.find((sd) => sd.pubkey.equals(selectedSubDaoPk));

  const selectedSubDaoMetadata = selectedSubDao && selectedSubDao?.dntMetadata;

  const delegatedSubDaoMetadata =
    position.delegatedSubDao &&
    subDaos?.find((sd) => sd.pubkey.equals(position.delegatedSubDao!))
      ?.dntMetadata;

  const handleSubmit = async () => {
    await onConfirm(selectedSubDao);
  };

  return (
    <div className="flex flex-col h-full justify-center max-md:justify-normal p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col justify-center items-stretch">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <h5>{step === 1 ? "Update Position" : "Update Delegation"}</h5>
              <StepIndicator steps={2} currentStep={step} />
            </div>
            {step === 1 ? (
              <p className="text-base">
                In order to take any action (such as decaying, pausing,
                extending, splitting, or merging it) you'll need to undelegate
                it first
              </p>
            ) : (
              <p className="text-base">
                Please review the following information before confirming
              </p>
            )}
          </div>
          {step === 1 && (
            <>
              <SubDaoSelection
                hideNoneOption
                onSelect={setSelectedSubDaoPk}
                selectedSubDaoPk={selectedSubDaoPk || delegatedSubDao}
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row justify-between items-center gap-2">
                  <Button
                    variant="secondary"
                    disabled={!isDelegated}
                    className="flex-1"
                    onClick={() => {
                      setSelectedSubDaoPk(undefined);
                      setStep(step + 1);
                    }}
                  >
                    Undelegate
                  </Button>
                  <Button
                    variant={hasSelectedSubDao ? "default" : "secondary"}
                    disabled={!hasSelectedSubDao || isDecayed}
                    className="flex-1 text-foreground"
                    onClick={() => setStep(step + 1)}
                  >
                    Review
                  </Button>
                </div>
                {isDecayed && (
                  <p className="text-xs text-muted-foreground text-center">
                    Position is fully decayed and can only be undelegated
                  </p>
                )}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex flex-row">
                {hasSelectedSubDao && (
                  <div className="flex flex-row flex-1 relative">
                    {delegatedSubDaoMetadata && (
                      <>
                        <ConfirmationItem
                          className="rounded-l-md bg-gradient-to-t from-background to-background/30"
                          img={{
                            alt: delegatedSubDaoMetadata?.json?.name,
                            src: delegatedSubDaoMetadata?.json?.image,
                          }}
                          title="Delegating from..."
                          description={delegatedSubDaoMetadata?.symbol.toUpperCase()}
                        />
                        <FaCircleArrowRight className="size-6 absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)]" />
                      </>
                    )}
                    <ConfirmationItem
                      className={classNames(
                        "rounded-r-md bg-gradient-to-b from-background to-background/30",
                        !delegatedSubDaoMetadata && "rounded-md"
                      )}
                      img={{
                        alt: selectedSubDaoMetadata?.json?.name,
                        src: selectedSubDaoMetadata?.json?.image,
                      }}
                      title="Delegating to..."
                      description={selectedSubDaoMetadata?.symbol.toUpperCase()}
                    />
                  </div>
                )}
                {!hasSelectedSubDao && (
                  <ConfirmationItem
                    className="rounded-md bg-gradient-to-t from-background to-background/30"
                    img={{
                      alt: delegatedSubDaoMetadata?.json?.name,
                      src: delegatedSubDaoMetadata?.json?.image,
                    }}
                    title="Delegating from..."
                    description={delegatedSubDaoMetadata?.symbol.toUpperCase()}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row justify-between items-center gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={isSubmitting}
                    onClick={() => {
                      setSelectedSubDaoPk(undefined);
                      setStep(step - 1);
                    }}
                  >
                    Go Back
                  </Button>
                  <Button
                    className="flex-1 text-foreground gap-2"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting && (
                      <Loader2 className="size-5 animate-spin" />
                    )}
                    {isSubmitting ? "Updating Delegation..." : "Confirm"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  A network fee will be required
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
