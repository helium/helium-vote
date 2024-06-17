import { ellipsisMiddle } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useMemo, useState } from "react";
import { AutoComplete } from "./ui/autocomplete";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { proxiesQuery } from "@helium/voter-stake-registry-hooks";

export const ProxySearch: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
}> = ({ value, onValueChange }) => {
  const [input, setInput] = useState<string>(value);
  const debouncedInput = useDebounce(input, 300);
  const { data: resultPaged, isLoading, error } = useInfiniteQuery(
    proxiesQuery({
      search: debouncedInput || "",
      amountPerPage: 20,
    })
  );

  const result = useMemo(() => {
    const resultsAsOptions =
      resultPaged?.pages.flat().map((r) => {
        return {
          value: r.wallet,
          label: `${r.name} | ${ellipsisMiddle(r.wallet)}`,
        };
      }) || [];
    if (isValidPublicKey(debouncedInput)) {
      resultsAsOptions.push({
        value: debouncedInput || "",
        label: debouncedInput || "",
      });
    }
    return resultsAsOptions;
  }, [resultPaged, debouncedInput]);
  const selectedOption = useMemo(() => {
    return result?.find((r) => r.value == value);
  }, [result, value])

  if (value && !selectedOption) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  return (
    <AutoComplete
      options={result || []}
      emptyMessage="No results."
      placeholder="Find proxy voter"
      isLoading={isLoading}
      onValueChange={(v) => onValueChange(v.value)}
      value={selectedOption}
      onInputChange={setInput}
    />
  );
};

function isValidPublicKey(input: string | undefined) {
  try {
    new PublicKey(input || "");
    return true;
  } catch (e) {
    return false;
  }
}
