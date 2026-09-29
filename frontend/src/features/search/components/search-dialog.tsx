"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/modal";
import { useSearch } from "../hooks/use-search";
import type { SearchHit } from "../types";

// Default export so next/dynamic can lazy-load it.
export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const { enabled, hits, loading, failed } = useSearch(query);

  const current = Math.min(selected, Math.max(hits.length - 1, 0));

  function go(hit: SearchHit) {
    router.push(hit.sectionId ? `/${hit.slug}#${hit.sectionId}` : `/${hit.slug}`);
    onClose();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected(Math.min(current + 1, hits.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(Math.max(current - 1, 0));
    } else if (event.key === "Enter" && hits[current]) {
      event.preventDefault();
      go(hits[current]);
    }
  }

  return (
    <Modal onClose={onClose} label="Search cheatsheets" className="mt-[12vh]">
      <div onKeyDown={onKeyDown}>
        <input
          autoFocus
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="search-results"
          aria-label="Search cheatsheets"
          placeholder="Search cheatsheets..."
          className="w-full border-b bg-transparent px-4 py-3 text-sm outline-none"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
        />

        <ul id="search-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {hits.map((hit, index) => (
            <li
              key={`${hit.slug}-${hit.sectionId ?? "top"}`}
              role="option"
              aria-selected={index === current}
              onMouseEnter={() => setSelected(index)}
              onClick={() => go(hit)}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm aria-selected:bg-muted"
            >
              <div className="font-medium">
                {hit.icon} {hit.title}
                {hit.sectionTitle && <span className="text-muted-foreground"> › {hit.sectionTitle}</span>}
              </div>
              {hit.snippet && <div className="truncate text-xs text-muted-foreground">{hit.snippet}</div>}
            </li>
          ))}
        </ul>

        <p className="border-t px-4 py-2 text-xs text-muted-foreground">
          {!enabled && "Type at least 2 characters"}
          {enabled && failed && "Search is unavailable right now"}
          {enabled && !failed && loading && hits.length === 0 && "Searching..."}
          {enabled && !failed && !loading && hits.length === 0 && "No results"}
          {hits.length > 0 && "↑ ↓ to move, Enter to open, Esc to close"}
        </p>
      </div>
    </Modal>
  );
}
