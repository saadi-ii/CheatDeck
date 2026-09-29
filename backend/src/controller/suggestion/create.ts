import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { Suggestion } from "../../model/suggestion.model.js";
import { memberOf } from "../../middleware/requireUser.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateSuggestion } from "../../validation/suggestion.schema.js";

/** Suggestions one member may submit per rolling 24 hours (spam protection). */
export const DAILY_SUGGESTION_LIMIT = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

/** A signed-in member proposes an edit to a block, or a new block in a section, of a published cheatsheet. */
export const create: RequestHandler = async (req, res) => {
  const member = memberOf(res);
  const body = req.body as CreateSuggestion;

  if (member.banned) throw new ApiError(403, "Your account can no longer submit suggestions");

  const recent = await Suggestion.countDocuments({ author: member.id, createdAt: { $gte: new Date(Date.now() - DAY_MS) } });
  if (recent >= DAILY_SUGGESTION_LIMIT) {
    throw new ApiError(429, `You can send up to ${DAILY_SUGGESTION_LIMIT} suggestions a day. Please try again tomorrow.`);
  }

  // Drafts don't exist as far as the public is concerned, so they can't be targeted either.
  const sheet = await Cheatsheet.findOne({ slug: body.cheatsheetSlug, published: true }).lean();
  if (!sheet) throw ApiError.notFound("Cheatsheet not found");

  const section = sheet.sections.find((s) => s.id === body.sectionId);
  if (!section) throw ApiError.badRequest("That section no longer exists");

  const common = {
    cheatsheetSlug: body.cheatsheetSlug,
    sectionId: body.sectionId,
    content: body.content,
    language: body.language,
    note: body.note,
    author: member.id,
  };

  if (body.type === "edit") {
    const block = section.blocks.find((b) => b.id === body.blockId);
    if (!block) throw ApiError.badRequest("That block no longer exists");

    const suggestion = await Suggestion.create({
      ...common,
      type: "edit",
      blockId: block.id,
      blockType: block.type, // an edit never changes the block's type
      baseContent: block.content ?? "",
    });
    res.status(201).json({ id: suggestion.id, status: suggestion.status });
    return;
  }

  const suggestion = await Suggestion.create({ ...common, type: "add", blockType: body.blockType });
  res.status(201).json({ id: suggestion.id, status: suggestion.status });
};
