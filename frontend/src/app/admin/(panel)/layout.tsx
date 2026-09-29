import { AdminBar } from "@/components/admin-bar";
import { AdminGuard } from "@/features/auth/components/admin-guard";

// Everything under (panel) requires a valid admin session; /admin/login sits outside it.
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminGuard>
      <AdminBar />
      {children}
    </AdminGuard>
  );
}
