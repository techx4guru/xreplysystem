
'use client';
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
