"use client";

import { Code, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Section } from "@/features/cheatsheet/types";
import type { DraftActions } from "../hooks/use-draft";
import { BlockEditor } from "./block-editor";
import { ReorderControls } from "./reorder-controls";

interface SectionEditorProps {
  section: Section;
  index: number;
  count: number;
  actions: DraftActions;
}

export function SectionEditor({ section, index, count, actions }: SectionEditorProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        <Input
          aria-label="Section title"
          placeholder="Section title (e.g. Routing)"
          className="font-medium"
          value={section.title}
          onChange={(event) => actions.updateSection(section.id, { title: event.target.value })}
        />
        <ReorderControls
          label="section"
          isFirst={index === 0}
          isLast={index === count - 1}
          onUp={() => actions.moveSection(section.id, -1)}
          onDown={() => actions.moveSection(section.id, 1)}
          onRemove={() => {
            const hasContent = section.blocks.length > 0;
            if (!hasContent || window.confirm(`Delete this section and its ${section.blocks.length} block(s)?`)) {
              actions.removeSection(section.id);
            }
          }}
        />
      </CardHeader>

      <CardContent className="space-y-3">
        {section.blocks.map((block, blockIndex) => (
          <BlockEditor
            key={block.id}
            sectionId={section.id}
            block={block}
            index={blockIndex}
            count={section.blocks.length}
            actions={actions}
          />
        ))}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => actions.addBlock(section.id, "text")}>
            <Type /> Text
          </Button>
          <Button variant="outline" size="sm" onClick={() => actions.addBlock(section.id, "code")}>
            <Code /> Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AddSectionButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      <Plus /> Add section
    </Button>
  );
}
