export interface SearchHit {
  slug: string;
  title: string;
  icon: string;
  /** null when the match is the cheatsheet itself rather than one of its sections. */
  sectionId: string | null;
  sectionTitle: string | null;
  snippet: string;
}
