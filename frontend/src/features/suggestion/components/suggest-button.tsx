"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BlockType } from "@/features/cheatsheet/types";

// The dialog is only downloaded the first time someone clicks a suggest button.
const SuggestionDialog = dynamic(() => import("./suggestion-dialog"), { ssr: false });

/** Serializable description of what is being suggested on (props cross from server to client components). */
export type SuggestionTarget = {
  cheatsheetSlug: string;
  section: { id: string; title: string };
} & (
  | { mode: "edit"; block: { id: string; type: BlockType; content: string; language?: string } }
  | { mode: "add" }
);

export function SuggestButton({ target }: { target: SuggestionTarget }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={() => setOpen(true)}>
        {target.mode === "edit" ? "Suggest edit" : "Suggest a block"}
      </Button>
      {open && <SuggestionDialog target={target} onClose={() => setOpen(false)} />}
    </>
  );
}
