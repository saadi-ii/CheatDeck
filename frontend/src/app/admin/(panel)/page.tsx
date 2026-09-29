import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminTable } from "@/features/cheatsheet/components/admin-table";

export default function AdminHomePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Cheatsheets</h1>
        <Button render={<Link href="/admin/new" />}>New cheatsheet</Button>
      </div>
      <AdminTable />
    </div>
  );
}
