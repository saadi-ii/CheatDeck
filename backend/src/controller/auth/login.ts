import { createHash, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import { COOKIE_NAME, signAdminToken, tokenCookieOptions } from "../../utils/token.js";

const sha256 = (value: string) => createHash("sha256").update(value).digest();

export const login: RequestHandler = (req, res) => {
  const { password } = req.body as { password: string };

  // Hash both sides so lengths match and the compare is constant-time.
  if (!timingSafeEqual(sha256(password), sha256(env.ADMIN_PASSWORD))) {
    throw ApiError.unauthorized("Wrong password");
  }

  res.cookie(COOKIE_NAME, signAdminToken(), tokenCookieOptions);
  res.json({ admin: true });
};
