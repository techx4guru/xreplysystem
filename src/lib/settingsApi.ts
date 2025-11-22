
'use client';

import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseInstancesIfReady, initializeFirebaseServices } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";

async function logUserAction(action: string, meta: object = {}) {
    const { auth, db } = getFirebaseInstancesIfReady();
    if (!auth?.currentUser || !db) return;
    try {
        const auditRef = doc(db, 'audit.user_actions', new Date().toISOString() + '_' + auth.currentUser.uid);
        await setDoc(auditRef, {
            userId: auth.currentUser.uid,
            action,
            meta,
            ts: serverTimestamp()
        });
    } catch (error) {
        console.error("Failed to write to audit log:", error);
    }
}


export async function saveUserProfile(uid: string, data: { displayName?: string }, avatarFile?: File | null) {
  const { auth, db, storage } = await initializeFirebaseServices();
  if (!auth?.currentUser || !db || !storage) throw new Error("Firebase not initialized.");

  let photoURL = auth.currentUser.photoURL;

  // 1. Upload avatar if provided
  if (avatarFile) {
    const storageRef = ref(storage, `users/${uid}/avatar.jpg`);
    await uploadBytes(storageRef, avatarFile);
    photoURL = await getDownloadURL(storageRef);
  }

  const profileData: { displayName?: string, photoURL?: string | null } = {};
  if (data.displayName && data.displayName !== auth.currentUser.displayName) {
    profileData.displayName = data.displayName;
  }
  if (photoURL && photoURL !== auth.currentUser.photoURL) {
      profileData.photoURL = photoURL;
  }

  // 2. Update Auth profile
  if (Object.keys(profileData).length > 0) {
      await updateProfile(auth.currentUser, profileData);
  }

  // 3. Update Firestore user doc
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  const firestoreUpdateData: any = { updatedAt: serverTimestamp() };
  if(data.displayName && data.displayName !== userDoc.data()?.displayName) {
      firestoreUpdateData.displayName = data.displayName;
  }
  if(photoURL && photoURL !== userDoc.data()?.photoURL) {
      firestoreUpdateData.photoURL = photoURL;
  }

  if(Object.keys(firestoreUpdateData).length > 1) {
    await setDoc(userDocRef, firestoreUpdateData, { merge: true });
  }
  
  // 4. Log action
  await logUserAction("update_profile", { changed: Object.keys(profileData) });
}

async function reauthenticate(password: string) {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth?.currentUser?.email) throw new Error("User or email not found for re-authentication.");
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
    return credential;
}


export async function updateEmailWithReauth(password: string, newEmail: string) {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth?.currentUser) throw new Error("Not authenticated.");
    await reauthenticate(password);
    await updateEmail(auth.currentUser, newEmail);
    // Note: Firebase sends a verification email automatically.
    await logUserAction("update_email_attempt");
}

export async function updatePasswordWithReauth(currentPassword: string, newPassword: string) {
    const { auth } = getFirebaseInstancesIfReady();
    if (!auth?.currentUser) throw new Error("Not authenticated.");
    await reauthenticate(currentPassword);
    await updatePassword(auth.currentUser, newPassword);
    await logUserAction("change_password");
}

export async function deleteUserAccount() {
    const { functions, auth } = await initializeFirebaseServices();
    if (!functions || !auth?.currentUser) throw new Error("Firebase not fully initialized.");
    const adminDeleteUser = httpsCallable(functions, 'adminDeleteUser');
    await adminDeleteUser({ uid: auth.currentUser.uid });
    // The auth listener in AuthProvider will handle the sign out and redirection.
}
