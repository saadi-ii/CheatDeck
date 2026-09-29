"use client";

import { Badge } from "@/components/ui/badge";
import type { Block } from "@/features/cheatsheet/types";
import type { DraftActions } from "../hooks/use-draft";
import { CodeBlockEditor } from "./code-block-editor";
import { ReorderControls } from "./reorder-controls";
import { TextBlockEditor } from "./text-block-editor";

interface BlockEditorProps {
  sectionId: string;
  block: Block;
  index: number;
  count: number;
  actions: DraftActions;
}

export function BlockEditor({ sectionId, block, index, count, actions }: BlockEditorProps) {
  const update = (patch: Parameters<DraftActions["updateBlock"]>[2]) =>
    actions.updateBlock(sectionId, block.id, patch);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <Badge variant="secondary">{block.type === "code" ? "Code" : "Text"}</Badge>
        <ReorderControls
          label="block"
          isFirst={index === 0}
          isLast={index === count - 1}
          onUp={() => actions.moveBlock(sectionId, block.id, -1)}
          onDown={() => actions.moveBlock(sectionId, block.id, 1)}
          onRemove={() => actions.removeBlock(sectionId, block.id)}
        />
      </div>

      {block.type === "code" ? (
        <CodeBlockEditor block={block} onChange={update} />
      ) : (
        <TextBlockEditor block={block} onChange={(content) => update({ content })} />
      )}
    </div>
  );
}
