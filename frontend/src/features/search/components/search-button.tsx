"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// The dialog code is only downloaded the first time search is opened.
const SearchDialog = dynamic(() => import("./search-dialog"), { ssr: false });

export function SearchButton() {
  const [open, setOpen] = useState(false);

  // Ctrl/Cmd+K opens search from anywhere.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} aria-label="Search" className="text-muted-foreground">
        <Search />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border px-1 text-[10px] sm:inline">Ctrl K</kbd>
      </Button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}
