
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { updateEmailWithReauth, updatePasswordWithReauth } from "@/lib/settingsApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Loader2 } from "lucide-react";

export function SecurityForm() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [newEmail, setNewEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleEmailChangeClick = () => {
        if (!newEmail || newEmail === user?.email) {
            toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a new, valid email address."});
            return;
        }
        setIsEmailModalOpen(true);
    }
    
    const handlePasswordChangeClick = () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill out all password fields."});
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast({ variant: "destructive", title: "Passwords Mismatch", description: "Your new passwords do not match."});
            return;
        }
        setIsPasswordModalOpen(true);
    }

    const handleEmailUpdate = async () => {
        setLoading(true);
        try {
            await updateEmailWithReauth(currentPasswordForEmail, newEmail);
            toast({ title: "Email Update Pending", description: "A verification link has been sent to your new email address. Please verify to complete the change."});
            setIsEmailModalOpen(false);
            setNewEmail('');
            setCurrentPasswordForEmail('');
        } catch(error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update email."});
        } finally {
            setLoading(false);
        }
    }
    
    const handlePasswordUpdate = async () => {
         setLoading(true);
        try {
            await updatePasswordWithReauth(currentPassword, newPassword);
            toast({ title: "Password updated." });
            setIsPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch(error: any) {
             toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update password."});
        } finally {
            setLoading(false);
        }
    }


    if (!user) return null;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Change email</CardTitle>
                    <CardDescription>Update the email address associated with your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-email">Current Email</Label>
                        <Input id="current-email" type="email" value={user.email || ''} disabled />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-email">New Email</Label>
                        <Input id="new-email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new.email@example.com" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleEmailChangeClick}>Change Email</Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>Choose a new, strong password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                        <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePasswordChangeClick}>Change Password</Button>
                </CardFooter>
            </Card>

            {/* Reauth for Email Change */}
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm identity</DialogTitle>
                        <DialogDescription>Enter your current password to continue.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                        <Label htmlFor="reauth-password-email">Current Password</Label>
                        <Input id="reauth-password-email" type="password" value={currentPasswordForEmail} onChange={e => setCurrentPasswordForEmail(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleEmailUpdate} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm & Change Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Reauth for Password Change is implicit in the API call */}
             <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm password change</DialogTitle>
                        <DialogDescription>Are you sure you want to change your password?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button onClick={handlePasswordUpdate} disabled={loading}>
                             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Change Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

