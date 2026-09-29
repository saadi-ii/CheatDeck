"use client";

import { Play, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Sandpack is large, so it is only downloaded once someone clicks Run.
const Playground = dynamic(() => import("./playground"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-muted-foreground">Loading playground...</p>,
});

interface PlaygroundToggleProps {
  code: string;
  language: string;
}

export function PlaygroundToggle({ code, language }: PlaygroundToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t">
      <div className="flex justify-end p-1">
        <Button variant="ghost" size="xs" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Play />}
          {open ? "Close playground" : "Run in playground"}
        </Button>
      </div>
      {open && <Playground code={code} language={language} />}
    </div>
  );
}
