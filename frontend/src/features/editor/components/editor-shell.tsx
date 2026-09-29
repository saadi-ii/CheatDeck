"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSaveCheatsheet } from "@/features/cheatsheet/hooks/use-cheatsheets";
import type { Cheatsheet } from "@/features/cheatsheet/types";
import { ApiError } from "@/lib/http";
import { useDraft } from "../hooks/use-draft";
import { formatIssue } from "../lib/format-issue";
import { fromCheatsheet } from "../lib/draft-ops";
import { ExportButton } from "./export-button";
import { MetaForm } from "./meta-form";
import { SectionEditor } from "./section-editor";

export function EditorShell({ initial }: { initial: Cheatsheet }) {
  const router = useRouter();
  const { draft, dirty, markSaved, actions } = useDraft(fromCheatsheet(initial));
  const save = useSaveCheatsheet(initial.slug);

  function handleSave() {
    if (!dirty || save.isPending) return;
    const sent = draft;
    save.mutate(sent, {
      onSuccess: (saved) => {
        markSaved(sent, fromCheatsheet(saved));
        if (saved.slug !== initial.slug) router.replace(`/admin/${saved.slug}`);
      },
    });
  }

  // Ctrl/Cmd+S saves.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const error = save.error;

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-10 -mx-4 flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{draft.title || "Untitled"}</h1>
          <p className="text-xs text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ExportButton draft={draft} />
          {draft.published && !dirty && (
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/${draft.slug}`} target="_blank" />}>
              View
            </Button>
          )}
          <Button onClick={handleSave} disabled={!dirty || save.isPending}>
            {save.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">{error.message}</p>
          {error instanceof ApiError && error.issues.length > 0 && (
            <ul className="mt-1 list-disc pl-5">
              {error.issues.map((issue, index) => (
                <li key={index}>{formatIssue(issue)}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <MetaForm draft={draft} onChange={actions.updateMeta} />

      <div className="space-y-4">
        {draft.sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            count={draft.sections.length}
            actions={actions}
          />
        ))}
      </div>

      <Button variant="outline" onClick={actions.addSection}>
        <Plus /> Add section
      </Button>
    </div>
  );
}
