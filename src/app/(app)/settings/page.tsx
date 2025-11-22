'use client';
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SecurityForm } from "@/components/settings/SecurityForm";
import { DangerZone } from "@/components/settings/DangerZone";
import { useAuth } from "@/hooks/use-auth";

const RateLimitConfig = () => (
  <Card>
    <CardHeader>
      <CardTitle>Rate Limits & Throttling</CardTitle>
      <CardDescription>Manage how frequently the system posts replies.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="global-cap">Global Cap (replies/hour)</Label>
        <Input id="global-cap" type="number" defaultValue={100} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author-cap">Per-Author Cap (replies/day)</Label>
        <Input id="author-cap" type="number" defaultValue={5} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jitter">Jitter (max random delay in seconds)</Label>
        <Input id="jitter" type="number" defaultValue={30} />
      </div>
    </CardContent>
  </Card>
);

const SafetySettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Safety Thresholds</CardTitle>
      <CardDescription>Set the confidence score above which a flag is raised.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="toxicity">Toxicity</Label>
        <Input id="toxicity" type="number" defaultValue={0.8} step="0.1" min="0" max="1" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="political">Political</Label>        <Input id="political" type="number" defaultValue={0.7} step="0.1" min="0" max="1" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="medical">Medical</Label>
        <Input id="medical" type="number" defaultValue={0.9} step="0.1" min="0" max="1" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doxx">Doxxing</Label>
        <Input id="doxx" type="number" defaultValue={0.95} step="0.1" min="0" max="1" />
      </div>
    </CardContent>
  </Card>
);

const ContentSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Content Control</CardTitle>
      <CardDescription>Manage emoji pools and blacklisted words.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="emoji-pool">Emoji Pool (comma-separated)</Label>
        <Input id="emoji-pool" defaultValue="🤔,💡,🧐,🚀,🙏,🤷‍♂️,🔬,🏛️,💬" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="blacklist">Blacklist Words (comma-separated)</Label>
        <Input id="blacklist" placeholder="Enter words to block..." />
      </div>
    </CardContent>
  </Card>
);

const ApiKeySettings = () => (
    <Card>
        <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage third-party API keys. Keys are stored securely in Firestore.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="x-api-key">X API Key</Label>
                <Input id="x-api-key" type="password" placeholder="••••••••••••••••••••" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <Input id="openai-api-key" type="password" placeholder="••••••••••••••••••••" />
            </div>
        </CardContent>
    </Card>
)

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // Or a loading spinner, ProtectedRoute handles redirect
  }
    
  const isAdmin = user.role === 'admin';

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application settings.</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <ProfileForm />
            </div>
          </TabsContent>
          <TabsContent value="security">
             <div className="grid md:grid-cols-2 gap-6 pt-4">
                <SecurityForm />
             </div>
          </TabsContent>
          <TabsContent value="system">
             {isAdmin ? (
                 <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <RateLimitConfig />
                    <SafetySettings />
                    <ContentSettings />
                    <ApiKeySettings />
                 </div>
             ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>System Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You do not have permission to view or edit system settings.</p>
                    </CardContent>
                </Card>
             )}
          </TabsContent>
           <TabsContent value="danger">
            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <DangerZone />
            </div>
          </TabsContent>
        </Tabs>
        
        {isAdmin && (
            <div className="flex justify-end">
                <Button>Save System Settings</Button>
            </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
