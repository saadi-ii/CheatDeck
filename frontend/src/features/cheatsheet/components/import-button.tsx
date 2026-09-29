"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/http";
import { useCreateCheatsheet } from "../hooks/use-cheatsheets";
import { readJsonFile } from "../lib/json-io";
import type { CheatsheetInput } from "../types";

/** Creates a cheatsheet from an exported .json file. The API validates it and rejects an existing slug. */
export function ImportButton() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const create = useCreateCheatsheet();
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    try {
      const data = await readJsonFile(file);
      const slug = (data as { slug?: unknown })?.slug;
      if (typeof slug !== "string") throw new Error("This doesn't look like an exported cheatsheet (no slug)");

      create.mutate(data as CheatsheetInput, {
        onSuccess: () => router.push(`/admin/${slug}`),
        onError: (e) => {
          const issues = e instanceof ApiError ? e.issues.map((i) => `${i.path}: ${i.message}`) : [];
          setError([e.message, ...issues].join(" — "));
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onFile(file);
          event.target.value = ""; // allow picking the same file again
        }}
      />
      <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={create.isPending}>
        <Upload /> Import JSON
      </Button>
      {error && <p className="mt-2 max-w-md text-sm text-destructive">{error}</p>}
    </div>
  );
}
