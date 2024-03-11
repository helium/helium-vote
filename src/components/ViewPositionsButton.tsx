"use client";

import { FaBolt } from "react-icons/fa6";
import Link from "next/link";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export const ViewPositionsButton: FC<{ className: string }> = ({
  className = "",
}) => {
  const path = usePathname();

  return (
    <Link href={`${path}/positions`}>
      <Button variant="secondary" className={classNames("gap-2", className)}>
        <FaBolt className="hidden max-md:flex size-4" />
        <span className="max-md:hidden">View Positions</span>
      </Button>
    </Link>
  );
};
