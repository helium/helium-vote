"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const NetworkTab: FC<{
  active: boolean;
  name: string;
  href: string;
  icon: string;
}> = ({ active, name, href, icon }) => (
  <Link
    href={href}
    className={classNames(
      "flex flex-col justify-end cursor-pointer text-slate-50 hover:text-foreground",
      { "!text-foreground": active }
    )}
  >
    <div className="flex flex-row justify-cente items-center gap-4 max-md:gap-2">
      <div className="size-8 rounded-full relative">
        <Image alt={`${name} icon`} src={icon} fill />
      </div>
      <p className="pr-4">{name}</p>
    </div>
    <div className={classNames("flex h-1 mt-4", { "bg-primary": active })} />
  </Link>
);

export const NetworkTabs: FC<{ route?: string }> = ({
  route = "/$network",
}) => {
  const { network } = useGovernance();

  return (
    <div className="flex flex-row flex-grow gap-6 max-md:gap-1">
      <NetworkTab
        active={network === "hnt"}
        name="HNT"
        href={route.replace("$network", "hnt")}
        icon="/images/hnt.svg"
      />
      <NetworkTab
        active={network === "mobile"}
        name="MOBILE"
        href={route.replace("$network", "mobile")}
        icon="/images/mobile.svg"
      />
      <NetworkTab
        active={network === "iot"}
        name="IOT"
        href={route.replace("$network", "iot")}
        icon="/images/iot.svg"
      />
    </div>
  );
};
