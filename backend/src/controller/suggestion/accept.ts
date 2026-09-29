import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { Suggestion } from "../../model/suggestion.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { notifyFrontend } from "../../utils/revalidate.js";
import { applySuggestion } from "../../utils/suggestions.js";

/** Admin: copy the suggestion into the live cheatsheet and mark it accepted. */
export const accept: RequestHandler<{ id: string }> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw ApiError.notFound("Suggestion not found");

  const suggestion = await Suggestion.findById(req.params.id);
  if (!suggestion) throw ApiError.notFound("Suggestion not found");
  if (suggestion.status !== "pending") throw ApiError.conflict("This suggestion was already reviewed");

  const sheet = await Cheatsheet.findOne({ slug: suggestion.cheatsheetSlug });
  if (!sheet) throw ApiError.conflict("The cheatsheet no longer exists");

  const sections = applySuggestion(sheet.toObject().sections, {
    type: suggestion.type,
    sectionId: suggestion.sectionId,
    blockId: suggestion.blockId,
    blockType: suggestion.blockType,
    content: suggestion.content,
    language: suggestion.language,
  });
  if (!sections) throw ApiError.conflict("The section or block this points at no longer exists");

  sheet.set("sections", sections);
  await sheet.save();

  suggestion.status = "accepted";
  suggestion.reviewedAt = new Date();
  suggestion.reviewNote = req.body.note;
  await suggestion.save();

  await notifyFrontend();
  res.json({ id: suggestion.id, status: suggestion.status });
};
