"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadJson } from "@/features/cheatsheet/lib/json-io";
import type { Draft } from "../lib/draft-ops";

/** Downloads the current draft (including unsaved edits) as <slug>.json. Can be re-imported from the list page. */
export function ExportButton({ draft }: { draft: Draft }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => downloadJson(`${draft.slug || "cheatsheet"}.json`, draft)}>
      <Download /> Export
    </Button>
  );
}
