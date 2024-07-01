"use client"

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useNetwork } from "@/hooks/useNetwork";
import { useGovernance } from "@/providers/GovernanceProvider";

export const NetworkSelect: React.FC<{
  network?: string
  onNetworkChange: (network: string) => void
}> = ({ network, onNetworkChange }) => {
  const { network: networkDefault } = useGovernance();
  const networkValue = network ?? networkDefault

  return (
    <Select value={networkValue} onValueChange={onNetworkChange}>
      <SelectTrigger>
        <div className="flex flex-col items-start">
          <label className="text-[10px] leading-[14px] font-medium">
            Network
          </label>
          <SelectValue
            placeholder={
              <div className="text-muted-foreground">Select a Network</div>
            }
          />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="hnt">HNT</SelectItem>
          <SelectItem value="iot">IOT</SelectItem>
          <SelectItem value="mobile">MOBILE</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
