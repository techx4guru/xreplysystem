
'use client';
// TODO: This should be a server component with server-side auth guard.
// For now, using client-side protected route for simplicity.
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
        <AdminShell>
            {children}
        </AdminShell>
    </ProtectedRoute>
  );
}
