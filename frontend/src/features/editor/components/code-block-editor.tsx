"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Block } from "@/features/cheatsheet/types";
import { LANGUAGES } from "../lib/languages";

interface CodeBlockEditorProps {
  block: Block;
  onChange: (patch: Partial<Pick<Block, "content" | "language" | "runnable">>) => void;
}

export function CodeBlockEditor({ block, onChange }: CodeBlockEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-4">
        <select
          aria-label="Language"
          className="h-8 rounded-lg border bg-background px-2 text-sm"
          value={block.language ?? "text"}
          onChange={(event) => onChange({ language: event.target.value })}
        >
          {LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`${block.id}-runnable`}
            checked={block.runnable}
            onCheckedChange={(checked) => onChange({ runnable: checked === true })}
          />
          <Label htmlFor={`${block.id}-runnable`} className="text-sm font-normal">
            Runnable in playground
          </Label>
        </div>
      </div>

      <Textarea
        aria-label="Code"
        spellCheck={false}
        placeholder="Paste code..."
        className="min-h-28 font-mono text-sm field-sizing-content"
        value={block.content}
        onChange={(event) => onChange({ content: event.target.value })}
      />
    </div>
  );
}
