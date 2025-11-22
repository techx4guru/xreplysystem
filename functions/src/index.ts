
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

export const adminDeleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Request did not have valid authentication credentials.");
  }
  
  const uid = context.auth.uid;
  if (data.uid !== uid) {
    throw new functions.https.HttpsError("permission-denied", "You can only delete your own account.");
  }

  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  try {
    // 1. Delete Firestore document
    await db.doc(`users/${uid}`).delete();
    
    // 2. Delete Storage folder
    await bucket.deleteFiles({ prefix: `users/${uid}/` });
    
    // 3. Delete Auth user
    await admin.auth().deleteUser(uid);

    // 4. Log successful deletion
    await db.collection("audit.user_actions").add({
      userId: uid,
      action: "delete_account_success",
      ts: admin.firestore.FieldValue.serverTimestamp(),
      meta: { details: "User account fully deleted." },
    });
    
    return { success: true, message: "Account deleted successfully." };

  } catch (error: any) {
    console.error(`Failed to delete user ${uid}:`, error);

    // Log failure
    await db.collection("audit.user_actions").add({
        userId: uid,
        action: "delete_account_failure",
        ts: admin.firestore.FieldValue.serverTimestamp(),
        meta: { error: error.message },
    });

    throw new functions.https.HttpsError("internal", "Failed to delete account.", error.message);
  }
});
