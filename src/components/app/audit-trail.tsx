import type { AuditLog } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface AuditTrailProps {
    logs: AuditLog[];
}

export function AuditTrail({ logs }: AuditTrailProps) {
    const getActionText = (log: AuditLog) => {
        switch (log.action) {
            case 'REJECT_CANDIDATE':
                return `rejected a candidate due to "${log.details.reason}"`;
            case 'EDIT_AND_POST':
                return 'edited and posted a candidate';
            case 'POST_REPLY':
                return 'posted a reply';
            case 'SEND_TO_MANUAL':
                return `sent post to manual queue: "${log.details.reason}"`;
            default:
                return log.action.toLowerCase().replace('_', ' ');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" /> Audit Trail
                </CardTitle>
            </CardHeader>
            <CardContent>
                {logs.length > 0 ? (
                    <ScrollArea className="h-48 pr-4">
                        <div className="space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="flex items-start gap-3 text-sm">
                                    <div>
                                        <p>
                                            <span className="font-semibold">{log.user}</span> {getActionText(log)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(log.timestamp.toDate(), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        <p>No audit history for this post.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
