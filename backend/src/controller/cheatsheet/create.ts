import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { notifyFrontend } from "../../utils/revalidate.js";

export const create: RequestHandler = async (req, res) => {
  const item = await Cheatsheet.create(req.body);
  await notifyFrontend();
  res.status(201).json(item);
};
