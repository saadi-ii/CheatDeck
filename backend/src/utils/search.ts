export interface SearchableDoc {
  slug: string;
  title: string;
  icon?: string | null;
  description?: string | null;
  sections: {
    id: string;
    title: string;
    blocks: { content?: string | null }[];
  }[];
}

export interface SearchHit {
  slug: string;
  title: string;
  icon: string;
  /** null when the match is on the cheatsheet itself rather than one of its sections. */
  sectionId: string | null;
  sectionTitle: string | null;
  snippet: string;
}

/** Makes user input safe to embed in a RegExp (also prevents ReDoS via user-supplied patterns). */
export function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function snippetAround(text: string, index: number, length: number) {
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + length + 60);
  const body = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${body}${end < text.length ? "…" : ""}`;
}

/**
 * Turns matching documents into one hit per matching place: the cheatsheet itself,
 * and each section whose title or content contains the query (case-insensitive).
 */
export function buildHits(docs: SearchableDoc[], query: string, limit = 20): SearchHit[] {
  const needle = query.toLowerCase();
  const hits: SearchHit[] = [];

  for (const doc of docs) {
    const base = { slug: doc.slug, title: doc.title, icon: doc.icon ?? "" };

    const description = doc.description ?? "";
    if (doc.title.toLowerCase().includes(needle) || description.toLowerCase().includes(needle)) {
      const at = description.toLowerCase().indexOf(needle);
      hits.push({
        ...base,
        sectionId: null,
        sectionTitle: null,
        snippet: at >= 0 ? snippetAround(description, at, needle.length) : description,
      });
    }

    for (const section of doc.sections) {
      let snippet: string | null = section.title.toLowerCase().includes(needle) ? "" : null;

      if (snippet === null) {
        for (const block of section.blocks) {
          const content = block.content ?? "";
          const at = content.toLowerCase().indexOf(needle);
          if (at >= 0) {
            snippet = snippetAround(content, at, needle.length);
            break;
          }
        }
      }

      if (snippet !== null) {
        hits.push({ ...base, sectionId: section.id, sectionTitle: section.title, snippet });
      }
    }
  }

  return hits.slice(0, limit);
}
