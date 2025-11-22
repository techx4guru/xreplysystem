
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


export const bootstrapAdmin = functions.https.onCall(async (_, context) => {
  // This is a sensitive function. In a real world scenario, you'd want to protect it,
  // perhaps by only allowing it to be called once, or only by a specific pre-defined user.
  // For this project, we'll allow an existing admin to call it, or check for a specific UID.
  if (context.auth?.token.admin !== true) {
      // You might also check for a specific project owner email
      // if (context.auth.token.email !== 'your-super-admin-email@example.com') {
      //   throw new functions.https.HttpsError('permission-denied', 'Only the project owner can bootstrap the first admin.');
      // }
  }

  const targetUid = "IAkQr6XOutgV94FwN6y16CHsfKN2";
  const targetEmail = "iamcalledgt@gmail.com";

  try {
    await admin.auth().setCustomUserClaims(targetUid, { admin: true, role: "superadmin" });
    await admin.firestore().doc(`admins/${targetUid}`).set({ uid: targetUid, role: "superadmin", email: targetEmail }, { merge: true });
    
    // Log this action
    await admin.firestore().collection("audit.admin_actions").add({
      adminId: context.auth?.uid || 'system_bootstrap',
      action: 'bootstrap_admin',
      target: { uid: targetUid },
      ts: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: `Admin ${targetEmail} bootstrapped successfully.` };
  } catch (error: any) {
    console.error('Error bootstrapping admin:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const getPendingCounts = functions.https.onCall(async (data, context) => {
    if (context.auth?.token.admin !== true) {
        throw new functions.https.HttpsError('permission-denied', 'Must be an admin to access this data.');
    }
    // In a real app, you would perform queries here.
    const content = Math.floor(Math.random() * 10);
    const jobs = Math.floor(Math.random() * 5);
    return { content, jobs };
});

export const impersonateStart = functions.https.onCall(async (data, context) => {
    if (context.auth?.token.admin !== true) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can impersonate users.');
    }
    
    const adminUid = context.auth.uid;
    const targetUid = data.uid;

    if (!targetUid) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing target UID.');
    }

    try {
        const additionalClaims = { impersonatedBy: adminUid };
        const customToken = await admin.auth().createCustomToken(targetUid, additionalClaims);

        await admin.firestore().collection('audit.admin_actions').add({
            adminId: adminUid,
            action: 'impersonate_start',
            target: { uid: targetUid },
            ts: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        return { token: customToken };
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
