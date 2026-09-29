import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const remove: RequestHandler<{ slug: string }> = async (req, res) => {
  const result = await Cheatsheet.deleteOne({ slug: req.params.slug });

  if (result.deletedCount === 0) throw ApiError.notFound("Cheatsheet not found");

  res.status(204).end();
};
