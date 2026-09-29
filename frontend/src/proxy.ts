import { NextResponse } from "next/server";

// Phase 3: redirect unauthenticated /admin/* requests to /admin/login.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
