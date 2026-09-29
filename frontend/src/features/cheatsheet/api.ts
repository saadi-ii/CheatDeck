import { ApiError, request } from "@/lib/http";
import type { Cheatsheet, CheatsheetSummary } from "./types";

/** Cache tag on every public read; the revalidate route invalidates it after an admin change. */
export const CHEATSHEETS_TAG = "cheatsheets";

// Public reads: cached for a minute as a safety net, and revalidated on demand after saves.
const cache = { next: { revalidate: 60, tags: [CHEATSHEETS_TAG] } } satisfies RequestInit;

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
