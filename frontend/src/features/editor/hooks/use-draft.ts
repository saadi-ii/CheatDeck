"use client";

import { useCallback, useMemo, useState } from "react";
import type { Block, BlockType, Section } from "@/features/cheatsheet/types";
import * as ops from "../lib/draft-ops";

type BlockPatch = Partial<Omit<Block, "id" | "type">>;

/** Local editing state: the working draft, the last saved snapshot, and bound draft operations. */
export function useDraft(initial: ops.Draft) {
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  /**
   * Call after a successful save. `sent` is what was submitted, `next` is what the server returned
   * (it may normalise values). Edits made while the request was in flight are kept.
   */
  const markSaved = useCallback((sent: ops.Draft, next: ops.Draft) => {
    setSaved(next);
    setDraft((current) => (current === sent ? next : current));
  }, []);

  const actions = useMemo(
    () => ({
      updateMeta: (patch: Partial<ops.DraftMeta>) => setDraft((d) => ops.updateMeta(d, patch)),

      addSection: () => setDraft((d) => ops.addSection(d)),
      updateSection: (id: string, patch: Partial<Pick<Section, "title">>) =>
        setDraft((d) => ops.updateSection(d, id, patch)),
      removeSection: (id: string) => setDraft((d) => ops.removeSection(d, id)),
      moveSection: (id: string, delta: -1 | 1) => setDraft((d) => ops.moveSection(d, id, delta)),

      addBlock: (sectionId: string, type: BlockType) => setDraft((d) => ops.addBlock(d, sectionId, type)),
      updateBlock: (sectionId: string, blockId: string, patch: BlockPatch) =>
        setDraft((d) => ops.updateBlock(d, sectionId, blockId, patch)),
      removeBlock: (sectionId: string, blockId: string) => setDraft((d) => ops.removeBlock(d, sectionId, blockId)),
      moveBlock: (sectionId: string, blockId: string, delta: -1 | 1) =>
        setDraft((d) => ops.moveBlock(d, sectionId, blockId, delta)),
    }),
    [],
  );

  return { draft, dirty, markSaved, actions };
}

export type DraftActions = ReturnType<typeof useDraft>["actions"];
