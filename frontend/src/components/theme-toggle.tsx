"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Icons swap with CSS (dark:) so there is no state and no hydration mismatch.
// The initial class is set before paint by the inline script in the root layout.
export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // storage unavailable, theme just won't persist
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}
