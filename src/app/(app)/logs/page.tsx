import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockAuditLogs } from "@/lib/mock-data";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const getActionBadgeVariant = (action: string) => {
    if (action.includes('POST') || action.includes('APPROVE')) return 'default';
    if (action.includes('REJECT')) return 'destructive';
    if (action.includes('EDIT')) return 'secondary';
    return 'outline';
}


export default function LogsPage() {
    // TODO: Implement search and pagination
    const logs = mockAuditLogs;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Audit & Replay Logs</h1>
                    <p className="text-muted-foreground">Search and review all system and user actions.</p>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Logs</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by user, action, or post ID..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs">{format(log.timestamp.toDate(), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell>
                                        <Badge variant={getActionBadgeVariant(log.action)}>{log.action.replace('_', ' ')}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">{JSON.stringify(log.details)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
