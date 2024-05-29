import React, { useMemo, useState } from "react";
import { AutoComplete, Option } from "./ui/autocomplete";
import { useAsync } from "react-async-hook";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { debounce, ellipsisMiddle } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const ProxySearch: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
}> = ({ value, onValueChange }) => {
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState<string>();
  const { voteService } = useHeliumVsrState();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string | undefined) => {
        setLoading(true);
        try {
          const results = await voteService?.searchProxies({
            query: query || "",
          });

          const resultsAsOptions =
            results?.map((r) => {
              return {
                value: r.wallet,
                label: `${r.name} | ${ellipsisMiddle(r.wallet)}`,
              };
            }) || [];

          if (isValidPublicKey(query)) {
            resultsAsOptions.push({
              value: query || "",
              label: query || "",
            });
          }

          return resultsAsOptions;
        } finally {
          setLoading(false);
        }
      }, 300),
    [voteService]
  );

  const { result } = useAsync(debouncedSearch, [input]);

  return result ? (
    <AutoComplete
      options={result || []}
      emptyMessage="No results."
      placeholder="Find proxy voter"
      isLoading={isLoading}
      onValueChange={(v) => onValueChange(v.value)}
      value={result?.find((r) => r.value == value)}
      onInputChange={setInput}
    />
  ) : (
    <Loader2 className="size-4 animate-spin" />
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
