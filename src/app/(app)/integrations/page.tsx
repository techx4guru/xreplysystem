import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HardDrive, Webhook } from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Integrations</h1>
          <p className="text-muted-foreground">Connect X-Reply Autopilot to other services.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Webhook className="w-5 h-5"/> X API Connection</CardTitle>
                    <CardDescription>Configure your connection to the X API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your API keys are managed in <Link href="/settings" className="underline text-primary">Settings &gt; API Keys</Link>.
                        Use this panel to test the connection.
                    </p>
                    <Button>Test X Connection</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HardDrive className="w-5 h-5"/> Webhook Test Panel</CardTitle>
                    <CardDescription>Send a test payload to your webhook endpoint to verify integration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input id="webhook-url" placeholder="https://your-endpoint.com/webhook" />
                    </div>
                    <Button>Send Test Webhook</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
