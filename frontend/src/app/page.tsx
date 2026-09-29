import { getCheatsheets } from "@/features/cheatsheet/api";
import { CheatsheetCard } from "@/features/cheatsheet/components/cheatsheet-card";
import type { CheatsheetSummary } from "@/features/cheatsheet/types";

export const revalidate = 60;

export default async function HomePage() {
  let items: CheatsheetSummary[] = [];
  let failed = false;

  // Don't fail the build or the page if the API is asleep; show a message instead.
  try {
    items = await getCheatsheets();
  } catch {
    failed = true;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Cheatsheets</h1>
        <p className="mt-2 text-muted-foreground">Quick references you can read, copy and run.</p>
      </div>

      {failed ? (
        <p className="text-muted-foreground">Can&apos;t reach the API right now. Please try again in a moment.</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No cheatsheets yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CheatsheetCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
