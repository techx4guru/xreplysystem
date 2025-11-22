
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getFirebaseInstancesIfReady } from "@/lib/firebase";
import type { User } from "firebase/auth";

export function useAuthClaims() {
  const { user: userProfile, loading: authLoading } = useAuth(); // Renamed to avoid confusion
  const [claims, setClaims] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const { auth } = getFirebaseInstancesIfReady();
    const firebaseUser = auth?.currentUser;

    if (authLoading) {
      // Wait for the initial auth state to be determined
      return;
    }

    if (!firebaseUser) {
      setClaims(null);
      setLoading(false);
      return;
    }

    const update = async (user: User | null) => {
      if (!isMounted || !user) {
        setClaims(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = await user.getIdTokenResult(true); // force a refresh
        if (isMounted) {
          setClaims(token.claims || {});
        }
      } catch (error) {
        console.error("Error getting user claims:", error);
        if (isMounted) {
          setClaims(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    update(firebaseUser);

    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      await update(user);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userProfile, authLoading]);

  return { claims, loading };
}
