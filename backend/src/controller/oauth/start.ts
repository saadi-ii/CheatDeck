import { randomBytes } from "node:crypto";
import type { RequestHandler } from "express";
import { ApiError } from "../../utils/ApiError.js";
import { buildAuthorizeUrl, isConfigured, isProvider, safeNext } from "../../utils/oauth.js";
import { OAUTH_NEXT_COOKIE, OAUTH_STATE_COOKIE, oauthCookieOptions } from "./cookies.js";

/** Sends the visitor to GitHub/Google. `?next=/path` says where to land afterwards. */
export const start: RequestHandler<{ provider: string }> = (req, res) => {
  const { provider } = req.params;
  if (!isProvider(provider) || !isConfigured(provider)) throw ApiError.notFound("Unknown sign-in provider");

  const state = randomBytes(16).toString("hex");
  res.cookie(OAUTH_STATE_COOKIE, state, oauthCookieOptions);
  res.cookie(OAUTH_NEXT_COOKIE, safeNext(req.query.next), oauthCookieOptions);
  res.redirect(buildAuthorizeUrl(provider, state));
};
