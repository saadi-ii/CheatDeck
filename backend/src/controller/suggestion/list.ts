import type { RequestHandler } from "express";
import { Suggestion, SUGGESTION_STATUSES } from "../../model/suggestion.model.js";
import { toViews } from "./views.js";

/** Admin review queue. ?status=pending (default) | accepted | rejected. Pending is oldest first. */
export const list: RequestHandler = async (req, res) => {
  const requested = String(req.query.status ?? "pending");
  const status = SUGGESTION_STATUSES.find((s) => s === requested) ?? "pending";

  const suggestions = await Suggestion.find({ status })
    .sort({ createdAt: status === "pending" ? 1 : -1 })
    .limit(100)
    .lean();

  res.json(await toViews(suggestions));
};
