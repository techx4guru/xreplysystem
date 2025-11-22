
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to a more appropriate page if role doesn't match
        router.push('/dashboard');
    }
  }, [user, allowedRoles, router]);


  if (loading || !user) {
    // You can return a loading spinner here
    return null;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // You can return a loading spinner or a "not authorized" page
    return null;
  }

  return <>{children}</>;
}
