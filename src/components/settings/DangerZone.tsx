
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteUserAccount } from "@/lib/settingsApi";
import { Loader2 } from "lucide-react";

export function DangerZone() {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmationEmail, setConfirmationEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        if (confirmationEmail !== user?.email) {
            toast({ variant: "destructive", title: "Incorrect Email", description: "The email you entered does not match." });
            return;
        }
        setLoading(true);
        try {
            await deleteUserAccount();
            toast({ title: "Account deleted — goodbye." });
            // Auth provider will handle redirect on user state change.
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message || "Failed to delete account." });
        } finally {
            setLoading(false);
            setIsDeleteModalOpen(false);
        }
    };
    
    if (!user) return null;

    return (
        <>
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-input rounded-lg">
                        <div>
                            <h3 className="font-semibold">Sign Out</h3>
                            <p className="text-sm text-muted-foreground">Sign out of your account on this device.</p>
                        </div>
                        <Button variant="outline" onClick={signOut}>Sign Out</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
                        <div>
                            <h3 className="font-semibold text-destructive">Delete Account</h3>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                        </div>
                        <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>Delete account</Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="confirm-email">Type your email to permanently delete your account:</Label>
                        <Input 
                            id="confirm-email" 
                            type="email" 
                            placeholder={user.email || ""} 
                            value={confirmationEmail}
                            onChange={e => setConfirmationEmail(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteAccount}
                            disabled={loading || confirmationEmail !== user.email}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            I understand, delete my account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
