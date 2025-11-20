import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockPosts } from "@/lib/mock-data";
import { Activity, Bot, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const kpiData = [
  { title: "Replies Sent (24h)", value: "1,234", change: "+15.2%", icon: MessageSquare, color: "text-primary" },
  { title: "Engagement Rate", value: "2.8%", change: "+0.5%", icon: TrendingUp, color: "text-green-500" },
  { title: "System Health", value: "Operational", change: "99.9% Uptime", icon: Activity, color: "text-green-500" },
  { title: "Safety Flags (24h)", value: "3", change: "-25%", icon: ShieldCheck, color: "text-yellow-500" },
];

export default function DashboardPage() {
  const recentPosts = mockPosts.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Queue Activity</CardTitle>
            <CardDescription>The latest posts entering the queue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
                            <AvatarFallback>{post.author.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author.displayName}</div>
                          <div className="text-xs text-muted-foreground">@{post.authorHandle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{post.text}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'queued' ? 'default' : 'secondary'} className="capitalize">{post.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
             <CardDescription>Quick actions and system state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-300">System is Operational</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">All automated replies are active.</p>
                </div>
                <Button variant="destructive">Pause System</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                 <div>
                    <h3 className="font-semibold">Prompt Templates</h3>
                    <p className="text-sm text-muted-foreground">3 active templates.</p>
                </div>
                <Button asChild variant="outline"><Link href="/templates">Manage Templates</Link></Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                 <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">Access the operational runbook.</p>
                </div>
                <Button asChild variant="outline"><Link href="/help">View Runbook</Link></Button>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
