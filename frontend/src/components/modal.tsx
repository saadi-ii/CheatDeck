"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  /** Called when the dialog closes (Esc, backdrop click or a programmatic close). Unmount the modal here. */
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  label: string;
}

// A thin wrapper around the native <dialog>: backdrop, focus trapping and Esc come for free,
// so there is no modal library. Mount it to open it, unmount it in onClose.
export function Modal({ onClose, children, className, label }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop targets the dialog element itself.
        if (event.target === ref.current) ref.current?.close();
      }}
      className={cn(
        "mx-auto mt-[10vh] mb-auto max-h-[80vh] w-[min(36rem,calc(100%-2rem))] overflow-y-auto rounded-xl border bg-background p-0 text-foreground shadow-xl backdrop:bg-black/50",
        className,
      )}
    >
      {children}
    </dialog>
  );
}
