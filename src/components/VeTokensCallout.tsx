"use client";

import { usePrevious } from "@/hooks/usePrevious";
import { abbreviateNumber } from "@/lib/utils";
import {
  useAnchorProvider,
  useMint,
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import { HNT_MINT, IOT_MINT, MOBILE_MINT, toNumber } from "@helium/spl-utils";
import {
  calcPositionVotingPower,
  getPositionKeys,
  getRegistrarKey,
  usePositions,
  useRegistrar,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Image from "next/image";
import React, { FC, useMemo } from "react";
import { useAsync } from "react-async-hook";

const VeTokenItem: FC<{ mint: PublicKey }> = ({ mint }) => {
  const provider = useAnchorProvider();
  const { wallet, connection } = provider || {};
  const unixNow = useSolanaUnixNow() || Date.now() / 1000;
  const decimals = useMint(mint)?.info?.decimals;
  const registrarKey = useMemo(
    () => mint && getRegistrarKey(mint),
    [mint?.toBase58()]
  );
  const { info: registrar } = useRegistrar(registrarKey);

  const args = useMemo(
    () =>
      wallet &&
      mint &&
      connection && {
        wallet: wallet.publicKey,
        mint,
        provider,
      },
    [wallet?.publicKey?.toBase58(), mint.toBase58(), connection, provider]
  );

  const { result, loading: loadingPositionKeys } = useAsync(
    async (args: any | undefined) => {
      if (args) {
        return getPositionKeys(args);
      }
    },
    [args]
  );

  const { loading: loadingFetchedPositions, accounts: fetchedPositions } =
    usePositions(result?.positionKeys);

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
      <div className="flex flex-col sm:flex-row items-center gap-1 text-base font-bold">
        <div className="relative size-8">
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
