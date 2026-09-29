import type { RequestHandler } from "express";
import { Suggestion } from "../../model/suggestion.model.js";
import { memberOf } from "../../middleware/requireUser.js";
import { toViews } from "./views.js";

/** The signed-in member's own suggestions, newest first, with their review status. */
export const mine: RequestHandler = async (_req, res) => {
  const suggestions = await Suggestion.find({ author: memberOf(res).id }).sort({ createdAt: -1 }).limit(50).lean();
  res.json(await toViews(suggestions));
};
