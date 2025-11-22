
import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/components/auth/auth-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
