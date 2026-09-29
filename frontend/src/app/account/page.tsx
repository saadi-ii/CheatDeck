import type { Metadata } from "next";
import { MySuggestions } from "@/features/suggestion/components/my-suggestions";

export const metadata: Metadata = {
  title: "My suggestions",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">My suggestions</h1>
      <p className="mb-6 text-sm text-muted-foreground">Changes you proposed. Accepted ones appear on the cheatsheet.</p>
      <MySuggestions />
    </div>
  );
}
