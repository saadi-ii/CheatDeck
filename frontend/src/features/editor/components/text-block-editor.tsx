"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Block } from "@/features/cheatsheet/types";

interface TextBlockEditorProps {
  block: Block;
  onChange: (content: string) => void;
}

export function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <div className="mb-2 flex gap-1">
        <Button size="xs" variant={preview ? "ghost" : "secondary"} onClick={() => setPreview(false)}>
          Write
        </Button>
        <Button size="xs" variant={preview ? "secondary" : "ghost"} onClick={() => setPreview(true)}>
          Preview
        </Button>
      </div>

      {preview ? (
        <div className="markdown min-h-24 rounded-lg border p-3">
          <Markdown remarkPlugins={[remarkGfm]}>{block.content || "*Nothing to preview yet*"}</Markdown>
        </div>
      ) : (
        <Textarea
          aria-label="Markdown content"
          placeholder="Write markdown..."
          className="min-h-24 field-sizing-content"
          value={block.content}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
