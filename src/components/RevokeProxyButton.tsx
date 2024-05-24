import { useGovernance } from "@/providers/GovernanceProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { RiUserReceivedFill } from "react-icons/ri";
import { cn } from "@/lib/utils";

export const RevokeProxyButton: React.FC<{
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
  wallet?: PublicKey;
}> = ({ wallet, className = "", onClick, isLoading = false }) => {
  const { connected } = useWallet();
  const { loading, positions } = useGovernance();

  const proxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          p.proxy &&
          !p.proxy.nextVoter.equals(PublicKey.default) &&
          (!wallet || p.proxy.nextVoter.equals(wallet))
      ),
    [positions]
  );

  const disabled = !connected || loading || !proxiedPositions?.length;

  return (
    <Button
      variant="secondary"
      className={cn(
        "text-foreground flex flex-row gap-2 items-center p-6 w-full",
        className,
        {
          hidden: disabled,
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <RiUserReceivedFill className="size-4" />
      )}
      Revoke Proxies
    </Button>
  );
};
