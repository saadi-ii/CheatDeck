"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getProviders, signInUrl } from "../api";
import type { ProviderName } from "../types";

const LABELS: Record<ProviderName, string> = { github: "Continue with GitHub", google: "Continue with Google" };

/** Buttons for the providers the server has set up. Full-page links, because OAuth leaves the site. */
export function SignInLinks() {
  const pathname = usePathname();
  const [providers, setProviders] = useState<ProviderName[] | null>(null);

  useEffect(() => {
    getProviders()
      .then(setProviders)
      .catch(() => setProviders([]));
  }, []);

  if (providers === null) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (providers.length === 0) return <p className="text-sm text-muted-foreground">Sign-in isn&apos;t available right now.</p>;

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <Button key={provider} variant="outline" nativeButton={false} render={<a href={signInUrl(provider, pathname)} />}>
          {LABELS[provider]}
        </Button>
      ))}
    </div>
  );
}
