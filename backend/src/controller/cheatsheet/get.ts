import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { isAdmin } from "../../utils/token.js";

export const get: RequestHandler<{ slug: string }> = async (req, res) => {
  const item = await Cheatsheet.findOne({ slug: req.params.slug });

  // Drafts look like they don't exist to the public.
  if (!item || (!item.published && !isAdmin(req))) throw ApiError.notFound("Cheatsheet not found");

  res.json(item);
};
