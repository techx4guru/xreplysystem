'use client';
import { ProtectedRoute } from "@/components/auth/protected-route";
import EnvChecker from "@/components/app/EnvChecker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnvCheckerPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
             <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Environment & Network Checker</h1>
                    <p className="text-muted-foreground">Diagnostics tool for troubleshooting connection issues.</p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <EnvChecker />
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
