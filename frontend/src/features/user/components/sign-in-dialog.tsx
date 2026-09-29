"use client";

import { Modal } from "@/components/modal";
import { SignInLinks } from "./sign-in-links";

// Default export so next/dynamic can lazy-load it.
export default function SignInDialog({ onClose, reason }: { onClose: () => void; reason?: string }) {
  return (
    <Modal onClose={onClose} label="Sign in" className="w-[min(24rem,calc(100%-2rem))]">
      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {reason ?? "Sign in to suggest changes. We only use your public profile name and picture."}
          </p>
        </div>
        <SignInLinks />
      </div>
    </Modal>
  );
}
