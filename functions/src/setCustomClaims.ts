
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// This function can only be run by an existing admin.
// It's used to grant admin or other roles to other users.
export const setCustomClaims = functions.https.onCall(async (data, context) => {
    // 1. Verify caller is an admin
    if (context.auth?.token?.admin !== true) {
        throw new functions.https.HttpsError('permission-denied', 'You must be an admin to set custom claims.');
    }

    const { targetUid, claims } = data;

    // 2. Validate input
    if (!targetUid || typeof targetUid !== 'string' || !claims || typeof claims !== 'object') {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "targetUid" and "claims" arguments.');
    }

    const adminUid = context.auth.uid;
    const db = admin.firestore();

    try {
        // 3. Set custom claims on the target user
        await admin.auth().setCustomUserClaims(targetUid, claims);

        // 4. Update the user's role in their Firestore document for client-side access
        await db.doc(`users/${targetUid}`).set({
            role: claims.role || (claims.admin ? 'admin' : 'operator')
        }, { merge: true });

        // 5. Log this admin action for auditing
        await db.collection("audit.admin_actions").add({
            adminId: adminUid,
            action: "set_custom_claims",
            target: { uid: targetUid },
            ts: admin.firestore.FieldValue.serverTimestamp(),
            meta: { details: `Set claims for user ${targetUid}: ${JSON.stringify(claims)}` },
        });

        return { success: true, message: `Successfully set claims for user ${targetUid}.` };

    } catch (error: any) {
        console.error(`Error setting claims for user ${targetUid} by admin ${adminUid}:`, error);

        await db.collection("audit.admin_actions").add({
            adminId: adminUid,
            action: "set_custom_claims_failure",
            target: { uid: targetUid },
            ts: admin.firestore.FieldValue.serverTimestamp(),
            meta: { error: error.message },
        });

        throw new functions.https.HttpsError('internal', 'An error occurred while setting claims.', error.message);
    }
});
