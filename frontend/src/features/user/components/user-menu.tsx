"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMember } from "./member-provider";

const SignInDialog = dynamic(() => import("./sign-in-dialog"), { ssr: false });

/** Header control: "Sign in" for visitors, or the member's name, a link to their suggestions and "Sign out". */
export function UserMenu() {
  const { member, signOut } = useMember();
  const [open, setOpen] = useState(false);

  if (member === undefined) return null; // still checking; avoids a flash of "Sign in"

  if (member === null) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          Sign in
        </Button>
        {open && <SignInDialog onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/account" />}>
        {member.name || "Account"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => void signOut()}>
        Sign out
      </Button>
    </div>
  );
}
