import type { RequestHandler } from "express";
import { memberOf } from "../../middleware/requireUser.js";

/** Runs behind requireUser: the signed-in community member. */
export const me: RequestHandler = (_req, res) => {
  res.json(memberOf(res));
};
