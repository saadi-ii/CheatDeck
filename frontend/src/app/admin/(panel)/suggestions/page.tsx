import { ReviewQueue } from "@/features/suggestion/components/review-queue";

export default function SuggestionsPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Suggestions</h1>
      <p className="mb-6 text-sm text-muted-foreground">Oldest first. Accepting copies the change into the live cheatsheet.</p>
      <ReviewQueue />
    </div>
  );
}
