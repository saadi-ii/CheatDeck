export type BlockType = "text" | "code";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  language?: string;
  runnable: boolean;
}

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface CheatsheetSummary {
  slug: string;
  title: string;
  icon: string;
  description: string;
  version: string;
  published: boolean;
  updatedAt: string;
}

export interface Cheatsheet extends CheatsheetSummary {
  sections: Section[];
}

/** What the API accepts for create and save (server-managed fields removed). */
export type CheatsheetInput = Omit<Cheatsheet, "updatedAt">;
