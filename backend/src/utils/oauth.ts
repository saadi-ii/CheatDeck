import { env } from "../config/env.js";

// Minimal OAuth 2.0 "authorization code" flow for GitHub and Google. Every network call goes
// through an injectable fetch so the whole flow can be tested without real credentials.

export type ProviderName = "github" | "google";
type FetchFn = typeof fetch;

export interface OAuthProfile {
  providerId: string;
  name: string;
  avatarUrl: string;
}

interface ProviderDef {
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  credentials: () => { id: string; secret: string } | null;
  fetchProfile: (accessToken: string, fetchFn: FetchFn) => Promise<OAuthProfile>;
}

const TIMEOUT_MS = 8000;

async function getJson(fetchFn: FetchFn, url: string, headers: Record<string, string>) {
  const res = await fetchFn(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Profile request failed (${res.status})`);
  return res.json() as Promise<Record<string, unknown>>;
}

/** Trims, strips control characters and caps the length of a display name coming from a provider. */
function cleanName(value: unknown) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 60);
}

/** Avatars are rendered in <img>, so only accept plain https URLs. */
function cleanAvatar(value: unknown) {
  return typeof value === "string" && /^https:\/\/[^\s]+$/.test(value) && value.length < 500 ? value : "";
}

const providers: Record<ProviderName, ProviderDef> = {
  github: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scope: "read:user",
    credentials: () =>
      env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET ? { id: env.GITHUB_CLIENT_ID, secret: env.GITHUB_CLIENT_SECRET } : null,
    async fetchProfile(token, fetchFn) {
      const data = await getJson(fetchFn, "https://api.github.com/user", {
        authorization: `Bearer ${token}`,
        accept: "application/vnd.github+json",
        "user-agent": "cheatdeck",
      });
      return { providerId: String(data.id ?? ""), name: cleanName(data.name || data.login), avatarUrl: cleanAvatar(data.avatar_url) };
    },
  },
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scope: "openid profile",
    credentials: () =>
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? { id: env.GOOGLE_CLIENT_ID, secret: env.GOOGLE_CLIENT_SECRET } : null,
    async fetchProfile(token, fetchFn) {
      const data = await getJson(fetchFn, "https://openidconnect.googleapis.com/v1/userinfo", { authorization: `Bearer ${token}` });
      return { providerId: String(data.sub ?? ""), name: cleanName(data.name), avatarUrl: cleanAvatar(data.picture) };
    },
  },
};

export const isProvider = (value: string): value is ProviderName => Object.hasOwn(providers, value);

export const isConfigured = (name: ProviderName) => providers[name].credentials() !== null;

export const configuredProviders = () => (Object.keys(providers) as ProviderName[]).filter(isConfigured);

/**
 * The URL registered with the provider. It points at the FRONTEND origin (Next proxies /api to
 * Express), so the cookie set on return belongs to the site the visitor is actually on.
 */
export const callbackUrl = (name: ProviderName) => `${env.CLIENT_URL}/api/oauth/${name}/callback`;

export function buildAuthorizeUrl(name: ProviderName, state: string) {
  const def = providers[name];
  const creds = def.credentials();
  if (!creds) throw new Error(`${name} sign-in is not configured`);

  const url = new URL(def.authorizeUrl);
  url.searchParams.set("client_id", creds.id);
  url.searchParams.set("redirect_uri", callbackUrl(name));
  url.searchParams.set("scope", def.scope);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

/** Exchanges the authorization code for a token, then loads the member's public profile. */
export async function completeOAuth(name: ProviderName, code: string, fetchFn: FetchFn = fetch): Promise<OAuthProfile> {
  const def = providers[name];
  const creds = def.credentials();
  if (!creds) throw new Error(`${name} sign-in is not configured`);

  const res = await fetchFn(def.tokenUrl, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.id,
      client_secret: creds.secret,
      code,
      redirect_uri: callbackUrl(name),
      grant_type: "authorization_code",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // GitHub answers 200 with an "error" field when the code is bad, so check the token itself.
  const data = (await res.json().catch(() => ({}))) as { access_token?: unknown };
  if (!res.ok || typeof data.access_token !== "string") throw new Error("Token exchange failed");

  const profile = await def.fetchProfile(data.access_token, fetchFn);
  if (!profile.providerId) throw new Error("Provider returned no user id");
  return profile;
}

/** Only allow same-site relative paths as a post-login destination (blocks open redirects). */
export function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (/[\u0000-\u001F]/.test(value) || value.length > 300) return "/";
  return value;
}
