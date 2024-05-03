import React, { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const ProxyButton: React.FC<{
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
}> = ({ className = "", onClick, isLoading = false }) => {
  const { connected } = useWallet();
  const { loading, positions } = useHeliumVsrState();

  const unproxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) => !p.proxy || p.proxy.nextOwner.equals(PublicKey.default)
      ),
    [positions]
  );

  const tooltipContent = !connected
    ? "Connect your wallet to claim"
    : !unproxiedPositions?.length
    ? "You don't have any positions available to proxy."
    : "";

  return (
    <Button
      className={className}
      disabled={!connected || loading || !unproxiedPositions?.length}
      onClick={onClick}
    >
      <div className="flex items-center">
        {isLoading && <Loader2 className="size-5 animate-spin" />}
        <span>Assign Voting Proxies</span>
      </div>
    </Button>
  );
};
