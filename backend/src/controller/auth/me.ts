import type { RequestHandler } from "express";

/** Runs behind requireAdmin, so reaching here means the session is valid. */
export const me: RequestHandler = (_req, res) => {
  res.json({ admin: true });
};
