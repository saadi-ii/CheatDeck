import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-muted-foreground">That cheatsheet doesn&apos;t exist or isn&apos;t published yet.</p>
      <Link href="/" className="mt-4 inline-block text-sm underline underline-offset-4">
        Back to all cheatsheets
      </Link>
    </div>
  );
}
