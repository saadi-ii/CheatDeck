import type { RequestHandler } from "express";
import { configuredProviders } from "../../utils/oauth.js";

/** Which sign-in buttons the frontend should show (only providers with credentials set). */
export const providers: RequestHandler = (_req, res) => {
  res.json(configuredProviders());
};
