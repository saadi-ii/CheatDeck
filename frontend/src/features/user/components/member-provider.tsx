"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMember, signOut as signOutRequest } from "../api";
import type { Member } from "../types";

interface MemberContextValue {
  /** undefined while loading, null when nobody is signed in. */
  member: Member | null | undefined;
  signOut: () => Promise<void>;
}

const MemberContext = createContext<MemberContextValue>({ member: undefined, signOut: async () => {} });

// Fetches the signed-in member once for the whole site. Public pages are cached and shared, so
// who is signed in is never rendered on the server; it is looked up here in the browser.
export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null | undefined>(undefined);

  useEffect(() => {
    getMember()
      .then(setMember)
      .catch(() => setMember(null));
  }, []);

  const signOut = useCallback(async () => {
    await signOutRequest().catch(() => {});
    setMember(null);
  }, []);

  const value = useMemo(() => ({ member, signOut }), [member, signOut]);
  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}

export const useMember = () => useContext(MemberContext);
