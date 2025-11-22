
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, UserPlus, Database, Clock } from "lucide-react";

interface DashboardCardsProps {
    data: {
        totalUsers: number;
        activeUsers: number;
        newSignups: number;
        storageUsage: string;
    }
}

export function DashboardCards({ data }: DashboardCardsProps) {
    const kpis = [
        { title: 'Total Users', value: data.totalUsers.toLocaleString(), icon: Users },
        { title: 'Active Users (30d)', value: data.activeUsers.toLocaleString(), icon: Clock },
        { title: 'New Signups (24h)', value: data.newSignups.toLocaleString(), icon: UserPlus },
        { title: 'Storage Usage', value: data.storageUsage, icon: Database },
    ];
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <kpi.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
