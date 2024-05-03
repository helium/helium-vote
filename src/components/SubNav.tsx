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
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { IconType } from "react-icons";

const icons: { [key: string]: IconType } = {
  proposals: LuScrollText,
  proxies: IoPerson,
  positions: FaBolt,
};

export const SubNav: React.FC = () => {
  const path = usePathname();
  const basePath = path.split("/").slice(0, 2).join("/");
  const currentPath = path.split("/")[2] || "proposals";
  const Icon = icons[currentPath];

  return (
    <div>
      <div className="hidden md:block">
        <ToggleGroup type="single" className="p-2" value={currentPath}>
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-black/30">
              <Icon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <Link
                className="flex items-center gap-2 p-2"
                href={`${basePath}`}
              >
                <LuScrollText className="size-4" />
                Proposals
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <Link
                className="flex items-center gap-2 p-2"
                href={`${basePath}/proxies`}
              >
                <IoPerson className="size-4" />
                Proxies
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <Link
                className="flex items-center gap-2 p-2"
                href={`${basePath}/positions`}
              >
                <FaBolt className="size-4" />
                Positions
              </Link>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
