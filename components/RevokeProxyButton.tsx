import React, { useMemo } from "react";
import { SecondaryButton } from "./Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";

export const RevokeProxyButton: React.FC<{
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
  wallet?: PublicKey;
}> = ({ wallet, className = "", onClick, isLoading = false }) => {
  const { connected } = useWallet();
  const { loading, positions } = useHeliumVsrState();

  const delegatedPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          p.votingDelegation &&
          !p.votingDelegation.nextOwner.equals(PublicKey.default) &&
          (!wallet || p.votingDelegation.nextOwner.equals(wallet))
      ),
    [positions]
  );

  const tooltipContent = !connected
    ? "Connect your wallet to claim"
    : !delegatedPositions?.length
    ? "You don't have any positions available to revoke proxy."
    : "";

  const disabled = !connected || loading || !delegatedPositions?.length

  return (
    <SecondaryButton
      tooltipMessage={tooltipContent}
      className={className + ` ${disabled ? "hidden" : ""}`}
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>Revoke Voting Proxies</span>
      </div>
    </SecondaryButton>
  );
};
