"use client";

import { usePendingSuggestions } from "../hooks/use-suggestions";
import { ReviewCard } from "./review-card";

export function ReviewQueue() {
  const { data, isPending, error } = usePendingSuggestions();

  if (isPending) return <p className="text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-destructive">{error.message}</p>;
  if (data.length === 0) return <p className="text-muted-foreground">Nothing waiting for review.</p>;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <ReviewCard key={item.id} item={item} />
      ))}
    </div>
  );
}
