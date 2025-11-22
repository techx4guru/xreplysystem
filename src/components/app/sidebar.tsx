
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  BarChart2,
  Bot,
  FileText,
  GanttChart,
  HardDrive,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Settings,
  Webhook,
  FlaskConical,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/lib/types';
import { Badge } from '../ui/badge';

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/queue', label: 'Queue', icon: GanttChart, badge: '12' },
  { href: '/composer', label: 'Composer', icon: Mail },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/logs', label: 'Logs', icon: HardDrive },
];

const adminNavItems: NavItem[] = [
    { href: '/templates', label: 'Templates', icon: Bot },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/integrations', label: 'Integrations', icon: Webhook },
]

const devNavItems: NavItem[] = [
    { href: '/dev/env-checker', label: 'Env Checker', icon: FlaskConical },
]

const helpNavItems: NavItem[] = [
  { href: '/help', label: 'Help & Runbook', icon: HelpCircle },
];

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles?: UserRole[];
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
        if (item.allowedRoles && !item.allowedRoles.includes(user?.role || 'operator')) {
            return null;
        }
        return (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        {item.badge && <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    });
  }

  return (
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
            <span className="font-headline text-xl font-semibold">Autopilot</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>{renderNavItems(navItems)}</SidebarMenu>
        
        {isAdmin && (
            <>
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground/70 uppercase">Admin</div>
            <SidebarMenu>{renderNavItems(adminNavItems)}</SidebarMenu>
            </>
        )}
        
        {process.env.NODE_ENV === 'development' && isAdmin && (
             <>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground/70 uppercase">Developer</div>
                <SidebarMenu>{renderNavItems(devNavItems)}</SidebarMenu>
             </>
        )}

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>{renderNavItems(helpNavItems)}</SidebarMenu>
         <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
                <LogOut />
                <span>Logout</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
