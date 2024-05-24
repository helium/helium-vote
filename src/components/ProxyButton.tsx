import React, { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useGovernance } from "@/providers/GovernanceProvider";
import { RiUserSharedFill } from "react-icons/ri";
import { cn } from "@/lib/utils";

export const ProxyButton: React.FC<{
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
}> = ({ className = "", onClick, isLoading = false }) => {
  const { connected } = useWallet();
  const { loading, positions } = useGovernance();

  const unproxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) => !p.proxy || p.proxy.nextVoter.equals(PublicKey.default)
      ),
    [positions]
  );

  return (
    <Button
      variant="secondary"
      className={cn(
        "text-foreground flex flex-row gap-2 items-center p-6 w-full",
        className
      )}
      disabled={!connected || loading || !unproxiedPositions?.length}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <RiUserSharedFill className="size-4" />
      )}
      Assign Proxy
    </Button>
  );
};
