"use client";

import { EPOCH_LENGTH, onInstructions, secsToDays } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import {
  useAnchorProvider,
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import { RiUserSharedFill } from "react-icons/ri";
import { toNumber } from "@helium/spl-utils";
import {
  PositionWithMeta,
  SubDaoWithMeta,
  useAssignProxies,
  useClaimPositionRewards,
  useClosePosition,
  useDelegatePosition,
  useExtendPosition,
  useFlipPositionLockupKind,
  useRelinquishPositionVotes,
  useSplitPosition,
  useTransferPosition,
  useUnassignProxies,
} from "@helium/voter-stake-registry-hooks";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import BN from "bn.js";
import classNames from "classnames";
import { ArrowUpFromDot, CheckCheck, Merge, Split } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useAsync } from "react-async-hook";
import { toast } from "sonner";
import { ContentSection } from "../ContentSection";
import { LockTokensFormValues } from "../LockTokensForm";
import { Card, CardContent } from "../ui/card";
import { ExtendPositionPrompt } from "./ExtendPositionPrompt";
import { FlipPositionPrompt } from "./FlipPositionPrompt";
import { MergePositionPrompt } from "./MergePositionPrompt";
import { PositionActionBoundary } from "./PositionActionBoundary";
import { PositionCallout } from "./PositionCallout";
import { ReclaimPositionPrompt } from "./ReclaimPositionPrompt";
import { SplitPositionPrompt } from "./SplitPositionPrompt";
import { UpdatePositionDelegationPrompt } from "./UpdatePositionDelegationPrompt";
import { ProxyPositionPrompt } from "./ProxyPositionPrompt";
import { PublicKey } from "@solana/web3.js";

export type PositionAction =
  | "flip"
  | "delegate"
  | "extend"
  | "split"
  | "merge"
  | "reclaim"
  | "proxy";

export interface PositionManagerProps {
  initAction?: PositionAction;
  position: PositionWithMeta;
}

const PositionAction: FC<
  PropsWithChildren<{
    active?: boolean;
    disabled?: boolean;
    Icon: any;
    onClick: () => void;
  }>
> = ({ active, disabled, Icon, onClick, children }) => (
  <div
    className={classNames(
      "flex flex-row flex-1 items-center py-3 px-4 rounded-md bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
      active && "!bg-info !border-info-foreground font-medium",
      disabled &&
        "cursor-default opacity-50 hover:bg-opacity-100 active:bg-opacity-100"
    )}
    onClick={!disabled ? onClick : () => {}}
  >
    <div
      className={classNames(
        "rounded-full p-3 bg-background mr-4",
        active && "!bg-info-foreground/30"
      )}
    >
      <Icon />
    </div>
    {children}
  </div>
);

