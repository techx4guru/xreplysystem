
'use client';
import { getFirebaseInstancesIfReady } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";

// This is a placeholder. In a real app, this would call a backend function.
export async function getPendingCounts(): Promise<{ [k: string]: number }> {
  console.log("Fetching pending counts...");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ content: Math.floor(Math.random() * 10), jobs: Math.floor(Math.random() * 5) });
    }, 1000);
  });
}

export async function exportUserData(uid: string) {
    const { functions } = getFirebaseInstancesIfReady();
    if (!functions) throw new Error("Functions not initialized");
    const func = httpsCallable(functions, 'exportUserData');
    return await func({ uid });
}

export async function startImpersonation(uid: string) {
    const { functions } = getFirebaseInstancesIfReady();
    if (!functions) throw new Error("Functions not initialized");
    const func = httpsCallable(functions, 'impersonateStart');
    const result = await func({ uid });
    return (result.data as any).token;
}

export async function revokeRefreshTokens(uid: string) {
    const { functions } = getFirebaseInstancesIfReady();
    if (!functions) throw new Error("Functions not initialized");
    const func = httpsCallable(functions, 'revokeRefreshTokens');
    return await func({ uid });
}

export async function setCustomClaims(uid: string, claims: object) {
    const { functions } = getFirebaseInstancesIfReady();
    if (!functions) throw new Error("Functions not initialized");
    const func = httpsCallable(functions, 'setCustomClaims');
    return await func({ targetUid: uid, claims });
}

export async function getSystemStats() {
    const { functions, auth } = getFirebaseInstancesIfReady();
    if (!functions || !auth?.currentUser) throw new Error("Functions or Auth not initialized");
    
    const idToken = await auth.currentUser.getIdToken();
    const functionUrl = (functions.customDomain || `https://${functions.region}-<project-id>.cloudfunctions.net`) + "/getSystemStats";
    
    // Manually construct the URL for a non-callable function
    const url = `https://${functions.region}-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/getSystemStats`;
    
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch system stats: ${res.status} ${errorText}`);
    }

    return await res.json();
}

export async function getUserClaims(uid: string) {
    const { functions } = getFirebaseInstancesIfReady();
    if (!functions) throw new Error("Functions not initialized");
    const func = httpsCallable(functions, 'getUserClaims');
    const result = await func({ uid });
    return (result.data as any).claims;
}
