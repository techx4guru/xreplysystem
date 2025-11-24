import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS_JSON || "{}");
const projectId = process.env.GCLOUD_PROJECT;

if (!projectId) {
  console.error("GCLOUD_PROJECT is not set.");
  process.exit(1);
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
  });
}

const targetUid = "IAkQr6XOutgV94FwN6y16CHsfKN2";
const targetEmail = "iamcalledgt@gmail.com";

async function seedAdmin() {
  console.log("🔥 Setting admin custom claims for:", targetEmail);

  // Add custom claims
  await admin.auth().setCustomUserClaims(targetUid, {
    admin: true,
    role: "superadmin",
  });

  // Add Firestore record
  await admin.firestore()
    .collection("admins")
    .doc(targetUid)
    .set(
      {
        uid: targetUid,
        email: targetEmail,
        role: "superadmin",
        addedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  console.log("✅ Admin setup complete.");
}

seedAdmin().catch((err) => {
  console.error("❌ Error seeding admin:", err);
  process.exit(1);
});
