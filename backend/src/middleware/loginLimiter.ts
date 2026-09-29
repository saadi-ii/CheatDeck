import type { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

const attempts = new Map<string, { count: number; resetAt: number }>();

/** Small in-memory limiter for the login route (per IP, resets on restart). */
export const loginLimiter: RequestHandler = (req, _res, next) => {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    throw new ApiError(429, "Too many login attempts, try again later");
  }
  next();
};
