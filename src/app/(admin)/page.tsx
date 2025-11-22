
import { DashboardCards } from "@/components/admin/DashboardCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function AdminDashboardPage() {
    // In a real app, this data would be fetched server-side
    const kpiData = {
        totalUsers: 1234,
        activeUsers: 567,
        newSignups: 45,
        storageUsage: "1.2 GB"
    };
    
    const recentActivity = [
        { id: 1, user: 'admin@example.com', action: 'set_role', target: 'user@example.com', time: '2m ago'},
        { id: 2, user: 'operator@example.com', action: 'post_reply', target: 'post:123', time: '5m ago'},
        { id: 3, user: 'admin@example.com', action: 'impersonate_start', target: 'test@example.com', time: '10m ago'},
    ];


  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <DashboardCards data={kpiData} />

        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map(item => (
                            <div key={item.id} className="text-sm">
                                <span className="font-semibold">{item.user}</span> performed action <span className="font-mono bg-muted px-1 py-0.5 rounded">{item.action}</span> on <span className="font-semibold">{item.target}</span>.
                                <div className="text-xs text-muted-foreground">{item.time}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground pt-8">
                   <p>System monitoring widgets coming soon.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
