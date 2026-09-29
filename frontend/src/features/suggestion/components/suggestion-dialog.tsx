"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlockType } from "@/features/cheatsheet/types";
import { LANGUAGES } from "@/features/editor/lib/languages";
import { useMember } from "@/features/user/components/member-provider";
import { SignInLinks } from "@/features/user/components/sign-in-links";
import { ApiError } from "@/lib/http";
import { createSuggestion } from "../api";
import type { SuggestionTarget } from "./suggest-button";

interface SuggestionDialogProps {
  target: SuggestionTarget;
  onClose: () => void;
}

// Default export so next/dynamic can lazy-load it.
export default function SuggestionDialog({ target, onClose }: SuggestionDialogProps) {
  const { member } = useMember();
  const editing = target.mode === "edit" ? target.block : null;

  const [content, setContent] = useState(editing?.content ?? "");
  const [blockType, setBlockType] = useState<BlockType>("text");
  const [language, setLanguage] = useState(editing?.language ?? "tsx");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const effectiveType = editing ? editing.type : blockType;
  const unchanged = editing !== null && content.trim() === editing.content.trim();
  const canSend = status !== "sending" && content.trim().length > 0 && !unchanged;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend) return;
    setStatus("sending");
    setError(null);

    const common = {
      cheatsheetSlug: target.cheatsheetSlug,
      sectionId: target.section.id,
      content,
      note,
      ...(effectiveType === "code" ? { language } : {}),
    };

    try {
      await createSuggestion(editing ? { type: "edit", blockId: editing.id, ...common } : { type: "add", blockType, ...common });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof ApiError && e.issues.length > 0 ? e.issues.map((i) => i.message).join(". ") : e instanceof Error ? e.message : "Something went wrong");
    }
  }

  const title = editing ? `Suggest an edit` : "Suggest a new block";

  return (
    <Modal onClose={onClose} label={title}>
      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            In <span className="font-medium text-foreground">{target.section.title}</span>. An admin reviews every suggestion before it goes live.
          </p>
        </div>

        {member === undefined && <p className="text-sm text-muted-foreground">Loading...</p>}

        {member === null && (
          <div className="space-y-3">
            <p className="text-sm">Sign in to send a suggestion.</p>
            <SignInLinks />
          </div>
        )}

        {member?.banned && <p className="text-sm text-destructive">Your account can no longer submit suggestions.</p>}

        {member && !member.banned && status === "done" && (
          <div className="space-y-3">
            <p className="text-sm">Thanks! Your suggestion was sent and will be reviewed. You can follow it on your account page.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        )}

        {member && !member.banned && status !== "done" && (
          <form onSubmit={submit} className="space-y-4">
            {!editing && (
              <div className="space-y-2">
                <Label htmlFor="sg-type">Block type</Label>
                <select
                  id="sg-type"
                  className="h-8 rounded-lg border bg-background px-2 text-sm"
                  value={blockType}
                  onChange={(event) => setBlockType(event.target.value as BlockType)}
                >
                  <option value="text">Text (markdown)</option>
                  <option value="code">Code</option>
                </select>
              </div>
            )}

            {effectiveType === "code" && (
              <div className="space-y-2">
                <Label htmlFor="sg-language">Language</Label>
                <select
                  id="sg-language"
                  className="h-8 rounded-lg border bg-background px-2 text-sm"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sg-content">{effectiveType === "code" ? "Code" : "Text (markdown)"}</Label>
              <Textarea
                id="sg-content"
                autoFocus
                spellCheck={effectiveType !== "code"}
                className={effectiveType === "code" ? "min-h-40 font-mono text-sm" : "min-h-32"}
                maxLength={10000}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              {unchanged && <p className="text-xs text-muted-foreground">Change something to send a suggestion.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sg-note">Why? (optional)</Label>
              <Input id="sg-note" maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />
            </div>

            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canSend}>
                {status === "sending" ? "Sending..." : "Send suggestion"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
