import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { Loader2, X } from "lucide-react";
import React, { FC } from "react";
import { FaCircle, FaCircleCheck } from "react-icons/fa6";
import { Button } from "../ui/button";
import { PositionAction } from "./PositionManager";

export const PositionActionBoundary: FC<
  React.PropsWithChildren<{
    position: PositionWithMeta;
    action?: PositionAction;
    isClaiming?: boolean;
    isRelinquishing?: boolean;
    setManagerAction: (action?: PositionAction) => void;
    handleClaimRewards: () => Promise<void>;
    handleRelinquishVotes: () => Promise<void>;
  }>
> = ({
  children,
  position,
  action,
  isClaiming,
  isRelinquishing,
  setManagerAction,
  handleClaimRewards,
  handleRelinquishVotes,
}) => {
  const { hasRewards, isDelegated, numActiveVotes } = position;
  const hasVotes = numActiveVotes > 0;
  const hasBlockers = hasRewards || isDelegated || hasVotes;
  const canDoWhileBlocked = action === "delegate" || action == "proxy";

  if (!action) {
    return children;
  }

  return (
    <div className="relative h-full">
      {hasBlockers && !canDoWhileBlocked && (
        <div className="flex flex-col justify-center items-center backdrop-blur-md absolute inset-0 z-10 overscroll-contain">
          <X
            className="flex size-6 absolute top-6 right-6 cursor-pointer"
            onClick={() => setManagerAction(undefined)}
          />
          <div className="max-w-md px-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col text-base">
                <h4>Momentarily Unavailable</h4>
                <p>
                  In order to{" "}
                  <span className="font-normal">update this position</span> you
                  must first:
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  {hasRewards && <FaCircle className="text-slate-500 size-5" />}
                  {!hasRewards && (
                    <FaCircleCheck className="text-success-foreground size-5" />
                  )}
                  <span>
                    <span className="font-bold">Claim</span> your rewards
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  {isDelegated && (
                    <FaCircle className="text-slate-500 size-5" />
                  )}
                  {!isDelegated && (
                    <FaCircleCheck className="text-success-foreground size-5" />
                  )}
                  <span>
                    <span className="font-bold">Undelegate</span> from
                    subnetwork
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2 items-center">
                    {hasVotes && <FaCircle className="text-slate-500 size-5" />}
                    {!hasVotes && (
                      <FaCircleCheck className="text-success-foreground size-5" />
                    )}
                    <span>
                      <span className="font-bold">Relinquish</span> any/all
                      votes
                    </span>
                  </div>
                  <span className="text-sm">
                    or wait until all your casted votes are closed
                  </span>
                </div>
              </div>
              <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                {hasRewards && (
                  <div className="flex flex-row bg-background rounded-md flex-1">
                    <Button
                      className="flex-1 text-foreground gap-2"
                      disabled={isClaiming}
                      onClick={handleClaimRewards}
                    >
                      {isClaiming && (
                        <Loader2 className="size-5 animate-spin" />
                      )}
                      {isClaiming ? "Claiming..." : "Claim Rewards"}
                    </Button>
                  </div>
                )}
                <Button
                  onClick={() => setManagerAction("delegate")}
                  className="flex-1 text-foreground"
                >
                  Change Delegation
                </Button>
                {hasVotes && (
                  <div className="flex flex-row bg-background rounded-md flex-1">
                    <Button
                      className="text-foreground flex-1"
                      disabled={isRelinquishing}
                      onClick={handleRelinquishVotes}
                    >
                      {isRelinquishing && (
                        <Loader2 className="size-5 animate-spin" />
                      )}
                      {isRelinquishing
                        ? "Relinquishing Votes..."
                        : "Relinquish Votes"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
