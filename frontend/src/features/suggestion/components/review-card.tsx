"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBanMember, useReviewSuggestion } from "../hooks/use-suggestions";
import type { SuggestionView } from "../types";

function Panel({ title, text }: { title: string; text: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      <pre className="max-h-64 overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{text}</pre>
    </div>
  );
}

export function ReviewCard({ item }: { item: SuggestionView }) {
  const review = useReviewSuggestion();
  const ban = useBanMember();
  const [note, setNote] = useState("");

  const busy = review.isPending || ban.isPending;
  const error = review.error ?? ban.error;

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary">{item.type === "edit" ? "Edit" : "New block"}</Badge>
          <Badge variant="outline">{item.blockType}</Badge>
          <Link href={`/${item.cheatsheetSlug}`} target="_blank" className="font-medium underline-offset-4 hover:underline">
            {item.cheatsheetTitle ?? item.cheatsheetSlug}
          </Link>
          {item.sectionTitle && <span className="text-muted-foreground">› {item.sectionTitle}</span>}
          {item.createdAt && <span className="ml-auto text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            From <span className="font-medium text-foreground">{item.author.name}</span>
          </span>
          {item.author.banned && <Badge variant="destructive">Banned</Badge>}
          <Button
            variant="ghost"
            size="xs"
            disabled={busy}
            onClick={() => {
              const action = item.author.banned ? "Unban" : "Ban";
              if (window.confirm(`${action} ${item.author.name}?`)) ban.mutate({ userId: item.author.id, banned: !item.author.banned });
            }}
          >
            {item.author.banned ? "Unban" : "Ban"}
          </Button>
        </div>

        {item.note && <p className="text-sm">&ldquo;{item.note}&rdquo;</p>}

        {item.targetMissing && (
          <p className="text-sm text-destructive">The cheatsheet, section or block this points at no longer exists, so it can only be rejected.</p>
        )}
        {item.changedSinceSuggested && !item.targetMissing && (
          <p className="text-sm text-amber-600 dark:text-amber-400">This block was edited after the suggestion was written. Check the diff before accepting.</p>
        )}

        {item.type === "edit" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Panel title="Current" text={item.currentContent ?? "(block no longer exists)"} />
            <Panel title="Suggested" text={item.content} />
          </div>
        ) : (
          <Panel title={`New ${item.blockType} block (added at the end of the section)`} text={item.content} />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Input
            aria-label="Note to the author (optional)"
            placeholder="Note to the author (optional)"
            className="max-w-xs"
            maxLength={500}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button disabled={busy || item.targetMissing} onClick={() => review.mutate({ id: item.id, action: "accept", note })}>
            Accept
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => review.mutate({ id: item.id, action: "reject", note })}>
            Reject
          </Button>
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
      </CardContent>
    </Card>
  );
}
