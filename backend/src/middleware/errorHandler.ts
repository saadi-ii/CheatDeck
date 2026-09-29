import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const notFound: RequestHandler = (_req, _res, next) => {
  next(ApiError.notFound("Route not found"));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Mongo duplicate key (unique slug)
  if (err?.code === 11000) {
    res.status(409).json({ message: "A cheatsheet with this slug already exists" });
    return;
  }

  // Malformed JSON body
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "Invalid JSON" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
