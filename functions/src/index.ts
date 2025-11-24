import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import cors = require("cors"); // use require for compatibility
import { setCustomClaims } from "./setCustomClaims";

admin.initializeApp();

// Export manually imported functions
export { setCustomClaims };

// ---------------------
// CORS middleware
// ---------------------
const corsHandler = cors({ origin: true });

// --------------------------------------------------------
// GET SYSTEM STATS (HTTP + CORS)
// --------------------------------------------------------
export const getSystemStats = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
      return res.status(204).send("");
    }

    // Auth check
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!idToken) return res.status(401).json({ error: "Missing token" });

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded.admin) return res.status(403).json({ error: "Forbidden" });
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Stats logic
    try {
      const auth = admin.auth();
      const bucket = admin.storage().bucket();
      const users = await auth.listUsers();

      const now = Date.now();
      const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

      const totalUsers = users.users.length;
      const newUsers = users.users.filter(u => u.metadata.creationTime >= dayAgo).length;
      const activeUsers = users.users.filter(u => u.metadata.lastSignInTime >= monthAgo).length;

      const [files] = await bucket.getFiles();
      const totalBytes = files.reduce((sum, f) => sum + Number(f.metadata.size || 0), 0);

      res.set("Access-Control-Allow-Origin", "*");

      return res.status(200).json({
        totalUsers,
        newSignups: newUsers,
        activeUsers,
        storageUsage: `${(totalBytes / 1024 / 1024).toFixed(2)} MB`
      });
    } catch (err: any) {
      console.error("System stats error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
});

// --------------------------------------------------------
// ADMIN DELETE USER
// --------------------------------------------------------
export const adminDeleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admins only.");
  }

  const { targetUid } = data;
  if (!targetUid) {
    throw new functions.https.HttpsError("invalid-argument", "targetUid required.");
  }

  const adminUid = context.auth.uid;
  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  try {
    await db.doc(`users/${targetUid}`).delete();
    await bucket.deleteFiles({ prefix: `users/${targetUid}/` });
    await admin.auth().deleteUser(targetUid);

    await db.collection("audit.admin_actions").add({
      adminId: adminUid,
      action: "delete_user",
      target: { uid: targetUid },
      ts: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (err: any) {
    console.error("Delete error:", err);
    await db.collection("audit.admin_actions").add({
      adminId: adminUid,
      action: "delete_user_failure",
      target: { uid: targetUid },
      ts: admin.firestore.FieldValue.serverTimestamp(),
      meta: { error: err.message },
    });
    throw new functions.https.HttpsError("internal", err.message);
  }
});

// --------------------------------------------------------
// BOOTSTRAP SUPER ADMIN
// --------------------------------------------------------
export const bootstrapAdmin = functions.https.onCall(async (_, context) => {
  const targetUid = "IAkQr6XOutgV94FwN6y16CHsfKN2";
  const targetEmail = "iamcalledgt@gmail.com";

  try {
    await admin.auth().setCustomUserClaims(targetUid, {
      admin: true,
      role: "superadmin"
    });

    await admin.firestore().doc(`admins/${targetUid}`).set({
      uid: targetUid,
      email: targetEmail,
      role: "superadmin"
    }, { merge: true });

    return { success: true };
  } catch (err: any) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});

// --------------------------------------------------------
// PENDING COUNTS
// --------------------------------------------------------
export const getPendingCounts = functions.https.onCall(async (_, context) => {
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admins only.");
  }

  return {
    content: Math.floor(Math.random() * 10),
    jobs: Math.floor(Math.random() * 5),
  };
});

// --------------------------------------------------------
// IMPERSONATION
// --------------------------------------------------------
export const impersonateStart = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admins only.");
  }

  const targetUid = data.uid;
  if (!targetUid) {
    throw new functions.https.HttpsError("invalid-argument", "uid required.");
  }

  try {
    const token = await admin.auth().createCustomToken(targetUid, {
      impersonatedBy: context.auth.uid
    });

    return { token };
  } catch (err: any) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});
