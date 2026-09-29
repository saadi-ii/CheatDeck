import type { RequestHandler } from "express";
import { cookieOptions } from "../../utils/token.js";
import { USER_COOKIE } from "../../utils/userToken.js";

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(USER_COOKIE, cookieOptions);
  res.json({ signedOut: true });
};
