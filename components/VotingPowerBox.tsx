import { BN } from "@coral-xyz/anchor";
import { useMint } from "@helium/helium-react-hooks";
import { humanReadable } from "../utils/formatting";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";
import React from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import Tooltip from "./Tooltip";

interface VotingPowerBoxProps {
  votingPower?: BN;
  mint: PublicKey;
  amountLocked?: BN;
  className?: string;
  style?: any;
}

export const VotingPowerBox: React.FC<VotingPowerBoxProps> = ({
  votingPower,
  mint,
  amountLocked,
  className = "",
  style,
}) => {
  const { info: mintAcc } = useMint(mint);
  return (
    <span className="mb-0 flex font-bold items-center hero-text">
      {mintAcc && votingPower && humanReadable(votingPower, mintAcc.decimals)}{" "}
      {amountLocked &&
        votingPower &&
        !amountLocked.isZero() &&
        !votingPower.isZero() && (
          <Tooltip content="Vote Weight Multiplier – Increase your vote weight by locking tokens">
            <div className="cursor-help flex font-normal items-center text-xs ml-3 rounded-full bg-bkg-3 px-2 py-1">
              <BsFillLightningChargeFill className="h-3 mr-1 text-primary-light w-3" />
              {`${
                votingPower &&
                amountLocked &&
                mintAcc &&
                humanReadable(votingPower.div(amountLocked), 0)
              }x`}
            </div>
          </Tooltip>
        )}
    </span>
  );
};

export const ProvidedVotingPowerBox: React.FC<{
  className?: string;
  style?: any;
}> = ({ className, style }) => {
  const { amountLocked, mint, votingPower } = useHeliumVsrState();
  return (
    <VotingPowerBox
      className={className}
      style={style}
      amountLocked={amountLocked}
      mint={mint}
      votingPower={votingPower}
    />
  );
};
