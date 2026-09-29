import { randomUUID } from "node:crypto";

// Pure helpers for the suggestion workflow, kept free of Express and Mongoose so they can be tested alone.

export interface BlockLike {
  id: string;
  type: "text" | "code";
  content?: string | null;
  language?: string | null;
  runnable?: boolean | null;
  since?: string | null;
  deprecated?: string | null;
}

export interface SectionLike {
  id: string;
  title: string;
  blocks: BlockLike[];
}

export interface ChangeLike {
  type: "edit" | "add";
  sectionId: string;
  blockId?: string | null;
  blockType: "text" | "code";
  content: string;
  language?: string | null;
}

/**
 * Applies an accepted suggestion to a cheatsheet's sections and returns the new sections
 * (the input is not modified). Returns null when the target section or block no longer exists.
 *  - "edit": replaces the block's content (and language for code). The block's type, id, badges
 *    and runnable flag are kept.
 *  - "add": appends a new block to the end of the section. It is never runnable automatically.
 */
export function applySuggestion(sections: SectionLike[], change: ChangeLike): SectionLike[] | null {
  const section = sections.find((s) => s.id === change.sectionId);
  if (!section) return null;

  let blocks: BlockLike[];

  if (change.type === "edit") {
    const target = section.blocks.find((b) => b.id === change.blockId);
    if (!target) return null;

    blocks = section.blocks.map((block) =>
      block.id === target.id
        ? { ...block, content: change.content, ...(block.type === "code" && change.language ? { language: change.language } : {}) }
        : block,
    );
  } else {
    const added: BlockLike = {
      id: randomUUID(),
      type: change.blockType,
      content: change.content,
      runnable: false,
      ...(change.blockType === "code" ? { language: change.language ?? "text" } : {}),
    };
    blocks = [...section.blocks, added];
  }

  return sections.map((s) => (s.id === section.id ? { ...s, blocks } : s));
}
