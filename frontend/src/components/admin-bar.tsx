"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-session";
import { usePendingSuggestions } from "@/features/suggestion/hooks/use-suggestions";

export function AdminBar() {
  const logout = useLogout();
  const pending = usePendingSuggestions().data?.length ?? 0;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-2 border-b pb-4">
      <nav className="flex items-center gap-4 text-sm">
        <span className="font-semibold">Admin</span>
        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
          Cheatsheets
        </Link>
        <Link href="/admin/new" className="text-muted-foreground hover:text-foreground">
          New
        </Link>
        <Link href="/admin/suggestions" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          Suggestions
          {pending > 0 && <Badge>{pending}</Badge>}
        </Link>
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          View site
        </Link>
      </nav>
      <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
        Log out
      </Button>
    </div>
  );
}
