import React, { useMemo } from "react";
import { useWallet } from "@/hooks/useWallet";
import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useGovernance } from "@/providers/GovernanceProvider";
import { RiUserSharedFill } from "react-icons/ri";
import { cn } from "@/lib/utils";

export const ProxyButton = React.forwardRef<
  HTMLButtonElement,
  {
    className?: string;
    onClick?: () => void;
    isLoading?: boolean;
    size?: "md" | "sm";
    children?: React.ReactNode;
    includeProxied?: boolean;
  }
>(({
  className = "",
  onClick,
  isLoading = false,
  size = "md",
  children = "Assign Proxy",
  includeProxied = false,
}, ref) => {
  const { connected } = useWallet();
  const { loading, positions } = useGovernance();

  const selectablePositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          includeProxied ||
          !p.proxy ||
          p.proxy.nextVoter.equals(PublicKey.default)
      ),
    [positions, includeProxied]
  );

  const sizeClass = size === "sm" ? "p-3" : "p-6 w-full";

  return (
    <Button
      ref={ref}
      variant="secondary"
      className={cn(
        "text-foreground flex flex-row gap-2 items-center",
        sizeClass,
        className
      )}
      disabled={!connected || loading || !selectablePositions?.length}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <RiUserSharedFill className="size-4" />
      )}
      {children}
    </Button>
  );
});

ProxyButton.displayName = "ProxyButton";
