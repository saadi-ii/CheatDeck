import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";

export const create: RequestHandler = async (req, res) => {
  const item = await Cheatsheet.create(req.body);
  res.status(201).json(item);
};
