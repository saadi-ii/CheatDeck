import type { SectionLike } from "./suggestions.js";

// Builds what the review queue and "my suggestions" list show: each suggestion joined with its
// cheatsheet, section, current block content and author. Pure, so it is easy to test.

export interface SuggestionRecord {
  _id: { toString(): string };
  type: "edit" | "add";
  status: "pending" | "accepted" | "rejected";
  cheatsheetSlug: string;
  sectionId: string;
  blockId?: string | null;
  blockType: "text" | "code";
  content: string;
  language?: string | null;
  baseContent?: string | null;
  note?: string | null;
  author: { toString(): string };
  createdAt?: Date | string;
  reviewedAt?: Date | string | null;
  reviewNote?: string | null;
}

export interface CheatsheetRecord {
  slug: string;
  title: string;
  sections: SectionLike[];
}

export interface AuthorRecord {
  _id: { toString(): string };
  name?: string | null;
  banned?: boolean | null;
}

export interface SuggestionView {
  id: string;
  type: "edit" | "add";
  status: "pending" | "accepted" | "rejected";
  cheatsheetSlug: string;
  cheatsheetTitle: string | null;
  sectionId: string;
  sectionTitle: string | null;
  blockId: string | null;
  blockType: "text" | "code";
  content: string;
  language: string | null;
  note: string;
  reviewNote: string;
  createdAt: string | null;
  reviewedAt: string | null;
  author: { id: string; name: string; banned: boolean };
  /** "edit" only: the block's content right now, or null if the block is gone. */
  currentContent: string | null;
  /** True when the cheatsheet, section or block this points at no longer exists (can't be accepted). */
  targetMissing: boolean;
  /** "edit" only: the block changed after the member wrote their suggestion, so the diff may be stale. */
  changedSinceSuggested: boolean;
}

const iso = (value?: Date | string | null) => (value ? new Date(value).toISOString() : null);

export function buildSuggestionViews(
  suggestions: SuggestionRecord[],
  cheatsheets: CheatsheetRecord[],
  authors: AuthorRecord[],
): SuggestionView[] {
  const sheetBySlug = new Map(cheatsheets.map((sheet) => [sheet.slug, sheet]));
  const authorById = new Map(authors.map((author) => [author._id.toString(), author]));

  return suggestions.map((s) => {
    const sheet = sheetBySlug.get(s.cheatsheetSlug);
    const section = sheet?.sections.find((sec) => sec.id === s.sectionId);
    const block = s.type === "edit" ? section?.blocks.find((b) => b.id === s.blockId) : undefined;
    const author = authorById.get(s.author.toString());

    const currentContent = block ? (block.content ?? "") : null;

    return {
      id: s._id.toString(),
      type: s.type,
      status: s.status,
      cheatsheetSlug: s.cheatsheetSlug,
      cheatsheetTitle: sheet?.title ?? null,
      sectionId: s.sectionId,
      sectionTitle: section?.title ?? null,
      blockId: s.blockId ?? null,
      blockType: s.blockType,
      content: s.content,
      language: s.language ?? null,
      note: s.note ?? "",
      reviewNote: s.reviewNote ?? "",
      createdAt: iso(s.createdAt),
      reviewedAt: iso(s.reviewedAt),
      author: { id: s.author.toString(), name: author?.name || "Unknown", banned: author?.banned ?? false },
      currentContent,
      targetMissing: !section || (s.type === "edit" && !block),
      changedSinceSuggested: s.type === "edit" && currentContent !== null && currentContent !== (s.baseContent ?? ""),
    };
  });
}
