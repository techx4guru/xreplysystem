
import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/components/auth/auth-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The client-side AdminShell component will handle claim checking.
  // A server-side guard could be added here for stricter protection if needed.
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
