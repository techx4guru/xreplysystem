
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminRunbookPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Admin Runbook</h1>
            <p className="text-muted-foreground">Standard operating procedures and documentation.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Internal Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Refer to the internal documentation for detailed operational guides.</p>
                    <Link href="file:///mnt/data/GT_Master_System_Prompt_v1.0.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        View GT Master System Prompt v1.0.pdf
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
