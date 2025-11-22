
# X-Reply Autopilot: Admin Runbook

This document provides a guide for administrators on how to manage the application, bootstrap new admins, and use the admin panel features.

## 1. Bootstrapping the First Admin

To use the admin panel, at least one user must have an `admin` or `superadmin` custom claim in Firebase Auth. The initial admin must be seeded using a secure script that has access to your project's service account credentials.

**Prerequisites:**
- You must be authenticated with the Google Cloud SDK with permissions for the Firebase project. Run `gcloud auth application-default login`.
- Your `GCLOUD_PROJECT` environment variable must be set to your Firebase Project ID.
- The target user must already exist in Firebase Authentication.

### Steps:

1.  **Identify the User UID:**
    Find the UID of the user you want to make an admin from the Firebase Console -> Authentication -> Users page. The UID for `iamcalledgt@gmail.com` is `IAkQr6XOutgV94FwN6y16CHsfKN2`.

2.  **Set Environment Variable:**
    ```bash
    export GCLOUD_PROJECT=your-firebase-project-id
    ```

3.  **Run the Seed Script:**
    From the root of your project, run the following command:
    ```bash
    npm run seed-admin
    ```
    This script (`scripts/seedAdmin.ts`) will:
    - Set the custom claim `{ admin: true, role: "superadmin" }` on the target user.
    - Create a document in the `admins` collection for easy lookup in the UI.

4.  **Verify:**
    - Go to the Firebase Console -> Authentication. Find the user and check their "Identifier" column. You may need to refresh. The claim isn't directly visible but is active.
    - **Important**: Log in to the application as the newly-seeded admin. You may need to sign out and sign back in for the new claims to take effect. After signing in, you should see an "Admin" entry in the user menu (top-right) and be able to access `/admin`.

## 2. Using the Admin Panel

The Admin Panel is located at `/admin`.

### Dashboard
The dashboard provides a high-level overview of key application metrics:
- Total users
- Active users
- New signups
- Storage usage

It also shows a feed of the most recent admin and user actions.

### User Management
The `/admin/users` page allows you to manage all users in the system.

- **Search and Filter:** You can find users by email, UID, or role.
- **View Details:** Clicking on a user opens a detailed view where you can see their full profile, recent audit history, and connected devices.
- **Actions:** From the detail view, you can:
    - **Set Role:** Change a user's role (e.g., from `operator` to `admin`). This uses the `setCustomClaims` callable function.
    - **Deactivate/Reactivate:** Temporarily disable a user's account.
    - **Reset Password:** Trigger a password reset email to be sent to the user.
    - **Force Sign Out:** Revoke all active refresh tokens for the user, forcing them to log in again on all devices.
    - **Impersonate:** (Use with caution) Log in as the user in a separate, temporary session to debug issues from their perspective. This action is heavily audited.

### Bulk Actions
From the user list, you can select multiple users and perform bulk actions like assigning a role to all of them or deactivating them at once.

## 3. Manual Deployment Steps

1.  **Deploy Firestore & Storage Rules:**
    Ensure your local `firebase.json` points to the correct rules files.
    ```bash
    firebase deploy --only firestore:rules,storage:rules
    ```

2.  **Deploy Cloud Functions:**
    Deploy the new admin-related functions.
    ```bash
    firebase deploy --only functions:setCustomClaims,adminDeleteUser
    ```

3.  **Deploy the Web App:**
    Build and deploy your Next.js application.
    ```bash
    npm run build
    firebase deploy --only hosting
    ```
