import jwt from "jsonwebtoken";
import type { CookieOptions, Request } from "express";
import { env } from "../config/env.js";

export const COOKIE_NAME = "cheatdeck_token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
};

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, env.JWT_SECRET, { expiresIn: "7d" });
}

export const tokenCookieOptions: CookieOptions = { ...cookieOptions, maxAge: MAX_AGE_MS };

/** True when the request carries a valid admin token cookie. */
export function isAdmin(req: Request): boolean {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return false;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return typeof payload === "object" && payload.role === "admin";
  } catch {
    return false;
  }
}
