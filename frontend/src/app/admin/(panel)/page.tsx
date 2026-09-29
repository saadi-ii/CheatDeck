import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/features/cheatsheet/components/admin-table";
import { ImportButton } from "@/features/cheatsheet/components/import-button";

export default function AdminHomePage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Cheatsheets</h1>
        <div className="flex flex-wrap items-start gap-2">
          <ImportButton />
          <Button render={<Link href="/admin/new" />}>New cheatsheet</Button>
        </div>
      </div>
      <AdminTable />
    </div>
  );
}
