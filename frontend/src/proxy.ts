import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/constants";

// Optimistic check only: it looks for the cookie, it cannot verify the JWT.
// The API is the real authority and answers 401 for an invalid or expired session.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
