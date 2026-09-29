import type { BlockType } from "@/features/cheatsheet/types";

export type SuggestionStatus = "pending" | "accepted" | "rejected";

/** What the API returns for the review queue and "my suggestions" (already joined with its cheatsheet and author). */
export interface SuggestionView {
  id: string;
  type: "edit" | "add";
  status: SuggestionStatus;
  cheatsheetSlug: string;
  cheatsheetTitle: string | null;
  sectionId: string;
  sectionTitle: string | null;
  blockId: string | null;
  blockType: BlockType;
  content: string;
  language: string | null;
  note: string;
  reviewNote: string;
  createdAt: string | null;
  reviewedAt: string | null;
  author: { id: string; name: string; banned: boolean };
  currentContent: string | null;
  targetMissing: boolean;
  changedSinceSuggested: boolean;
}

interface SuggestionCommon {
  cheatsheetSlug: string;
  sectionId: string;
  content: string;
  language?: string;
  note: string;
}

export type SuggestionInput =
  | ({ type: "edit"; blockId: string } & SuggestionCommon)
  | ({ type: "add"; blockType: BlockType } & SuggestionCommon);
