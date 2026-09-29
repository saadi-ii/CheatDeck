import type { RequestHandler } from "express";
import { COOKIE_NAME, cookieOptions } from "../../utils/token.js";

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ admin: false });
};
