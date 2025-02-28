import { networksToMint } from "@/lib/constants";
import { getTimeLeftFromNowFmt } from "@/lib/dateTools";
import { getMinDurationFmt, humanReadable } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import {
  PositionWithMeta,
  useRegistrar,
} from "@helium/voter-stake-registry-hooks";
import BN from "bn.js";
import Image from "next/image";
import { useMemo } from "react";

export const PositionPreview: React.FC<{
  position: Partial<PositionWithMeta>;
}> = ({ position }) => {
  const {
    lockup,
    hasGenesisMultiplier,
    votingMint: positionVotingMint,
  } = position;
  const { info: registrar } = useRegistrar(position.registrar);
  const votingMint = registrar?.votingMints[0].mint;
  const network =
    Object.entries(networksToMint).find(
      ([_, mint]) => votingMint && mint.equals(votingMint)
    )?.[0] || "hnt";
  const { info: mint } = useMint(votingMint);
  const amount = humanReadable(position.amountDepositedNative, mint?.decimals);
  const { subDaos } = useGovernance();
  const subDao = useMemo(
    () =>
      subDaos?.find(
        (s) =>
          position.delegatedSubDao && s.pubkey.equals(position.delegatedSubDao)
      ),
    [subDaos, position.delegatedSubDao]
  );

  return (
    <div className="flex flex-row gap-2 px-6 py-4 justiy-center items-center rounded-md bg-gradient-to-b from-background to-background/30">
      <div className="size-10 rounded-full relative mr-4 max-md:mr-1">
        <Image alt={`${network} icon`} src={`/images/${network}.svg`} fill />
      </div>
      <div className="flex flex-col flex-1 text-xs">
        {position.lockup && hasGenesisMultiplier && (
          <div className="flex flex-row flex-wrap gap-1 font-light">
            <span className="font-medium">Landrush</span>
            <span className="font-medium">
              {positionVotingMint?.genesisVotePowerMultiplier || 3}x (
              {getTimeLeftFromNowFmt(position.lockup.endTs)})
            </span>
          </div>
        )}
        <div className="flex flex-row flex-wrap gap-1 font-light">
          <span className="font-medium">
            {amount} {network.toUpperCase()}
          </span>
          <span className="text-foreground/80">for</span>
          <span className="font-medium">
            {position.lockup
              ? (Object.keys(position.lockup.kind)[0] as string) === "constant"
                ? getMinDurationFmt(
                    position.lockup.startTs,
                    position.lockup.endTs
                  )
                : getTimeLeftFromNowFmt(position.lockup.endTs)
              : null}
          </span>
          <span className="text-foreground/80">
            {position.lockup?.kind?.cliff ? "decaying" : "decaying delayed"}
          </span>
        </div>
        {subDao && (
          <div className="flex flex-row gap-1 font-normal items-center">
            <span className="text-foreground/80">and delegated to</span>
            <div className="size-6 rounded-full relative">
              <Image
                alt={subDao.dntMetadata.json?.name}
                src={subDao.dntMetadata.json?.image}
                fill
              />
            </div>
            <span>{subDao.dntMetadata.symbol}</span>
          </div>
        )}
      </div>
    </div>
  );
};
