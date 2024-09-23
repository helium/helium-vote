"use client";

import { usePrevious } from "@/hooks/usePrevious";
import { abbreviateNumber } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import {
  useAnchorProvider,
  useMint,
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import { HNT_MINT, IOT_MINT, MOBILE_MINT, toNumber } from "@helium/spl-utils";
import {
  calcPositionVotingPower,
  usePositionKeysAndProxies,
  usePositions,
  useRegistrar
} from "@helium/voter-stake-registry-hooks";
import { getRegistrarKey } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Image from "next/image";
import { FC, useMemo } from "react";

const VeTokenItem: FC<{ mint: PublicKey }> = ({ mint }) => {
  const provider = useAnchorProvider();
  const { wallet, connection } = provider || {};
  const unixNow = useSolanaUnixNow() || Date.now() / 1000;
  const decimals = useMint(mint)?.info?.decimals;
  const registrarKey = useMemo(
    () => mint && getRegistrarKey(mint),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mint?.toBase58()]
  );
  const { info: registrar } = useRegistrar(registrarKey);

  const { voteService } = useGovernance();
  const {
    positionKeys,
    proxiedPositionKeys,
    isLoading: loadingPositionKeys,
  } = usePositionKeysAndProxies({
    wallet: wallet?.publicKey,
    provider,
    voteService,
  });

  // Assume that my positions are a small amount, so we don't need to say they're static
  const { accounts: myPositions, loading: loadingMyPositions } =
    usePositions(positionKeys);
  // Proxied positions may be a lot, set to static
  const { accounts: proxiedPositions, loading: loadingProxyPositions } =
    usePositions(proxiedPositionKeys, true);
  const loadingFetchedPositions = loadingMyPositions || loadingProxyPositions
  const fetchedPositions = useMemo(() => {
    const uniquePositions = new Map();
    [...(myPositions || []), ...(proxiedPositions || [])].forEach(
      (position) => {
        if (position) {
          uniquePositions.set(position.publicKey.toBase58(), position);
        }
      }
    );
    return Array.from(uniquePositions.values());
  }, [myPositions, proxiedPositions]);

  const positions = useMemo(
    () => fetchedPositions?.map((fetched) => fetched.info),
    [fetchedPositions]
  );

  const { votingPower } = useMemo(() => {
    if (registrar && unixNow && positions && positions.length) {
      let votingPower = new BN(0);
      positions.forEach((position) => {
        votingPower = votingPower.add(
          calcPositionVotingPower({
            position: position!,
            registrar,
            unixNow: new BN(unixNow),
          })
        );
      });

      return {
        votingPower,
      };
    }

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  const prevPower = usePrevious(votingPower);
  const powerToDisplay = useMemo(() => {
    return votingPower && typeof decimals !== "undefined"
      ? abbreviateNumber(toNumber(votingPower, decimals))
      : "0";
  }, [votingPower, decimals]);

  const image = {
    [HNT_MINT.toBase58()]: { alt: "veHNT", src: "/images/vehnt.svg" },
    [MOBILE_MINT.toBase58()]: { alt: "veMOBILE", src: "/images/vemobile.svg" },
    [IOT_MINT.toBase58()]: { alt: "veIOT", src: "/images/veiot.svg" },
  }[mint.toBase58()];

  const loading = useMemo(() => {
    return !prevPower && (loadingPositionKeys || loadingFetchedPositions);
  }, [loadingPositionKeys, loadingFetchedPositions, prevPower]);

  return (
    <div className="flex flex-col items-center text-xs font-normal gap-1 pr-4 sm:border-r-2 sm:border-background">
      <span className="max-sm:hidden">{image.alt}</span>
      <div className="flex flex-col sm:flex-row items-center gap-1.5 text-sm font-medium">
        <div className="relative size-7">
          <Image alt={image.alt} src={image.src} fill />
        </div>
        {loading || powerToDisplay === "0" ? (
          <span>---</span>
        ) : (
          <span>{powerToDisplay}</span>
        )}
      </div>
    </div>
  );
};

export const VeTokensCallout: FC = () => {
  return (
    <div className="flex flex-row flex-grow gap-4 justify-end items-center">
      <VeTokenItem mint={HNT_MINT} />
      <VeTokenItem mint={MOBILE_MINT} />
      <VeTokenItem mint={IOT_MINT} />
    </div>
  );
};
