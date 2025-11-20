'use client';
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppHeader } from "@/components/app/header";
import { AppSidebar } from "@/components/app/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
                {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
