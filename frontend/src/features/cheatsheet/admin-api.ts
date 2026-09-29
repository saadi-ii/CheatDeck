import { request } from "@/lib/http";
import { isStale } from "./lib/freshness";
import type { Cheatsheet, CheatsheetInput, CheatsheetSummary } from "./types";

// Browser-side calls. The admin cookie is sent automatically (same-origin /api),
// so these also return drafts, unlike the cached public reads in api.ts.

const path = (slug: string) => `/cheatsheets/${encodeURIComponent(slug)}`;

export type AdminSummary = CheatsheetSummary & { stale: boolean };

/** Computed here (not while rendering) so the table stays a pure function of its data. */
export const adminList = async (): Promise<AdminSummary[]> => {
  const items = await request<CheatsheetSummary[]>("/cheatsheets");
  const now = Date.now();
  return items.map((item) => ({ ...item, stale: item.published && isStale(item.updatedAt, now) }));
};

export const adminGet = (slug: string) => request<Cheatsheet>(path(slug));

export const createCheatsheet = (body: CheatsheetInput) =>
  request<Cheatsheet>("/cheatsheets", { method: "POST", body: JSON.stringify(body) });

export const saveCheatsheet = (slug: string, body: CheatsheetInput) =>
  request<Cheatsheet>(path(slug), { method: "PUT", body: JSON.stringify(body) });

export const deleteCheatsheet = (slug: string) => request<void>(path(slug), { method: "DELETE" });
