import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { notifyFrontend } from "../../utils/revalidate.js";

/** Full save: the body replaces the document's editable fields (slug included). */
export const update: RequestHandler<{ slug: string }> = async (req, res) => {
  const item = await Cheatsheet.findOneAndUpdate(
    { slug: req.params.slug },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!item) throw ApiError.notFound("Cheatsheet not found");

  await notifyFrontend();
  res.json(item);
};
