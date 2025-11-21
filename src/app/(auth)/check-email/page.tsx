'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function CheckEmailPage() {
    const { user, resendVerificationEmail, signOut } = useAuth();
    const router = useRouter();
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (user?.emailVerified) {
            router.push('/dashboard');
        }
    }, [user, router]);
    
    // Poll for email verification status
    useEffect(() => {
        if(!user || user.emailVerified || !auth) return;

        const poll = async () => {
            if (!auth?.currentUser) return;
            
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                // Manually update local state as onAuthStateChanged might be slow
                router.push('/dashboard');
            }
        };

        const interval = setInterval(poll, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [user, router]);


    const handleResend = () => {
        if (cooldown > 0) return;
        resendVerificationEmail();
        setCooldown(60); // 60-second cooldown
        const timer = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center items-center mb-4">
                        <MailCheck className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Check Your Inbox</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a verification link to <strong>{user?.email}</strong>. Please click the link to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive an email? Check your spam folder or resend the link.
                    </p>
                    <Button onClick={handleResend} disabled={cooldown > 0} className="w-full">
                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
                    </Button>
                     <Button variant="link" onClick={signOut}>
                        Sign in with a different account
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
