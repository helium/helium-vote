import { parseGovNetwork } from "@/lib/constants";
import { notFound } from "next/navigation";
import React from "react";

const NetworkLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { network: string };
}) => {
  if (!parseGovNetwork(params.network)) notFound();
  return <>{children}</>;
};

export default NetworkLayout;
