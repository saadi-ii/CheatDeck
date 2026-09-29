import type { Block, BlockType, Cheatsheet, CheatsheetInput, Section } from "@/features/cheatsheet/types";
import { move } from "./reorder";

// Pure, immutable operations on the editor draft. No React in here, so they are easy to test.

export type Draft = CheatsheetInput;
export type DraftMeta = Omit<Draft, "sections">;

const newId = () => crypto.randomUUID();

/** Picks the editable fields from an API document (drops updatedAt and anything server-managed). */
export function fromCheatsheet(doc: Cheatsheet): Draft {
  return {
    slug: doc.slug,
    title: doc.title,
    icon: doc.icon,
    description: doc.description,
    version: doc.version,
    published: doc.published,
    sections: doc.sections.map((section) => ({
      id: section.id,
      title: section.title,
      blocks: section.blocks.map((block) => ({
        id: block.id,
        type: block.type,
        content: block.content,
        ...(block.language ? { language: block.language } : {}),
        runnable: block.runnable,
      })),
    })),
  };
}

export function createBlock(type: BlockType): Block {
  return { id: newId(), type, content: "", runnable: false, ...(type === "code" ? { language: "tsx" } : {}) };
}

export function createSection(): Section {
  return { id: newId(), title: "", blocks: [] };
}

export const updateMeta = (draft: Draft, patch: Partial<DraftMeta>): Draft => ({ ...draft, ...patch });

// ---- sections ----

const mapSection = (draft: Draft, sectionId: string, fn: (section: Section) => Section): Draft => ({
  ...draft,
  sections: draft.sections.map((section) => (section.id === sectionId ? fn(section) : section)),
});

export const addSection = (draft: Draft): Draft => ({ ...draft, sections: [...draft.sections, createSection()] });

export const updateSection = (draft: Draft, sectionId: string, patch: Partial<Pick<Section, "title">>): Draft =>
  mapSection(draft, sectionId, (section) => ({ ...section, ...patch }));

export const removeSection = (draft: Draft, sectionId: string): Draft => ({
  ...draft,
  sections: draft.sections.filter((section) => section.id !== sectionId),
});

export const moveSection = (draft: Draft, sectionId: string, delta: -1 | 1): Draft => ({
  ...draft,
  sections: move(
    draft.sections,
    draft.sections.findIndex((section) => section.id === sectionId),
    delta,
  ),
});

// ---- blocks ----

export const addBlock = (draft: Draft, sectionId: string, type: BlockType): Draft =>
  mapSection(draft, sectionId, (section) => ({ ...section, blocks: [...section.blocks, createBlock(type)] }));

export const updateBlock = (
  draft: Draft,
  sectionId: string,
  blockId: string,
  patch: Partial<Omit<Block, "id" | "type">>,
): Draft =>
  mapSection(draft, sectionId, (section) => ({
    ...section,
    blocks: section.blocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block)),
  }));

export const removeBlock = (draft: Draft, sectionId: string, blockId: string): Draft =>
  mapSection(draft, sectionId, (section) => ({
    ...section,
    blocks: section.blocks.filter((block) => block.id !== blockId),
  }));

export const moveBlock = (draft: Draft, sectionId: string, blockId: string, delta: -1 | 1): Draft =>
  mapSection(draft, sectionId, (section) => ({
    ...section,
    blocks: move(
      section.blocks,
      section.blocks.findIndex((block) => block.id === blockId),
      delta,
    ),
  }));
