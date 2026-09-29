import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchButton } from "@/features/search/components/search-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          CheatDeck
        </Link>
        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
