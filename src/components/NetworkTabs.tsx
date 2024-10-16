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
      "flex flex-col justify-end cursor-pointer text-slate-50 max-md:pr-1 hover:text-foreground",
      { "!text-foreground": active }
    )}
  >
    <div className="flex flex-row justify-center items-center gap-2 pl-2 pr-2 max-md:pl-1 max-md:pr-1">
      <div className="size-6 rounded-full relative">
        <Image alt={`${name} icon`} src={icon} fill />
      </div>
      <p className="text-md font-normal">{name}</p>
    </div>
    <div
      className={classNames("flex h-1 mt-5 max-md:mt-3", {
        "bg-primary": active,
      })}
    />
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
