import { request } from "@/lib/http";
import type { Member, ProviderName } from "./types";

/** Rejects with ApiError 401 when nobody is signed in. */
export const getMember = () => request<Member>("/user/me");

export const signOut = () => request<{ signedOut: boolean }>("/user/logout", { method: "POST" });

/** The sign-in providers the server has credentials for. */
export const getProviders = () => request<ProviderName[]>("/oauth/providers");

/** Full-page navigation target that starts the provider flow, then returns to `next`. */
export const signInUrl = (provider: ProviderName, next: string) =>
  `/api/oauth/${provider}?next=${encodeURIComponent(next)}`;