export const PositionManager: FC<PositionManagerProps> = ({
  position,
  initAction,
}) => {
  const unixNow = useSolanaUnixNow() || Date.now() / 1000;
  const [action, setAction] = useState<PositionAction | undefined>(initAction);
  const provider = useAnchorProvider();
  const {
    mintAcc,
    network,
    positions,
    organization,
    refetch: refetchState,
  } = useGovernance();
  const router = useRouter();
  const { lockup, isDelegated } = position;
  const isConstant = Object.keys(lockup.kind)[0] === "constant";
  const decayedEpoch = lockup.endTs.div(new BN(EPOCH_LENGTH));
  const currentEpoch = new BN(unixNow).div(new BN(EPOCH_LENGTH));
  const isDecayed =
    !isConstant &&
    (isDelegated
      ? currentEpoch.gt(decayedEpoch)
      : lockup.endTs.lte(new BN(unixNow)));
  const canDelegate = network === "hnt";
  const mergablePositions: PositionWithMeta[] = useMemo(() => {
    if (!unixNow || !positions || !positions.length) {
      return [];
    }

    const lockupKind = Object.keys(lockup.kind)[0];
    const positionLockupPeriodInDays = secsToDays(
      lockupKind === "constant"
        ? lockup.endTs.sub(lockup.startTs).toNumber()
        : lockup.endTs.sub(new BN(unixNow || 0)).toNumber()
    );

    return positions.filter((pos) => {
      const { lockup } = pos;
      const lockupKind = Object.keys(lockup.kind)[0];
      const lockupPeriodInDays = secsToDays(
        lockupKind === "constant"
          ? lockup.endTs.sub(lockup.startTs).toNumber()
          : lockup.endTs.sub(new BN(unixNow)).toNumber()
      );

      return (
        (unixNow >= pos.genesisEnd.toNumber() ||
          unixNow <=
            position.votingMint.genesisVotePowerMultiplierExpirationTs.toNumber() ||
          !pos.hasGenesisMultiplier) &&
        !pos.isDelegated &&
        !position.pubkey.equals(pos.pubkey) &&
        lockupPeriodInDays >= positionLockupPeriodInDays
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, unixNow, positions]);

  const maxActionableAmount = mintAcc
    ? toNumber(position.amountDepositedNative, mintAcc)
    : 0;

  const reset = useCallback(() => {
    refetchState();
    setAction(undefined);
  }, [refetchState, setAction]);

  const { isPending: isAssigningProxy, mutateAsync: assignProxies } =
    useAssignProxies();
  const { isPending: isRevokingProxy, mutateAsync: unassignProxies } =
    useUnassignProxies();
  const isUpdatingProxy = isAssigningProxy || isRevokingProxy;
  const { loading: isFlipping, flipPositionLockupKind } =
    useFlipPositionLockupKind();
  const { loading: isClaiming, claimPositionRewards } =
    useClaimPositionRewards();
  const { loading: isDelegating, delegatePosition } = useDelegatePosition();
  const { loading: isTransfering, transferPosition } = useTransferPosition();
  const { loading: isSplitting, splitPosition } = useSplitPosition();
  const { loading: isExtending, extendPosition } = useExtendPosition();
  const { loading: isReclaiming, closePosition } = useClosePosition();
  const { loading: isRelinquishing, relinquishPositionVotes } =
    useRelinquishPositionVotes();

  const handleUpdateProxy = async ({
    proxy,
    expirationTime,
    isRevoke,
  }: {
    proxy?: string;
    expirationTime?: number;
    isRevoke?: boolean;
  }) => {
    try {
      if (isRevoke) {
        await unassignProxies({
          positions: [position],
          onInstructions: onInstructions(provider, {
            useFirstEstimateForAll: true,
          }),
        });
      } else {
        await assignProxies({
          positions: [position],
          recipient: new PublicKey(proxy || ""),
          expirationTime: new BN(expirationTime || 0),
          onInstructions: onInstructions(provider, {
            useFirstEstimateForAll: true,
          }),
        });
      }
      toast(`Proxy ${isRevoke ? "revoked" : "assigned"}`);
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(
          e.message ||
            `${isRevoke ? "Revoke" : "Assign"} failed, please try again`
        );
      }
    }
  };

  const handleRelinquishPositionVotes = async () => {
    try {
      await relinquishPositionVotes({
        position,
        organization,
        onInstructions: onInstructions(provider),
      });

      toast("Votes Relinquished");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Relinquish failed, please try again");
      }
    }
  };

  const handleClosePosition = async () => {
    try {
      await closePosition({
        position,
        onInstructions: onInstructions(provider),
      });
      router.replace(`/${network}/positions`);

      toast("Position Reclaimed");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Reclaim failed, please try again");
      }
    }
  };

  const handleFlipPositionLockupKind = async () => {
    try {
      await flipPositionLockupKind({
        position,
        onInstructions: onInstructions(provider),
      });

      toast("Position flipped");
      setAction(undefined);
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(
          e.message ||
            `${isConstant ? "Pause" : "Decay"} failed, please try again`
        );
      }
    }
  };

  const handleClaimPositionRewards = async () => {
    try {
      await claimPositionRewards({
        position,
        onInstructions: onInstructions(provider),
      });

      toast("Rewards claimed");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Claim failed, please try again");
      }
    }
  };

  const handleDelegatePosition = async (subDao?: SubDaoWithMeta) => {
    try {
      await delegatePosition({
        position,
        subDao,
        onInstructions: onInstructions(provider),
      });

      toast("Delegation updated");
      reset();
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Delegation failed, please try again");
      }
    }
  };

  const handleExtendPosition = async (values: LockTokensFormValues) => {
    try {
      await extendPosition({
        position,
        lockupPeriodsInDays: values.lockupPeriodInDays,
        onInstructions: onInstructions(provider),
      });

      toast("Position extended");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Extension failed, please try again");
      }
    }
  };

  const handleSplitPosition = async (values: LockTokensFormValues) => {
    try {
      await splitPosition({
        sourcePosition: position,
        amount: values.amount,
        lockupKind: values.lockupKind,
        lockupPeriodsInDays: values.lockupPeriodInDays,
        onInstructions: onInstructions(provider),
      });

      toast("Position split");
      reset();
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Split failed, please try again");
      }
    }
  };

  const handleMergePosition = async (
    targetPosition: PositionWithMeta,
    amount: number
  ) => {
    try {
      await transferPosition({
        sourcePosition: position,
        amount,
        targetPosition,
        onInstructions: onInstructions(provider),
      });

      if (amount === maxActionableAmount) {
        router.replace(`/${network}/positions`);
      }

      toast("Position merged");
      reset();
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Merge failed, please try again");
      }
    }
  };

  useAsync(async () => {
    if (action) {
      const actionFunctions = {
        claim: handleClaimPositionRewards,
      };

      const selectedAction =
        actionFunctions[action as keyof typeof actionFunctions];

      if (selectedAction) {
        await selectedAction();
      }
    }
  }, [action]);

  return (
    <ContentSection className="flex-1 py-8 max-md:py-0 max-md:px-0">
      <Card className="max-md:flex-1 max-md:rounded-none">
        <CardContent className="flex flex-row p-0">
          <div className="flex flex-col border-r-2 border-background max-md:border-none max-md:flex-1">
            <div className="flex flex-col p-4 border-b-2 border-background">
              <PositionCallout
                position={position}
                isClaiming={isClaiming}
                isReclaiming={isReclaiming}
                setManagerAction={setAction}
                handleClaimRewards={handleClaimPositionRewards}
              />
            </div>
            {!position.isProxiedToMe && (
              <div className="flex flex-col py-10 px-4 gap-12 min-w-[465px] max-md:min-w-full max-md:py-4 max-md:gap-4">
                <div className="flex flex-row justify-center items-center">
                  <span className="flex flex-grow h-[1px] bg-foreground/30 mx-2" />
                  <span>Position Actions</span>
                  <span className="flex flex-grow h-[1px] bg-foreground/30 mx-2" />
                </div>
                <div className="flex flex-col gap-4 max-md:gap-2">
                  <PositionAction
                    active={action === "proxy"}
                    Icon={() => <RiUserSharedFill size={24} />}
                    onClick={() => setAction("proxy")}
                  >
                    Update Proxy
                  </PositionAction>
                  {canDelegate && (
                    <PositionAction
                      active={action === "delegate"}
                      disabled={!position.delegatedSubDao && isDecayed}
                      Icon={CheckCheck}
                      onClick={() => setAction("delegate")}
                    >
                      Update Delegation
                    </PositionAction>
                  )}
                  <PositionAction
                    active={action === "extend"}
                    Icon={() => (
                      <ArrowUpFromDot className="transform rotate-90" />
                    )}
                    onClick={() => setAction("extend")}
                  >
                    Extend Position
                  </PositionAction>
                  <PositionAction
                    active={action === "split"}
                    Icon={Split}
                    onClick={() => setAction("split")}
                  >
                    Split Position
                  </PositionAction>
                  <PositionAction
                    active={action === "merge"}
                    Icon={Merge}
                    onClick={() => setAction("merge")}
                  >
                    Merge Position
                  </PositionAction>
                </div>
                <span className="flex flex-grow h-[1px] bg-foreground/30 mx-2" />
              </div>
            )}
          </div>
          <div
            className={classNames(
              "items-stretch justify-center w-full",
              "max-md:h-full max-md:fixed max-md:top-0 max-md:left-0 max-md:bg-card",
              !action && "max-md:hidden"
            )}
          >
            <PositionActionBoundary
              position={position}
              action={action}
              isClaiming={isClaiming}
              isRelinquishing={isRelinquishing}
              setManagerAction={setAction}
              handleClaimRewards={handleClaimPositionRewards}
              handleRelinquishVotes={handleRelinquishPositionVotes}
            >
              {!action && (
                <div className="flex flex-col h-full justify-center items-center p-8">
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl text-muted-foreground">
                      Manage Position
                    </h3>
                    <p className="text-sm text-center text-muted-foreground">
                      Select an action from the left to manage your position
                    </p>
                  </div>
                </div>
              )}
              {action === "proxy" && (
                <ProxyPositionPrompt
                  position={position}
                  isSubmitting={isUpdatingProxy}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleUpdateProxy}
                />
              )}
              {action === "flip" && (
                <FlipPositionPrompt
                  position={position}
                  isSubmitting={isFlipping}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleFlipPositionLockupKind}
                />
              )}
              {action === "reclaim" && (
                <ReclaimPositionPrompt
                  position={position}
                  isSubmitting={isReclaiming}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleClosePosition}
                />
              )}
              {action === "delegate" && (
                <UpdatePositionDelegationPrompt
                  position={position}
                  isSubmitting={isDelegating}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleDelegatePosition}
                />
              )}
              {action === "extend" && (
                <ExtendPositionPrompt
                  position={position}
                  maxActionableAmount={maxActionableAmount}
                  isSubmitting={isExtending}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleExtendPosition}
                />
              )}
              {action === "split" && (
                <SplitPositionPrompt
                  position={position}
                  maxActionableAmount={maxActionableAmount}
                  isSubmitting={isSplitting}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleSplitPosition}
                />
              )}
              {action === "merge" && (
                <MergePositionPrompt
                  position={position}
                  positions={mergablePositions}
                  maxActionableAmount={maxActionableAmount}
                  isSubmitting={isTransfering}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleMergePosition}
                />
              )}
            </PositionActionBoundary>
          </div>
        </CardContent>
      </Card>
    </ContentSection>
  );
};
