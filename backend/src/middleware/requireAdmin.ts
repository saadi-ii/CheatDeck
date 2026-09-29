import type { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";
import { isAdmin } from "../utils/token.js";

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!isAdmin(req)) throw ApiError.unauthorized();
  next();
};
