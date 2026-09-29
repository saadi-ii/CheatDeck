/** A published cheatsheet not touched for this long is flagged for a check against the latest docs. */
export const STALE_AFTER_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isStale(updatedAt: string, now: number = Date.now()) {
  return now - new Date(updatedAt).getTime() > STALE_AFTER_DAYS * DAY_MS;
}
