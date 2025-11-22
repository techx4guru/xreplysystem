
"use client";
import { useEffect, useState } from "react";
import { getFirebaseInstancesIfReady } from "@/lib/firebase";
import type { User } from "firebase/auth";

export function useAuthClaims() {
  const [claims, setClaims] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const { auth } = getFirebaseInstancesIfReady();
    
    if (!auth) {
        setLoading(false);
        return;
    }

    const updateClaims = async (user: User | null) => {
        if (!isMounted) return;
        if (!user) {
            setClaims(null);
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const tokenResult = await user.getIdTokenResult(true); // Force refresh
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

    const unsubscribe = auth.onIdTokenChanged(updateClaims);

    // Initial check
    updateClaims(auth.currentUser);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { claims, loading };
}
