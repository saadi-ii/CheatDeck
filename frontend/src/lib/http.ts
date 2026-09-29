export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Server code calls Express directly; the browser uses the same-origin /api rewrite
// (see next.config.ts) so the admin cookie is first-party.
const baseUrl = () => (typeof window === "undefined" ? `${API_URL}/api` : "/api");

export interface ApiIssue {
  path: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public issues: ApiIssue[] = [],
  ) {
    super(message);
  }
}

/** Thin fetch wrapper for the Express API. Throws ApiError on non-2xx responses. */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");

  const res = await fetch(`${baseUrl()}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = res.statusText;
    let issues: ApiIssue[] = [];
    try {
      const body = await res.json();
      message = body.message ?? message;
      issues = body.issues ?? [];
    } catch {
      // body was not JSON, keep statusText
    }
    throw new ApiError(res.status, message, issues);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
