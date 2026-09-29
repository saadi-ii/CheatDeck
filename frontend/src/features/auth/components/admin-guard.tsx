"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ApiError } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { useSession } from "../hooks/use-session";

/** Renders children only for a verified admin session; otherwise sends you to the login page. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();

  const unauthorized = session.error instanceof ApiError && session.error.status === 401;

  useEffect(() => {
    if (unauthorized) router.replace("/admin/login");
  }, [unauthorized, router]);

  if (session.isSuccess) return <>{children}</>;

  if (session.isError && !unauthorized) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Can&apos;t reach the API right now.</p>
        <Button className="mt-4" onClick={() => session.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return <p className="py-16 text-center text-muted-foreground">Loading...</p>;
}
