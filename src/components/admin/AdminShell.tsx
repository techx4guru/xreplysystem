
'use client';
import { AppHeader } from "@/components/app/header";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Users, Bot, HardDrive, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/content', label: 'Content', icon: Bot },
    { href: '/admin/logs', label: 'Logs', icon: HardDrive },
];


export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2 p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-primary"
                    >
                        <path d="M11.767 19.089c4.91 0 7.43-4.141 7.43-7.43 0-1.3-.323-2.52-.89-3.635" />
                        <path d="M14.534 9.873a4.136 4.136 0 0 0-4.66-4.66" />
                        <path d="M19.199 4.801c-1.115-.568-2.315-.89-3.635-.89-3.289 0-7.43 2.52-7.43 7.43 0 4.91 4.141 7.43 7.43 7.43 1.3 0 2.52-.323 3.635-.89" />
                        <path d="M9.873 9.466a4.136 4.136 0 0 1 4.66 4.66" />
                        <path d="M4.801 4.801C3.685 5.915 2.5 7.69 2.5 9.873c0 3.289 2.52 7.43 7.43 7.43" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="font-headline text-xl font-semibold">Autopilot</span>
                        <span className="text-sm font-medium text-destructive">Admin Panel</span>
                    </div>
                 </div>
            </SidebarHeader>
            <SidebarContent>
                 <SidebarMenu>
                     {adminNavItems.map(item => (
                        <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton asChild isActive={pathname === item.href}>
                                 <Link href={item.href}>
                                     <item.icon />
                                     <span>{item.label}</span>
                                 </Link>
                             </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                 </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/dashboard">
                           <LayoutDashboard/>
                           <span>Back to App</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={signOut}>
                        <LogOut/>
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
                {children}
            </main>
          </div>
        </div>
    );
}
