import { request } from "@/lib/http";

interface Session {
  admin: boolean;
}

export const login = (password: string) =>
  request<Session>("/auth/login", { method: "POST", body: JSON.stringify({ password }) });

export const logout = () => request<Session>("/auth/logout", { method: "POST" });

/** Resolves when the cookie is a valid admin session, rejects with ApiError 401 otherwise. */
export const getSession = () => request<Session>("/auth/me");
