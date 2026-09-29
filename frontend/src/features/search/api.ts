import { request } from "@/lib/http";
import type { SearchHit } from "./types";

export const searchCheatsheets = (query: string, signal?: AbortSignal) =>
  request<SearchHit[]>(`/search?q=${encodeURIComponent(query)}`, { signal });
