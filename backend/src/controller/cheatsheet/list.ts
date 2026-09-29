import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { isAdmin } from "../../utils/token.js";

/** Summaries only (no sections). Drafts are visible to admins only. */
export const list: RequestHandler = async (req, res) => {
  const filter = isAdmin(req) ? {} : { published: true };

  const items = await Cheatsheet.find(filter)
    .select("slug title icon description version published updatedAt")
    .sort({ title: 1 });

  res.json(items);
};
