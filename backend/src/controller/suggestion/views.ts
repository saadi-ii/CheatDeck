import { Cheatsheet } from "../../model/cheatsheet.model.js";
import { User } from "../../model/user.model.js";
import { buildSuggestionViews, type SuggestionRecord } from "../../utils/suggestion-view.js";

/** Loads the cheatsheets and authors the given suggestions point at (2 queries) and builds their views. */
export async function toViews(suggestions: SuggestionRecord[]) {
  const slugs = [...new Set(suggestions.map((s) => s.cheatsheetSlug))];
  const authorIds = [...new Set(suggestions.map((s) => s.author.toString()))];

  const [cheatsheets, authors] = await Promise.all([
    Cheatsheet.find({ slug: { $in: slugs } }).lean(),
    User.find({ _id: { $in: authorIds } }).lean(),
  ]);

  return buildSuggestionViews(suggestions, cheatsheets, authors);
}
