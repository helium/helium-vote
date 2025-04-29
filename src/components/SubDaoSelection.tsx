"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import { PublicKey } from "@solana/web3.js";
import classNames from "classnames";
import Image from "next/image";
import React, { FC } from "react";
import { Skeleton } from "./ui/skeleton";
import { truthy } from "@helium/spl-utils";
import { MOBILE_SUB_DAO_KEY } from "@/lib/constants";

export const SubDaoSelection: FC<{
  hideNoneOption?: boolean;
  selectedSubDaoPk?: PublicKey | null;
  onSelect: (subDao?: PublicKey) => void;
}> = ({ hideNoneOption, selectedSubDaoPk, onSelect }) => {
  const { loading, subDaos } = useGovernance();

  if (loading) {
    return (
      <div className="flex flex-row max-md:flex-col gap-2">
        {[...Array(hideNoneOption ? 2 : 3)].map((_, i) => (
          <div key={`subDaoSelectionSkeleton-${i}`} className="flex">
            <Skeleton
              key={i}
              className="h-32 bg-background flex-1 rounded-md"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {subDaos && (
        <div className="flex flex-row max-md:flex-col gap-2">
          {!hideNoneOption && (
            <div
              className={classNames(
                "flex flex-row flex-1 justify-center items-center py-4 rounded-md  bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
                !selectedSubDaoPk &&
                  "!bg-info !border-info-foreground font-medium"
              )}
              onClick={() => onSelect(undefined)}
            >
              <div className="flex flex-col gap-1 justify-center items-center">
                <div className="size-12 rounded-full relative">
                  <Image alt="hnt" src="/images/hnt.svg" fill />
                </div>
                None
              </div>
            </div>
          )}
          {subDaos
            ?.sort((a, b) =>
              b.dntMetadata.name.localeCompare(a.dntMetadata.name)
            )
            .map((subDao, i) => (
              <div
                key={subDao.pubkey.toString()}
                className={classNames(
                  "flex flex-row flex-1 justify-center items-center py-4 rounded-md bg-slate-600 cursor-pointer border-2 border-transparent hover:bg-opacity-80 active:bg-opacity-70",
                  selectedSubDaoPk?.equals(subDao.pubkey) &&
                    "!bg-info !border-info-foreground font-medium"
                )}
                onClick={() => onSelect(subDao.pubkey)}
              >
                <div className="flex flex-col justify-center items-center">
                  <div className="size-12 rounded-full relative">
                    <Image
                      alt={subDao.dntMetadata.json?.name}
                      src={subDao.dntMetadata.json?.image}
                      fill
                    />
                  </div>
                  {subDao.dntMetadata.symbol
                    ? subDao.dntMetadata.symbol.replace(/\u0000/g, "")
                    : ""}
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
