import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export function useQueryString<A>(
  key: string,
  initialValue: A
): [A, (v: A) => void] {
  const { query, replace } = useRouter()
  const onSetValue = useCallback(
    (newValue: any) => {
      replace({ query: { ...query, [key]: newValue } })
    },
    [key]
  );

  return [(query[key] || initialValue) as A, onSetValue];
}
