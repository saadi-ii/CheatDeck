"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderControlsProps {
  /** Used in aria-labels, e.g. "section" or "block". */
  label: string;
  isFirst: boolean;
  isLast: boolean;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}

export function ReorderControls({ label, isFirst, isLast, onUp, onDown, onRemove }: ReorderControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" onClick={onUp} disabled={isFirst} aria-label={`Move ${label} up`}>
        <ChevronUp />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onDown} disabled={isLast} aria-label={`Move ${label} down`}>
        <ChevronDown />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive"
        onClick={onRemove}
        aria-label={`Delete ${label}`}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
