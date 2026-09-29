import { request } from "@/lib/http";
import type { SuggestionInput, SuggestionStatus, SuggestionView } from "./types";

const post = <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) });

// ---- community members
export const createSuggestion = (input: SuggestionInput) =>
  post<{ id: string; status: SuggestionStatus }>("/suggestions", input);

export const mySuggestions = () => request<SuggestionView[]>("/suggestions/mine");

// ---- admin review
export const adminSuggestions = (status: SuggestionStatus = "pending") =>
  request<SuggestionView[]>(`/suggestions?status=${status}`);

export const acceptSuggestion = (id: string, note = "") =>
  post<{ id: string; status: SuggestionStatus }>(`/suggestions/${id}/accept`, { note });

export const rejectSuggestion = (id: string, note = "") =>
  post<{ id: string; status: SuggestionStatus }>(`/suggestions/${id}/reject`, { note });

export const setUserBanned = (userId: string, banned: boolean) =>
  post<{ id: string; banned: boolean }>(`/user/${userId}/ban`, { banned });
