import React, { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const RevokeProxyButton: React.FC<{
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
  wallet?: PublicKey;
}> = ({ wallet, className = "", onClick, isLoading = false }) => {
  const { connected } = useWallet();
  const { loading, positions } = useHeliumVsrState();

  const proxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          p.proxy &&
          !p.proxy.nextOwner.equals(PublicKey.default) &&
          (!wallet || p.proxy.nextOwner.equals(wallet))
      ),
    [positions]
  );

  const tooltipContent = !connected
    ? "Connect your wallet to claim"
    : !proxiedPositions?.length
    ? "You don't have any positions available to revoke proxy."
    : "";

  const disabled = !connected || loading || !proxiedPositions?.length;

  return (
    <Button
      variant="secondary"
      className={className + ` ${disabled ? "hidden" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="flex items-center">
        {isLoading && <Loader2 className="size-5 animate-spin" />}
        <span>Revoke Voting Proxies</span>
      </div>
    </Button>
  );
};
