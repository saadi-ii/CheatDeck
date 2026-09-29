"use client";

import Link from "next/link";
import { useCheatsheet } from "@/features/cheatsheet/hooks/use-cheatsheets";
import { ApiError } from "@/lib/http";
import { EditorShell } from "./editor-shell";

export function EditorLoader({ slug }: { slug: string }) {
  const { data, error, isPending } = useCheatsheet(slug);

  if (isPending) return <p className="text-muted-foreground">Loading...</p>;

  if (error) {
    const missing = error instanceof ApiError && error.status === 404;
    return (
      <div>
        <p className="text-destructive">{missing ? "That cheatsheet doesn't exist." : error.message}</p>
        <Link href="/admin" className="mt-2 inline-block text-sm underline underline-offset-4">
          Back to all cheatsheets
        </Link>
      </div>
    );
  }

  // key = slug so a rename remounts the editor from the freshly saved document.
  return <EditorShell key={data.slug} initial={data} />;
}
