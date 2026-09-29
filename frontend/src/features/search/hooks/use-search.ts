"use client";

import { useEffect, useState } from "react";
import { searchCheatsheets } from "../api";
import type { SearchHit } from "../types";

export const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 200;

interface Result {
  query: string;
  hits: SearchHit[];
  failed: boolean;
}

/** Debounced search. Older requests are aborted, and the last hits stay visible while the next load. */
export function useSearch(input: string) {
  const [result, setResult] = useState<Result>({ query: "", hits: [], failed: false });
  const query = input.trim();
  const enabled = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchCheatsheets(query, controller.signal)
        .then((hits) => setResult({ query, hits, failed: false }))
        .catch(() => {
          if (!controller.signal.aborted) setResult({ query, hits: [], failed: true });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled]);

  return {
    enabled,
    hits: enabled ? result.hits : [],
    loading: enabled && result.query !== query,
    failed: enabled && result.query === query && result.failed,
  };
}
