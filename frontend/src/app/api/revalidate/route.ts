import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CHEATSHEETS_TAG } from "@/features/cheatsheet/api";

const sha256 = (value: string) => createHash("sha256").update(value).digest();

// Called by the Express API after a cheatsheet is created, saved or deleted.
// Not a public endpoint: it requires the shared REVALIDATE_SECRET.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const sent = request.headers.get("x-revalidate-secret") ?? "";

  // Hash both sides so lengths match and the comparison is constant-time.
  if (!secret || !timingSafeEqual(sha256(sent), sha256(secret))) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // expire: 0 means the very next request gets fresh data instead of one stale view.
  revalidateTag(CHEATSHEETS_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
