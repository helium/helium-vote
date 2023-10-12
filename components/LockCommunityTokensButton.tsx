import { useAssociatedTokenAccount } from "@helium/helium-react-hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { AiFillLock } from "react-icons/ai";
import { SecondaryButton } from "./Button";

export const LockCommunityTokensButton: React.FC<{
  mint: PublicKey;
  className?: string;
  onClick: () => void;
}> = ({ mint, onClick, className = "" }) => {
  const { publicKey, connected } = useWallet();
  const { associatedAccount, loading: loadingAta } = useAssociatedTokenAccount(
    publicKey,
    mint
  );

  const hasTokensInWallet =
    associatedAccount && associatedAccount.amount > 0;

  const tooltipContent = !connected
    ? "Connect your wallet to lock"
    : !hasTokensInWallet
    ? "You don't have any governance tokens in your wallet to lock."
    : "";

  return (
    <SecondaryButton
      tooltipMessage={tooltipContent}
      className={className}
      disabled={!connected || !hasTokensInWallet}
      onClick={onClick}
    >
      <div className="flex items-center">
        <AiFillLock className="h-5 mr-1.5 w-5" />
        <span>Lock Tokens</span>
      </div>
    </SecondaryButton>
  );
};
