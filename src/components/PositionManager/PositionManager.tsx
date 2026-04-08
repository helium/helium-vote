"use client";

import { EPOCH_LENGTH, secsToDays } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { TASK_QUEUE, useDelegationClaimBot } from "@helium/automation-hooks";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import { delegatedPositionKey } from "@helium/helium-sub-daos-sdk";
import { RiUserSharedFill } from "react-icons/ri";
import { toNumber } from "@helium/spl-utils";
import {
  PositionWithMeta,
  SubDaoWithMeta,
  useSubDaos,
} from "@helium/voter-stake-registry-hooks";
import {
  useAssignProxiesMutation,
  useUnassignProxiesMutation,
  useFlipLockupKindMutation,
  useClaimRewardsMutation,
  useClosePositionMutation,
  useDelegatePositionMutation,
  useUndelegatePositionMutation,
  useExtendPositionMutation,
  useSplitPositionMutation,
  useTransferPositionMutation,
  useRelinquishPositionVotesMutation,
} from "@/hooks/useGovernanceMutations";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import BN from "bn.js";
import classNames from "classnames";
import { ArrowUpFromDot, CheckCheck, Merge, Split } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
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
import { IOT_SUB_DAO_KEY, MOBILE_SUB_DAO_KEY } from "@/lib/constants";
import { IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { delegationClaimBotKey } from "@helium/hpl-crons-sdk";

export type PositionAction =
  | "flip"
  | "delegate"
  | "undelegate"
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
        "!cursor-not-allowed !opacity-50 hover:!bg-opacity-100 active:!bg-opacity-100"
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
  const {
    mintAcc,
    network,
    positions,
    organization,
    refetch: refetchState,
  } = useGovernance();
  const isHNT = network === "hnt";
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

  const assignProxiesMutation = useAssignProxiesMutation();
  const unassignProxiesMutation = useUnassignProxiesMutation();
  const isUpdatingProxy =
    assignProxiesMutation.isPending || unassignProxiesMutation.isPending;
  const flipLockupKindMutation = useFlipLockupKindMutation();
  const claimRewardsMutation = useClaimRewardsMutation();
  const { result: subDaos } = useSubDaos();
  const delegationClaimBotK = useMemo(
    () =>
      delegationClaimBotKey(
        TASK_QUEUE,
        delegatedPositionKey(position.pubkey)[0]
      )[0],
    [position.pubkey]
  );
  const { info: delegationClaimBot } =
    useDelegationClaimBot(delegationClaimBotK);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  useEffect(() => {
    if (delegationClaimBot) {
      setAutomationEnabled(true);
    } else {
      setAutomationEnabled(false);
    }
  }, [delegationClaimBot]);
  const [subDao, setSubDao] = useState<SubDaoWithMeta | null>(
    subDaos?.find((sd) =>
      sd.pubkey.equals(position?.delegatedSubDao || MOBILE_SUB_DAO_KEY)
    ) || null
  );

  useEffect(() => {
    if (subDaos && !subDao) {
      setSubDao(
        subDaos.find((sd) =>
          sd.pubkey.equals(position?.delegatedSubDao || MOBILE_SUB_DAO_KEY)
        ) || null
      );
    }
  }, [subDaos, subDao, position?.delegatedSubDao]);

  const delegateMutation = useDelegatePositionMutation();
  const undelegateMutation = useUndelegatePositionMutation();
  const transferMutation = useTransferPositionMutation();
  const splitMutation = useSplitPositionMutation();
  const extendMutation = useExtendPositionMutation();
  const closeMutation = useClosePositionMutation();
  const relinquishVotesMutation = useRelinquishPositionVotesMutation();

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
        await unassignProxiesMutation.submit(
          {
            proxyKey: position.proxy?.nextVoter?.toBase58() || "",
            positionMints: [position.mint.toBase58()],
          },
          {
            header: "Revoke Proxy",
            message: "Revoking proxy assignment",
          }
        );
      } else {
        await assignProxiesMutation.submit(
          {
            proxyKey: proxy || "",
            positionMints: [position.mint.toBase58()],
            expirationTime: expirationTime || 0,
          },
          {
            header: "Assign Proxy",
            message: "Assigning proxy voter",
          }
        );
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
      await relinquishVotesMutation.submit(
        {
          positionMint: position.mint.toBase58(),
          organization: organization.toBase58(),
        },
        {
          header: "Relinquish Votes",
          message: "Relinquishing all votes from position",
        }
      );

      toast("Votes Relinquished");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Relinquish failed, please try again");
      }
    }
  };

  const handleClosePosition = async () => {
    try {
      await closeMutation.submit(
        {
          positionMint: position.mint.toBase58(),
        },
        {
          header: "Reclaim Position",
          message: "Closing and reclaiming position",
        }
      );
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
      await flipLockupKindMutation.submit(
        {
          positionMint: position.mint.toBase58(),
        },
        {
          header: "Flip Lockup Kind",
          message: `Switching position to ${isConstant ? "decaying" : "constant"}`,
        }
      );

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
      await claimRewardsMutation.submit(
        {
          positionMints: [position.mint.toBase58()],
        },
        {
          header: "Claim Rewards",
          message: "Claiming delegation rewards",
        }
      );

      toast("Rewards claimed");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Claim failed, please try again");
      }
    }
  };

  const handleDelegatePosition = async () => {
    try {
      await delegateMutation.submit(
        {
          positionMints: [position.mint.toBase58()],
          subDaoMint: subDao?.pubkey.equals(IOT_SUB_DAO_KEY) ? IOT_MINT.toBase58() : MOBILE_MINT.toBase58(),
          automationEnabled,
        },
        {
          header: "Delegate Position",
          message: "Delegating position to subnetwork",
        }
      );

      toast("Delegation updated");
      reset();
    } catch (e: any) {
      console.error(e);
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Delegation failed, please try again");
      }
    }
  };

  const handleUndelegatePosition = async () => {
    try {
      await undelegateMutation.submit(
        {
          positionMint: position.mint.toBase58(),
        },
        {
          header: "Undelegate Position",
          message: "Undelegating position",
        }
      );

      toast("Position undelegated");
      reset();
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Undelegation failed, please try again");
      }
    }
  };

  const handleExtendPosition = async (values: LockTokensFormValues) => {
    try {
      await extendMutation.submit(
        {
          positionMint: position.mint.toBase58(),
          lockupPeriodsInDays: values.lockupPeriodInDays,
        },
        {
          header: "Extend Position",
          message: "Extending position lockup period",
        }
      );

      toast("Position extended");
    } catch (e: any) {
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Extension failed, please try again");
      }
    }
  };

  const handleSplitPosition = async (values: LockTokensFormValues) => {
    try {
      await splitMutation.submit(
        {
          sourcePositionMint: position.mint.toBase58(),
          amount: values.amount.toString(),
          lockupKind: values.lockupKind as "cliff" | "constant",
          lockupPeriodsInDays: values.lockupPeriodInDays,
        },
        {
          header: "Split Position",
          message: "Splitting position",
        }
      );

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
      await transferMutation.submit(
        {
          sourcePositionMint: position.mint.toBase58(),
          targetPositionMint: targetPosition.mint.toBase58(),
          amount: amount.toString(),
        },
        {
          header: "Merge Position",
          message: "Merging positions",
        }
      );

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
                isClaiming={claimRewardsMutation.isPending}
                isReclaiming={closeMutation.isPending}
                setManagerAction={setAction}
                handleClaimRewards={handleClaimPositionRewards}
              />
            </div>
            {!position.isProxiedToMe && isHNT && (
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
                    disabled={!isHNT}
                  >
                    Update Proxy
                  </PositionAction>
                  <PositionAction
                    active={action === "delegate"}
                    disabled={
                      (!position.delegatedSubDao && isDecayed) || !isHNT
                    }
                    Icon={CheckCheck}
                    onClick={() => setAction("delegate")}
                  >
                    Change Delegation
                  </PositionAction>
                  <PositionAction
                    active={action === "extend"}
                    Icon={() => (
                      <ArrowUpFromDot className="transform rotate-90" />
                    )}
                    onClick={() => setAction("extend")}
                    disabled={!isHNT}
                  >
                    Extend Position
                  </PositionAction>
                  <PositionAction
                    active={action === "split"}
                    Icon={Split}
                    onClick={() => setAction("split")}
                    disabled={!isHNT}
                  >
                    Split Position
                  </PositionAction>
                  <PositionAction
                    active={action === "merge"}
                    Icon={Merge}
                    onClick={() => setAction("merge")}
                    disabled={!isHNT}
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
              isClaiming={claimRewardsMutation.isPending}
              isRelinquishing={relinquishVotesMutation.isPending}
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
                  isSubmitting={flipLockupKindMutation.isPending}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleFlipPositionLockupKind}
                />
              )}
              {action === "reclaim" && (
                <ReclaimPositionPrompt
                  position={position}
                  isSubmitting={closeMutation.isPending}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleClosePosition}
                />
              )}
              {action === "delegate" && (
                <UpdatePositionDelegationPrompt
                  position={position}
                  isSubmitting={delegateMutation.isPending || undelegateMutation.isPending}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleDelegatePosition}
                  onUndelegate={handleUndelegatePosition}
                  automationEnabled={automationEnabled}
                  setAutomationEnabled={setAutomationEnabled}
                  subDao={subDao}
                  setSubDao={setSubDao}
                  solFees={delegateMutation.estimatedSolFee?.uiAmount ?? 0}
                  prepaidTxFees={0}
                />
              )}
              {action === "undelegate" && <div>Test</div>}
              {action === "extend" && (
                <ExtendPositionPrompt
                  position={position}
                  maxActionableAmount={maxActionableAmount}
                  isSubmitting={extendMutation.isPending}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleExtendPosition}
                />
              )}
              {action === "split" && (
                <SplitPositionPrompt
                  position={position}
                  maxActionableAmount={maxActionableAmount}
                  isSubmitting={splitMutation.isPending}
                  onCancel={() => setAction(undefined)}
                  onConfirm={handleSplitPosition}
                />
              )}
              {action === "merge" && (
                <MergePositionPrompt
                  position={position}
                  positions={mergablePositions}
                  maxActionableAmount={maxActionableAmount}
                  isSubmitting={transferMutation.isPending}
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
