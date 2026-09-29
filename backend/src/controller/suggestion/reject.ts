import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";
import { Suggestion } from "../../model/suggestion.model.js";
import { ApiError } from "../../utils/ApiError.js";

/** Admin: decline a suggestion. The optional note is shown to its author. */
export const reject: RequestHandler<{ id: string }> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw ApiError.notFound("Suggestion not found");

  const suggestion = await Suggestion.findById(req.params.id);
  if (!suggestion) throw ApiError.notFound("Suggestion not found");
  if (suggestion.status !== "pending") throw ApiError.conflict("This suggestion was already reviewed");

  suggestion.status = "rejected";
  suggestion.reviewedAt = new Date();
  suggestion.reviewNote = req.body.note;
  await suggestion.save();

  res.json({ id: suggestion.id, status: suggestion.status });
};
