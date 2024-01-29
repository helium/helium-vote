import React, { useCallback, useState, useMemo } from "react";
import {
  useAnchorProvider,
  useMint,
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import { BN } from "@coral-xyz/anchor";
import Button, { SecondaryButton } from "./Button";
import {
  HNT_MINT,
  batchInstructionsToTxsWithPriorityFee,
  batchParallelInstructionsWithPriorityFee,
  sendAndConfirmWithRetry,
  toNumber,
} from "@helium/spl-utils";
import { notify } from "../utils/notifications";
import {
  daysToSecs,
  secsToDays,
  getMinDurationFmt,
  getTimeLeftFromNowFmt,
} from "../utils/dateTools";
import {
  PositionWithMeta,
  SubDaoWithMeta,
  useHeliumVsrState,
  useRegistrar,
} from "@helium/voter-stake-registry-hooks";
import {
  LockTokensModal,
  LockTokensModalFormValues,
} from "../components/LockTokensModal";
import { TransferTokensModal } from "./TransferTokensModal";
import {
  useExtendPosition,
  useSplitPosition,
  useTransferPosition,
  useFlipPositionLockupKind,
  calcLockupMultiplier,
  useClosePosition,
  useDelegatePosition,
  useUndelegatePosition,
  useClaimPositionRewards,
} from "@helium/voter-stake-registry-hooks";
import { DelegateTokensModal } from "./DelegateTokensModal";
import { PromptModal } from "./PromptModal";
import { humanReadable } from "../utils/formatting";
import { useMetaplexMetadata } from "../hooks/useMetaplexMetadata";
import { FaCodeBranch } from "react-icons/fa6";
import { FaPauseCircle, FaPlayCircle, FaCalendarPlus } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { MAX_TRANSACTIONS_PER_SIGNATURE_BATCH } from "./constants";
import { Keypair, TransactionInstruction } from "@solana/web3.js";

interface PositionCardProps {
  subDaos?: SubDaoWithMeta[];
  position: PositionWithMeta;
}

export const PositionCard: React.FC<PositionCardProps> = ({
  subDaos,
  position,
}) => {
  const mint = position.votingMint.mint;
  const unixNow = useSolanaUnixNow();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const { loading: isLoading, positions, refetch } = useHeliumVsrState();
  const provider = useAnchorProvider();

  const transferablePositions: PositionWithMeta[] = useMemo(() => {
    if (!unixNow || !positions.length) {
      return [];
    }

    const lockup = position.lockup;
    const lockupKind = Object.keys(lockup.kind)[0];
    const positionLockupPeriodInDays = secsToDays(
      lockupKind === "constant"
        ? lockup.endTs.sub(lockup.startTs).toNumber()
        : lockup.endTs.sub(new BN(unixNow || 0)).toNumber()
    );

    return positions.filter((pos) => {
      const lockup = pos.lockup;
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
  }, [position, unixNow, positions]);

  const onInstructions = async (
    instructions: TransactionInstruction[],
    sigs?: Keypair[]
  ) => {
    if (sigs) {
      const transactions = await batchInstructionsToTxsWithPriorityFee(
        provider,
        instructions
      );
      for (const tx of await provider.wallet.signAllTransactions(
        transactions
      )) {
        sigs.forEach((sig) => {
          if (tx.signatures.some((s) => s.publicKey.equals(sig.publicKey))) {
            tx.partialSign(sig);
          }
        });

        console.log(tx.signatures)
        await sendAndConfirmWithRetry(
          provider.connection,
          tx.serialize(),
          {
            skipPreflight: true,
          },
          "confirmed"
        );
      }
    } else {
      await batchParallelInstructionsWithPriorityFee(provider, instructions, {
        maxSignatureBatch: MAX_TRANSACTIONS_PER_SIGNATURE_BATCH,
      });
    }
  };

  const {
    loading: isExtending,
    error: extendingError,
    extendPosition,
  } = useExtendPosition();

  const {
    loading: isSpliting,
    error: splitingError,
    splitPosition,
  } = useSplitPosition();

  const {
    loading: isFlipping,
    error: flippingError,
    flipPositionLockupKind,
  } = useFlipPositionLockupKind();

  const {
    loading: isTransfering,
    error: transferingError,
    transferPosition,
  } = useTransferPosition();

  const {
    loading: isClosing,
    error: closingError,
    closePosition,
  } = useClosePosition();

  const {
    loading: isDelegating,
    error: delegatingError,
    delegatePosition,
  } = useDelegatePosition();

  const {
    loading: isUndelegating,
    error: undelegatingError,
    undelegatePosition,
  } = useUndelegatePosition();

  const {
    loading: isClaimingRewards,
    error: claimingRewardsError,
    claimPositionRewards,
  } = useClaimPositionRewards();

  const { lockup, hasGenesisMultiplier, votingMint } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";
  const lockupExpired =
    !isConstant && lockup.endTs.sub(new BN(unixNow)).lt(new BN(0));
  const { info: mintAcc } = useMint(position.votingMint.mint);

  const lockedTokens =
    mintAcc && humanReadable(position.amountDepositedNative, mintAcc.decimals);

  const maxActionableAmount = mintAcc
    ? toNumber(position.amountDepositedNative, mintAcc)
    : 0;
  const canDelegate = mint.equals(HNT_MINT);

  const { symbol, image } = useMetaplexMetadata(mint);
  /// TODO:
  const tokenInfo = {
    symbol: symbol,
    logoURI: image,
  };

  const { info: registrar } = useRegistrar(position.registrar);
  const handleCalcLockupMultiplier = useCallback(
    (lockupPeriodInDays: number) =>
      calcLockupMultiplier({
        lockupSecs: daysToSecs(lockupPeriodInDays),
        mint,
        registrar,
      }),
    [mint, registrar]
  );

  const refetchState = async () => {
    refetch();
  };

  const handleFlipPositionLockupKind = async () => {
    try {
      await flipPositionLockupKind({
        position,
        onInstructions,
      });

      if (!flippingError) {
        await refetchState();
      }
    } catch (e) {
      notify({
        type: "error",
        message:
          e.message || isConstant
            ? "Unable to unlock position"
            : "Unable to pause unlock",
        error: e,
      });
    }
  };

  const handleExtendTokens = async (values: LockTokensModalFormValues) => {
    await extendPosition({
      position,
      lockupPeriodsInDays: values.lockupPeriodInDays,
      onInstructions,
    });

    if (!extendingError) {
      await refetchState();
    }
  };

  const handleSplitTokens = async (values: LockTokensModalFormValues) => {
    await splitPosition({
      sourcePosition: position,
      amount: values.amount,
      lockupKind: values.lockupKind.value,
      lockupPeriodsInDays: values.lockupPeriodInDays,
      onInstructions,
    });

    if (!splitingError) {
      await refetchState();
    }
  };

  const handleTransferTokens = async (
    targetPosition: PositionWithMeta,
    amount: number
  ) => {
    await transferPosition({
      sourcePosition: position,
      amount,
      targetPosition,
      onInstructions,
    });

    if (!transferingError) {
      await refetchState();
    }
  };

  const handleDelegateTokens = async (subDao: SubDaoWithMeta) => {
    await delegatePosition({
      position,
      subDao,
      onInstructions,
    });

    if (!delegatingError) {
      await refetchState();
    }
  };

  const handleUndelegateTokens = async () => {
    try {
      await undelegatePosition({ position, onInstructions });

      if (!undelegatingError) {
        await refetchState();
      }
    } catch (e) {
      notify({
        type: "error",
        message: e.message || "Unable to undelegate tokens",
        error: e,
      });
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimPositionRewards({
        position,
        onInstructions,
      });

      if (!claimingRewardsError) {
        await refetchState();
      }
    } catch (e) {
      notify({
        type: "error",
        message: e.message || "Unable to claim rewards",
        error: e,
      });
    }
  };

  const handleClose = async () => {
    try {
      await closePosition({
        position,
        onInstructions,
      });

      if (!closingError) {
        await refetchState();
      }
    } catch (e) {
      notify({
        type: "error",
        message: e.message || "Unable to close position",
        error: e,
      });
    }
  };

  const CardLabel = ({ label, value }) => {
    return (
      <div className="flex flex-col w-1/2 py-2">
        <p className="text-xs text-fgd-2">{label}</p>
        <p className="font-bold text-fgd-1">{value}</p>
      </div>
    );
  };

  const delegatedSubDaoMetadata = position.delegatedSubDao
    ? subDaos?.find((sd) => sd.pubkey.equals(position.delegatedSubDao!))
        ?.dntMetadata
    : null;

  const isVoting = position.numActiveVotes > 0;
  const isSubmitting =
    isExtending ||
    isSpliting ||
    isClosing ||
    isTransfering ||
    isFlipping ||
    isDelegating ||
    isUndelegating ||
    isClaimingRewards;

  const lockupKindDisplay = isConstant ? "Constant" : "Decaying";
  const hasActiveVotes = position.numActiveVotes > 0;
  return (
    <div className="relative shadow-xl overflow-hidden bg-gray-600 rounded-lg flex flex-col">
      {hasGenesisMultiplier && (
        <div
          className="absolute bg-primary-light px-8 transform rotate-45 text-bkg-2 text-xs font-bold"
          style={{ top: "18px", right: "-36px" }}
        >
          Landrush
        </div>
      )}
      {isLoading ? (
        <>
          <div className="animate-pulse bg-bkg-3 col-span-1 h-44 rounded-md" />
          <div className="animate-pulse bg-bkg-3 col-span-1 h-44 rounded-md" />
          <div className="animate-pulse bg-bkg-3 col-span-1 h-44 rounded-md" />
        </>
      ) : (
        <>
          <div className="bg-bkg-3 px-4 py-4 pr-16 rounded-md rounded-b-none flex items-center">
            {tokenInfo?.logoURI && (
              <img className="w-6 h-6 mr-2" src={tokenInfo?.logoURI}></img>
            )}
            <h3 className="text-xl mb-0">
              {lockedTokens}{" "}
              {!tokenInfo?.logoURI && position.votingMint.mint.toBase58()}
              <span className="font-normal text-fgd-3">
                {tokenInfo?.symbol}
              </span>
            </h3>
          </div>
          <div
            className="p-4 rounded-lg flex flex-col h-full w-full"
            style={{ minHeight: "260px" }}
          >
            <div className="flex flex-wrap mb-4">
              <CardLabel label="Lockup Type" value={lockupKindDisplay} />
              <CardLabel
                label="Vote Multiplier"
                value={(
                  (position.votingPower.isZero()
                    ? 0
                    : // Mul by 100 to get 2 decimal places
                      position.votingPower
                        .mul(new BN(100))
                        .div(position.amountDepositedNative)
                        .toNumber() / 100) /
                  (position.genesisEnd.gt(new BN(unixNow))
                    ? votingMint.genesisVotePowerMultiplier
                    : 1)
                ).toFixed(2)}
              />
              <CardLabel
                label={isConstant ? "Min Duration" : "Time left"}
                value={
                  isConstant
                    ? getMinDurationFmt(
                        position.lockup.startTs,
                        position.lockup.endTs
                      )
                    : getTimeLeftFromNowFmt(position.lockup.endTs)
                }
              />
              {hasGenesisMultiplier && (
                <CardLabel
                  label="Landrush"
                  value={`${
                    votingMint.genesisVotePowerMultiplier
                  }x (${getTimeLeftFromNowFmt(position.genesisEnd)})`}
                />
              )}
            </div>
            {isVoting && (
              <div
                title="Positions participating in active votes cannot be extended, transferred, or split"
                style={{ marginTop: "-6px" }}
                className="w-fit h-6 mb-6 px-2 py-1 bg-pink-500 rounded-lg flex-col justify-center items-start gap-2.5 inline-flex"
              >
                <div className="text-center text-gray-50 text-xs font-medium leading-none">
                  Active in {position.numActiveVotes} votes
                </div>
              </div>
            )}
            <div style={{ marginTop: "auto" }}>
              {position.isDelegated ? (
                <div className="flex flex-col gap-2 items-center">
                  {delegatedSubDaoMetadata ? (
                    <div
                      className="text-fgd-2 flex flex-row w-full gap-2 justify-center items-center"
                      style={{ fontSize: "9px" }}
                    >
                      <img
                        className="w-4 h-4"
                        src={delegatedSubDaoMetadata.json?.image || ""}
                      />
                      <span>{delegatedSubDaoMetadata.name}</span>
                    </div>
                  ) : null}
                  <Button
                    className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                    onClick={handleClaimRewards}
                    disabled={isSubmitting || !position.hasRewards}
                    isLoading={isClaimingRewards}
                  >
                    Claim Rewards
                  </Button>
                  <SecondaryButton
                    className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                    onClick={handleUndelegateTokens}
                    disabled={isSubmitting || position.hasRewards}
                    isLoading={isUndelegating}
                  >
                    Undelegate
                  </SecondaryButton>
                </div>
              ) : (
                <>
                  {lockupExpired ? (
                    <SecondaryButton
                      className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                      isLoading={isSubmitting}
                      disabled={isClosing}
                      onClick={handleClose}
                    >
                      Close
                    </SecondaryButton>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2 justify-center">
                        <SecondaryButton
                          className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                          onClick={() => setIsSplitModalOpen(true)}
                          disabled={isSubmitting || isVoting}
                          isLoading={isSpliting}
                        >
                          <div className="text-md mr-2">
                            <FaCodeBranch />
                          </div>
                          Split
                        </SecondaryButton>
                        <SecondaryButton
                          className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                          onClick={() => setIsTransferModalOpen(true)}
                          disabled={isSubmitting || isVoting}
                          isLoading={isTransfering}
                        >
                          <div className="text-lg mr-2">
                            <BiTransfer />
                          </div>
                          Transfer
                        </SecondaryButton>
                      </div>
                      <div className="flex flex-row gap-2 justify-center">
                        {isConstant ? (
                          <SecondaryButton
                            className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                            onClick={handleFlipPositionLockupKind}
                            disabled={isSubmitting || isVoting}
                            isLoading={isFlipping}
                          >
                            <div className="text-md mr-2">
                              <FaPlayCircle />
                            </div>
                            Start Decay
                          </SecondaryButton>
                        ) : (
                          <SecondaryButton
                            className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                            onClick={handleFlipPositionLockupKind}
                            disabled={isSubmitting || isVoting}
                            isLoading={isFlipping}
                          >
                            <div className="text-md mr-2">
                              <FaPauseCircle />
                            </div>
                            Pause Unlock
                          </SecondaryButton>
                        )}
                        <SecondaryButton
                          className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                          onClick={() => setIsExtendModalOpen(true)}
                          disabled={isSubmitting || isVoting}
                          isLoading={isExtending}
                        >
                          <div className="text-md mr-2">
                            <FaCalendarPlus />
                          </div>
                          Extend
                        </SecondaryButton>
                      </div>
                      {canDelegate && (
                        <SecondaryButton
                          className="h-8 justify-center items-center inline-flex w-full text-xs font-bold"
                          onClick={() => setIsDelegateModalOpen(true)}
                          disabled={isSubmitting}
                          isLoading={isDelegating}
                        >
                          Delegate
                        </SecondaryButton>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
      {isExtendModalOpen && (
        <LockTokensModal
          mint={mint}
          mode="extend"
          isOpen={isExtendModalOpen}
          minLockupTimeInDays={
            isConstant
              ? Math.ceil(
                  secsToDays(
                    position.lockup.endTs
                      .sub(position.lockup.startTs)
                      .toNumber()
                  )
                )
              : Math.ceil(
                  secsToDays(
                    position.lockup.endTs.sub(new BN(unixNow)).toNumber()
                  )
                )
          }
          maxLockupTimeInDays={secsToDays(
            votingMint.lockupSaturationSecs.toNumber()
          )}
          maxLockupAmount={maxActionableAmount}
          calcMultiplierFn={handleCalcLockupMultiplier}
          onClose={() => setIsExtendModalOpen(false)}
          onSubmit={handleExtendTokens}
        />
      )}
      {isSplitModalOpen &&
        (!hasActiveVotes ? (
          <LockTokensModal
            mint={mint}
            mode="split"
            isOpen={isSplitModalOpen}
            minLockupTimeInDays={
              isConstant
                ? Math.ceil(
                    secsToDays(
                      position.lockup.endTs
                        .sub(position.lockup.startTs)
                        .toNumber()
                    )
                  )
                : Math.ceil(
                    secsToDays(
                      position.lockup.endTs.sub(new BN(unixNow)).toNumber()
                    )
                  )
            }
            maxLockupTimeInDays={secsToDays(
              votingMint.lockupSaturationSecs.toNumber()
            )}
            maxLockupAmount={maxActionableAmount}
            calcMultiplierFn={handleCalcLockupMultiplier}
            onClose={() => setIsSplitModalOpen(false)}
            onSubmit={handleSplitTokens}
          />
        ) : (
          <PromptModal
            isOpen={isSplitModalOpen}
            type="error"
            title="Unable to split"
            message="Position is partaking in an active vote!"
            onClose={() => setIsSplitModalOpen(false)}
          />
        ))}
      {isTransferModalOpen &&
        (!hasActiveVotes ? (
          <TransferTokensModal
            mint={mint}
            isOpen={isTransferModalOpen}
            positions={transferablePositions}
            maxTransferAmount={maxActionableAmount}
            onClose={() => setIsTransferModalOpen(false)}
            onSubmit={handleTransferTokens}
          />
        ) : (
          <PromptModal
            isOpen={isTransferModalOpen}
            type="error"
            title="Unable to transfer"
            message="Position is partaking in an active vote!"
            onClose={() => setIsTransferModalOpen(false)}
          />
        ))}
      {canDelegate && isDelegateModalOpen && (
        <DelegateTokensModal
          isOpen={isDelegateModalOpen}
          onClose={() => setIsDelegateModalOpen(false)}
          onSubmit={handleDelegateTokens}
        />
      )}
    </div>
  );
};
