"use client";
import { useEffect, useState } from "react";
import { getFirebaseInstancesIfReady } from "@/lib/firebase";
import type { User } from "firebase/auth";

export function useAuthClaims({ refreshOnMount = false } = {}) {
  const [claims, setClaims] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const { auth } = getFirebaseInstancesIfReady();
    
    if (!auth) {
        setLoading(false);
        return;
    }

    const update = async (user: User | null) => {
        if (!isMounted) return;
        if (!user) {
            setClaims(null);
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const tokenResult = await user.getIdTokenResult(refreshOnMount); // Force refresh on mount if requested
            if (isMounted) {
                setClaims(tokenResult.claims || {});
            }
        } catch (error) {
            console.error("Error fetching user claims:", error);
            if (isMounted) {
                setClaims(null);
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    const unsubscribe = auth.onIdTokenChanged(update);

    // Initial check
    update(auth.currentUser);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [refreshOnMount]);

  return { claims, loading };
}
