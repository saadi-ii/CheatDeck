"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-session";

export function AdminBar() {
  const logout = useLogout();

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
