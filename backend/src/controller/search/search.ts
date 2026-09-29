import type { RequestHandler } from "express";
import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { buildHits, escapeRegex } from "../../utils/search.js";

const MIN_LENGTH = 2;
const MAX_LENGTH = 50;

/**
 * Public search over published cheatsheets. A case-insensitive substring match, so typing
 * "rout" finds "Routing" (a Mongo text index only matches whole words). That is plenty
 * for a personal site and needs no extra index.
 */
export const search: RequestHandler = async (req, res) => {
  const query = String(req.query.q ?? "").trim().slice(0, MAX_LENGTH);
  if (query.length < MIN_LENGTH) {
    res.json([]);
    return;
  }

  const pattern = new RegExp(escapeRegex(query), "i");

  const docs = await Cheatsheet.find({
    published: true,
    $or: [
      { title: pattern },
      { description: pattern },
      { "sections.title": pattern },
      { "sections.blocks.content": pattern },
    ],
  })
    .limit(20)
    .lean();

  res.json(buildHits(docs, query));
};
