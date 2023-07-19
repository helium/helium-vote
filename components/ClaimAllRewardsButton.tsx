import React, { useMemo } from "react";
import { SecondaryButton } from "./Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";

export const ClaimAllRewardsButton: React.FC<{
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
}> = ({ className = "", onClick, isLoading = false }) => {
  const { connected } = useWallet();
  const { loading, positions } = useHeliumVsrState();

  const positionsWithRewards = useMemo(
    () => positions?.filter((p) => p.hasRewards),
    [positions]
  );

  const tooltipContent = !connected
    ? "Connect your wallet to claim"
    : !positionsWithRewards?.length
    ? "You don't have any positions with claimable rewards."
    : "";

  return (
    <SecondaryButton
      tooltipMessage={tooltipContent}
      className={className}
      disabled={!connected || loading || !positionsWithRewards?.length}
      isLoading={isLoading}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>Claim All Rewards</span>
      </div>
    </SecondaryButton>
  );
};
