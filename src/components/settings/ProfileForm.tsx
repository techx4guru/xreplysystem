
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveUserProfile } from "@/lib/settingsApi";
import { Loader2 } from "lucide-react";

export function ProfileForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setAvatarPreview(user.photoURL || null);
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            await saveUserProfile(user.uid, { displayName }, avatarFile);
            toast({
                title: "Profile updated.",
                description: "Your changes have been saved successfully.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message || "Could not save profile.",
            });
        } finally {
            setLoading(false);
        }
    }


    if (!user) return null;

    return (
         <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is how others will see you on the site.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email || ''} disabled />
                    </div>
                     <div className="space-y-2">
                        <Label>Avatar</Label>
                        <div className="flex items-center gap-4">
                             <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarPreview || undefined} alt="Your profile photo" />
                                <AvatarFallback>{displayName?.[0]}</AvatarFallback>
                            </Avatar>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} ref={fileInputRef} className="hidden"/>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Change
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save profile
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
