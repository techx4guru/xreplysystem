'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useState, FormEvent } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { sendPasswordReset, isAuthenticating } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await sendPasswordReset(email);
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
         <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm w-full text-center">
                <CardHeader>
                    <div className="flex justify-center items-center mb-4">
                        <KeyRound className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Check Your Email</CardTitle>
                </CardHeader>
                <CardContent>
                     <CardDescription>
                        If an account exists for <strong>{email}</strong>, you will receive an email with instructions on how to reset your password. Please check your spam folder if you don&apos;t see it.
                    </CardDescription>
                </CardContent>
                 <CardFooter>
                    <Button asChild className="w-full" variant="ghost">
                        <Link href="/login">Back to Sign In</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Send Reset Link"}
            </Button>
            </CardContent>
        </form>
        <CardFooter className="border-t pt-6">
            <Button asChild className="w-full" variant="outline">
                <Link href="/login">Cancel</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
