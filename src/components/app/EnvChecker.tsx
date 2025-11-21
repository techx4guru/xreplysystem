'use client';
import React, { useState } from "react";
import { initializeFirebaseServices } from "@/lib/firebase";
import { testAuthEndpoint } from "@/lib/fetchTest";
import { Button } from "../ui/button";

export default function EnvChecker() {
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const push = (m: string) => { setLog((s) => [m, ...s]); console.log(m); };

  async function runAll() {
    setIsRunning(true);
    setLog([]);
    push("Running client-side Env Checker...");
    await new Promise(res => setTimeout(res, 50));

    push("NEXT_PUBLIC_FIREBASE_API_KEY: " + (process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY.slice(0,8) + "..." : "<missing or not exposed>"));
    push("NEXT_PUBLIC_FIREBASE_PROJECT_ID: " + (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "<missing or not exposed>"));
    push("NODE_ENV: " + process.env.NODE_ENV);
    push("NEXT_PUBLIC_USE_FIREBASE_EMULATOR: " + (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR ?? "<unset>"));
    
    await new Promise(res => setTimeout(res, 50));
    push("--------------------------------------");
    push("Testing identitytoolkit endpoint direct fetch...");
    const fetchResult = await testAuthEndpoint();
    if(fetchResult.ok) {
        push("✅ Fetch test SUCCEEDED. Status: " + fetchResult.status);
    } else {
        push("❌ Fetch test FAILED. Status: " + (fetchResult.status || fetchResult.error));
    }
    push("Response Snippet: " + JSON.stringify(fetchResult.bodySnippet || fetchResult.error));
    if(!fetchResult.ok) {
        push("💡 TIP: A network error or CORS policy might be blocking the request from your browser to Google's servers. This is common in some corporate networks or restricted cloud environments.")
    }
    
    await new Promise(res => setTimeout(res, 50));
    push("--------------------------------------");
    push("Attempting initializeFirebaseServices()...");
    try {
      const res = await initializeFirebaseServices();
      push("✅ Firebase init SUCCEEDED: ready=" + Boolean(res.ready));
      push("Instances: " + JSON.stringify({ hasAuth: !!res.auth, hasDb: !!res.db, hasFunctions: !!res.functions, error: res.error?.message }));
    } catch (err: any) {
      push("❌ Firebase init FAILED: " + String(err.message || err));
      push("💡 TIP: This usually happens if the API key is invalid, expired, or has incorrect HTTP referrer restrictions in the Google Cloud Console for that key.")
    }
    setIsRunning(false);
  }

  return (
    <div className="p-4 bg-background rounded-lg border">
      <h3 className="text-lg font-semibold font-headline">Connection Diagnostics</h3>
      <p className="text-sm text-muted-foreground mb-4">Click to test if your browser can connect to Firebase services with your current environment variables.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={runAll} disabled={isRunning}>{isRunning ? "Running..." : "Run Diagnostics"}</Button>
        <Button variant="outline" asChild>
            <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">Open Firebase Console</a>
        </Button>
      </div>
      <div className="bg-gray-900 text-white font-mono p-3 rounded-md max-h-80 overflow-auto text-xs">
        {log.length === 0 && <span className="text-gray-400">Diagnostics log will appear here...</span>}
        {log.map((l, i) => (<div key={i}>{l}</div>))}
      </div>
      <div className="mt-4 text-sm text-muted-foreground p-4 border-l-4 rounded-r-md bg-muted">
        <strong className="text-foreground">Troubleshooting Tips</strong>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Ensure <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">.env.local</code> exists and has correct <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">NEXT_PUBLIC_...</code> values.</li>
          <li>After changing <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">.env.local</code>, you must completely stop and restart the <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">npm run dev</code> server.</li>
           <li>For local development with emulators, ensure they are running: <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">firebase emulators:start</code></li>
        </ul>
      </div>
    </div>
  );
}
