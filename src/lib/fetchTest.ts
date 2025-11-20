// src/lib/fetchTest.ts
export async function testAuthEndpoint(apiKey?: string) {
  try {
    const key = apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!key) return { ok: false, error: "No API key loaded" };
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnSecureToken: true }),
    });
    const text = await r.text();
    return { ok: r.ok, status: r.status, bodySnippet: text.slice(0, 400) };
  } catch (e: any) {
    return { ok: false, status: 'NETWORK_ERROR', bodySnippet: null, error: e.message || String(e) };
  }
}
