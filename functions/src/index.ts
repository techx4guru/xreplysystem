
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { setCustomClaims } from './setCustomClaims';

admin.initializeApp();

// Export all functions from their own files
export { setCustomClaims };

export const adminDeleteUser = functions.https.onCall(async (data, context) => {
  // Check if the user is an admin
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError("permission-denied", "Only admins can delete users.");
  }

  const { targetUid } = data;
  if (!targetUid) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with a 'targetUid' argument.");
  }
  
  const adminUid = context.auth.uid;
  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  try {
    // 1. Delete Firestore document
    await db.doc(`users/${targetUid}`).delete();
    
    // 2. Delete Storage folder
    await bucket.deleteFiles({ prefix: `users/${targetUid}/` });
    
    // 3. Delete Auth user
    await admin.auth().deleteUser(targetUid);

    // 4. Log admin action
    await db.collection("audit.admin_actions").add({
      adminId: adminUid,
      action: "delete_user",
      target: { uid: targetUid },
      ts: admin.firestore.FieldValue.serverTimestamp(),
      meta: { details: "User account fully deleted by admin." },
    });
    
    return { success: true, message: `User ${targetUid} deleted successfully.` };

  } catch (error: any) {
    console.error(`Failed to delete user ${targetUid} by admin ${adminUid}:`, error);

    // Log failure
     await db.collection("audit.admin_actions").add({
        adminId: adminUid,
        action: "delete_user_failure",
        target: { uid: targetUid },
        ts: admin.firestore.FieldValue.serverTimestamp(),
        meta: { error: error.message },
    });

    throw new functions.https.HttpsError("internal", `Failed to delete user ${targetUid}.`, error.message);
  }
});
