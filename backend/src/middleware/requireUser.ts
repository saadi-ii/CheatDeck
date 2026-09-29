import { isValidObjectId } from "mongoose";
import type { RequestHandler, Response } from "express";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserId } from "../utils/userToken.js";

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  banned: boolean;
}

/** Loads the signed-in community member into res.locals (see memberOf). Banned members still load. */
export const requireUser: RequestHandler = async (req, res, next) => {
  const id = getUserId(req);
  const user = id && isValidObjectId(id) ? await User.findById(id) : null;
  if (!user) throw ApiError.unauthorized("Sign in to continue");

  res.locals.member = { id: user.id, name: user.name, avatarUrl: user.avatarUrl, banned: user.banned } satisfies Member;
  next();
};

export const memberOf = (res: Response) => res.locals.member as Member;
