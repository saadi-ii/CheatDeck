"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Draft, DraftMeta } from "../lib/draft-ops";

interface MetaFormProps {
  draft: Draft;
  onChange: (patch: Partial<DraftMeta>) => void;
}

export function MetaForm({ draft, onChange }: MetaFormProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Title</Label>
          <Input id="meta-title" value={draft.title} onChange={(e) => onChange({ title: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-slug">Slug</Label>
          <Input id="meta-slug" value={draft.slug} onChange={(e) => onChange({ slug: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-icon">Icon (emoji or symbol)</Label>
          <Input id="meta-icon" value={draft.icon} onChange={(e) => onChange({ icon: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-version">Version</Label>
          <Input
            id="meta-version"
            placeholder="16.x"
            value={draft.version}
            onChange={(e) => onChange({ version: e.target.value })}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="meta-description">Description</Label>
          <Textarea
            id="meta-description"
            className="min-h-16"
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            id="meta-published"
            checked={draft.published}
            onCheckedChange={(checked) => onChange({ published: checked === true })}
          />
          <Label htmlFor="meta-published" className="font-normal">
            Published (visible on the public site)
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
