
import * as admin from 'firebase-admin';

// This script requires you to have Google Application Default Credentials.
// Run `gcloud auth application-default login` first.
// It also needs the project ID.
const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
    console.error("GCLOUD_PROJECT env var not set. Please set it to your Firebase project ID.");
    process.exit(1);
}

admin.initializeApp({
  projectId,
});

const targetUid = "IAkQr6XOutgV94FwN6y16CHsfKN2";
const targetEmail = "iamcalledgt@gmail.com";

async function seedAdmin() {
  console.log(`Attempting to set admin claims for UID: ${targetUid}`);

  try {
    // Set custom claims on the user
    await admin.auth().setCustomUserClaims(targetUid, { admin: true, role: "superadmin" });
    
    console.log(`Successfully set custom claims for ${targetEmail}.`);

    // Create a corresponding document in the 'admins' collection for easy lookup
    const adminsCollection = admin.firestore().collection('admins');
    await adminsCollection.doc(targetUid).set({
        uid: targetUid,
        email: targetEmail,
        role: "superadmin",
        addedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`Successfully created entry in 'admins' collection for ${targetEmail}.`);
    console.log('Seed admin script completed successfully.');
    
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
