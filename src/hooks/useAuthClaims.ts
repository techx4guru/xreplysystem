
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useAuthClaims() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClaims(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const update = async () => {
      try {
        const token = await user.getIdTokenResult(true);
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

    update();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { claims, loading };
}
