import { request } from "@/lib/http";
import type { Cheatsheet, CheatsheetInput, CheatsheetSummary } from "./types";

// Browser-side calls. The admin cookie is sent automatically (same-origin /api),
// so these also return drafts, unlike the cached public reads in api.ts.

const path = (slug: string) => `/cheatsheets/${encodeURIComponent(slug)}`;

export const adminList = () => request<CheatsheetSummary[]>("/cheatsheets");

export const adminGet = (slug: string) => request<Cheatsheet>(path(slug));

export const createCheatsheet = (body: CheatsheetInput) =>
  request<Cheatsheet>("/cheatsheets", { method: "POST", body: JSON.stringify(body) });

export const saveCheatsheet = (slug: string, body: CheatsheetInput) =>
  request<Cheatsheet>(path(slug), { method: "PUT", body: JSON.stringify(body) });

export const deleteCheatsheet = (slug: string) => request<void>(path(slug), { method: "DELETE" });
