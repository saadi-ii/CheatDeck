import type { CookieOptions } from "express";
import { cookieOptions } from "../../utils/token.js";

// Short-lived cookies that carry the CSRF "state" and the destination across the provider round trip.
export const OAUTH_STATE_COOKIE = "cheatdeck_oauth_state";
export const OAUTH_NEXT_COOKIE = "cheatdeck_oauth_next";

export const oauthCookieOptions: CookieOptions = { ...cookieOptions, maxAge: 10 * 60 * 1000 };
