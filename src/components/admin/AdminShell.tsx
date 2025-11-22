
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthClaims } from "@/hooks/useAuthClaims";
// import { getPendingCounts } from "@/lib/adminApi";
import { Loader2 } from "lucide-react";

// Mock function until API is fully wired
async function getPendingCounts() {
  return Promise.resolve({ content: 3, jobs: 1 });
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { user, signOut } = useAuth();
  const { claims, loading } = useAuthClaims();
  const isAdmin = !!claims?.admin;
  const isSuper = claims?.role === "superadmin";
  const [counts, setCounts] = useState<{ [k: string]: number }>({});

  useEffect(() => {
    let mounted = true;
    if (!isAdmin) return;
    getPendingCounts().then(c => { if (mounted) setCounts(c); }).catch(() => { });
    return () => { mounted = false; };
  }, [isAdmin]);

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!isAdmin) {
    return <div className="p-6">Unauthorized — admin access required. You may need to sign out and sign back in to refresh your permissions.</div>;
  }

  const nav = [
    { title: "Overview", href: "/admin" },
    { title: "Users", href: "/admin/users", role: "superadmin" },
    { title: "Roles & Access", href: "/admin/roles", role: "superadmin" },
    { title: "Content Moderation", href: "/admin/content", badge: counts.content || 0 },
    { title: "Queues & Jobs", href: "/admin/jobs", badge: counts.jobs || 0 },
    { title: "Scheduler", href: "/admin/scheduler" },
    { title: "Composer", href: "/admin/composer" },
    { title: "Queue", href: "/admin/queue" },
    { title: "Analytics", href: "/admin/analytics" },
    { title: "Monitoring & Logs", href: "/admin/monitoring" },
    { title: "Audit Logs", href: "/admin/audit" },
    { title: "Exports / GDPR", href: "/admin/exports" },
    { title: "Feature Flags", href: "/admin/flags" },
    { title: "Impersonation", href: "/admin/impersonate", role: "superadmin" },
    { title: "Backups & Restore", href: "/admin/backups", role: "superadmin" },
    { title: "Settings", href: "/admin/settings" },
    { title: "Help & Runbook", href: "/admin/runbook" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 flex flex-col">
        <div className="p-4 font-bold border-b dark:border-gray-800">Admin Panel</div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {nav.map(item => {
            if (item.role === 'superadmin' && !isSuper) return null;
            
            const active = (item.href === '/admin' && path === '/admin') || (item.href !== '/admin' && path.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href} className={`flex items-center justify-between px-3 py-2 rounded text-sm ${active ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <span>{item.title}</span>
                {item.badge ? <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t dark:border-gray-800 space-y-2">
            <Link href="/dashboard" className="flex items-center justify-center px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Back to App</Link>
            <button onClick={signOut} className="w-full text-center text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
