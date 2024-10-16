"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBolt } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { LuScrollText } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { IconType } from "react-icons";
import { HiDotsVertical } from "react-icons/hi";
import { cn } from "@/lib/utils";

const icons: { [key: string]: IconType } = {
  proposals: LuScrollText,
  proxies: IoPerson,
  positions: FaBolt,
};

export const SubNav: React.FC = () => {
  const path = usePathname();
  const basePath = path.split("/").slice(0, 2).join("/");
  const currentPath = path.split("/")[2] || "proposals";

  return (
    <div>
      <div className="hidden md:block">
        <ToggleGroup
          variant="subNav"
          type="single"
          className="py-4 gap-2"
          value={currentPath}
        >
          <ToggleGroupItem value="proposals" aria-label="Proposals">
            <Link className="flex items-center gap-2 p-2" href={`${basePath}`}>
              <LuScrollText className="size-4" />
              Proposals
            </Link>
          </ToggleGroupItem>
          <ToggleGroupItem value="proxies" aria-label="Proxies">
            <Link
              className="flex items-center gap-2 p-2"
              href={`${basePath}/proxies`}
            >
              <IoPerson className="size-4" />
              Proxies
            </Link>
          </ToggleGroupItem>
          <ToggleGroupItem value="positions" aria-label="Positions">
            <Link
              className="flex items-center gap-2 p-2"
              href={`${basePath}/positions`}
            >
              <FaBolt className="size-4" />
              Positions
            </Link>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="md:hidden p-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button element="div" variant="secondary" className="bg-black/30">
              <HiDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem active={currentPath === "proposals"}>
                <Link
                  className={cn("flex items-center gap-2 p-2")}
                  href={`${basePath}`}
                >
                  <LuScrollText className="size-4" />
                  Proposals
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem active={currentPath === "proxies"}>
                <Link
                  className="flex items-center gap-2 p-2"
                  href={`${basePath}/proxies`}
                >
                  <IoPerson className="size-4" />
                  Proxies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem active={currentPath === "positions"}>
                <Link
                  className="flex items-center gap-2 p-2"
                  href={`${basePath}/positions`}
                >
                  <FaBolt className="size-4" />
                  Positions
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
