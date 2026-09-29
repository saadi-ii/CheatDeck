import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Admin login" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
