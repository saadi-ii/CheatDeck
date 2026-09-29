import jwt from "jsonwebtoken";
import type { CookieOptions, Request } from "express";
import { env } from "../config/env.js";
import { cookieOptions } from "./token.js";

// Community members get their own cookie, separate from the admin one, so signing in
// as a user never replaces (or grants) an admin session.
export const USER_COOKIE = "cheatdeck_user";

export const userCookieOptions: CookieOptions = { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 };

export function signUserToken(userId: string) {
  return jwt.sign({ role: "user", sub: userId }, env.JWT_SECRET, { expiresIn: "30d" });
}

/** The signed-in member's id from the cookie, or null. Does not check the database (see requireUser). */
export function getUserId(req: Request): string | null {
  const token = req.cookies?.[USER_COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "object" && payload.role === "user" && typeof payload.sub === "string") return payload.sub;
    return null;
  } catch {
    return null;
  }
}
