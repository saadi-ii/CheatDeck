import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";
import { User } from "../../model/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

/** Admin: ban or unban a community member. Banned members can no longer submit suggestions. */
export const ban: RequestHandler<{ id: string }> = async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw ApiError.notFound("User not found");

  const user = await User.findByIdAndUpdate(req.params.id, { $set: { banned: req.body.banned } }, { new: true });
  if (!user) throw ApiError.notFound("User not found");

  res.json({ id: user.id, banned: user.banned });
};
