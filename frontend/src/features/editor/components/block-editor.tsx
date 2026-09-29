"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

      <div className="mb-2 flex flex-wrap gap-2">
        <Input
          aria-label="Since version"
          placeholder="Since (e.g. 15)"
          className="h-7 w-36 text-xs"
          value={block.since ?? ""}
          onChange={(event) => update({ since: event.target.value })}
        />
        <Input
          aria-label="Deprecated in version"
          placeholder="Deprecated in (e.g. 16)"
          className="h-7 w-44 text-xs"
          value={block.deprecated ?? ""}
          onChange={(event) => update({ deprecated: event.target.value })}
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
