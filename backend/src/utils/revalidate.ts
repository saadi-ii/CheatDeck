import { env } from "../config/env.js";

/**
 * Tells the Next.js frontend its cached cheatsheet pages are stale, so edits show up right away.
 * Never throws: a saved change must not fail because the frontend was unreachable
 * (the pages then simply refresh on their normal 60 second cycle).
 */
export async function notifyFrontend() {
  if (!env.REVALIDATE_SECRET) return;

  try {
    const res = await fetch(`${env.CLIENT_URL}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": env.REVALIDATE_SECRET },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) console.warn(`Frontend revalidate returned ${res.status}`);
  } catch (error) {
    console.warn("Frontend revalidate failed:", error instanceof Error ? error.message : error);
  }
}
