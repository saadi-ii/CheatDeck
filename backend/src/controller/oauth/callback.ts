import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { User } from "../../model/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { completeOAuth, isConfigured, isProvider, safeNext } from "../../utils/oauth.js";
import { cookieOptions } from "../../utils/token.js";
import { signUserToken, USER_COOKIE, userCookieOptions } from "../../utils/userToken.js";
import { OAUTH_NEXT_COOKIE, OAUTH_STATE_COOKIE } from "./cookies.js";

const sameSecret = (a: string, b: string) => a.length > 0 && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Where the provider sends the visitor back to. Signs them in and returns them to the page they came from. */
export const callback: RequestHandler<{ provider: string }> = async (req, res) => {
  const { provider } = req.params;
  if (!isProvider(provider) || !isConfigured(provider)) throw ApiError.notFound("Unknown sign-in provider");

  const savedState = String(req.cookies?.[OAUTH_STATE_COOKIE] ?? "");
  const next = safeNext(req.cookies?.[OAUTH_NEXT_COOKIE]);
  res.clearCookie(OAUTH_STATE_COOKIE, cookieOptions);
  res.clearCookie(OAUTH_NEXT_COOKIE, cookieOptions);

  const failed = () => res.redirect(`${next}${next.includes("?") ? "&" : "?"}signin=failed`);

  const code = typeof req.query.code === "string" ? req.query.code : "";
  // The state must match the cookie we set when the flow started (CSRF protection).
  if (req.query.error || !code || !sameSecret(String(req.query.state ?? ""), savedState)) {
    failed();
    return;
  }

  try {
    const profile = await completeOAuth(provider, code);
    const user = await User.findOneAndUpdate(
      { provider, providerId: profile.providerId },
      { $set: { name: profile.name, avatarUrl: profile.avatarUrl } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.cookie(USER_COOKIE, signUserToken(user.id), userCookieOptions);
    res.redirect(next);
  } catch (error) {
    console.warn("OAuth sign-in failed:", error instanceof Error ? error.message : error);
    failed();
  }
};
