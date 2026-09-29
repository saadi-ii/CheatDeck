"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMember } from "@/features/user/components/member-provider";
import { SignInLinks } from "@/features/user/components/sign-in-links";
import { mySuggestions } from "../api";
import type { SuggestionStatus, SuggestionView } from "../types";

const STATUS: Record<SuggestionStatus, { label: string; variant: "secondary" | "default" | "destructive" }> = {
  pending: { label: "Waiting for review", variant: "secondary" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Not accepted", variant: "destructive" },
};

export function MySuggestions() {
  const { member } = useMember();
  const [items, setItems] = useState<SuggestionView[] | null>(null);
  const [failed, setFailed] = useState(false);

  const signedIn = member != null;
  useEffect(() => {
    if (!signedIn) return;
    mySuggestions()
      .then(setItems)
      .catch(() => setFailed(true));
  }, [signedIn]);

  if (member === undefined) return <p className="text-muted-foreground">Loading...</p>;

  if (member === null) {
    return (
      <div className="max-w-sm space-y-3">
        <p className="text-muted-foreground">Sign in to see the suggestions you sent.</p>
        <SignInLinks />
      </div>
    );
  }

  if (failed) return <p className="text-destructive">Couldn&apos;t load your suggestions. Please try again later.</p>;
  if (items === null) return <p className="text-muted-foreground">Loading...</p>;
  if (items.length === 0) {
    return <p className="text-muted-foreground">You haven&apos;t sent any suggestions yet. Open a cheatsheet and use &quot;Suggest edit&quot;.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={STATUS[item.status].variant}>{STATUS[item.status].label}</Badge>
              <Badge variant="outline">{item.type === "edit" ? "Edit" : "New block"}</Badge>
              <Link href={`/${item.cheatsheetSlug}`} className="font-medium underline-offset-4 hover:underline">
                {item.cheatsheetTitle ?? item.cheatsheetSlug}
              </Link>
              {item.sectionTitle && <span className="text-muted-foreground">› {item.sectionTitle}</span>}
              {item.createdAt && <span className="ml-auto text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>}
            </div>
            <pre className="max-h-32 overflow-auto rounded-lg bg-muted/50 p-3 text-xs whitespace-pre-wrap">{item.content}</pre>
            {item.reviewNote && <p className="text-sm text-muted-foreground">Reviewer note: {item.reviewNote}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
