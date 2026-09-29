import { ApiError, request } from "@/lib/http";
import type { Cheatsheet, CheatsheetSummary } from "./types";

// Public reads: cached for a minute, tagged so Phase 5 can revalidate on save.
const cache = { next: { revalidate: 60, tags: ["cheatsheets"] } } satisfies RequestInit;

export function getCheatsheets() {
  return request<CheatsheetSummary[]>("/cheatsheets", cache);
}

/** Returns null when the cheatsheet doesn't exist (or is a draft). */
export async function getCheatsheet(slug: string) {
  try {
    return await request<Cheatsheet>(`/cheatsheets/${encodeURIComponent(slug)}`, cache);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
