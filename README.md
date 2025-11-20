# X-Reply Autopilot

This is a Next.js frontend for X-Reply Autopilot, a system for managing automated replies on X (formerly Twitter). It's built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Firebase project

### 2. Installation

First, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd x-reply-autopilot
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.local.example .env.local
```

Now, fill in your Firebase project configuration in `.env.local`. You can find these values in your Firebase project settings.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FUNCTIONS_BASE_URL=...
NEXT_PUBLIC_OPENAI_API_KEY=...
```

**SECURITY: DO NOT COMMIT YOUR `.env.local` FILE TO VERSION CONTROL.**

### 4. Running the Development Server

To run the app locally, use the following command. This will start the Next.js development server.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### 5. Using Firebase Emulators

For local development, it is highly recommended to use the Firebase Emulators.

1.  Install the Firebase CLI: `npm install -g firebase-tools`
2.  Initialize Firebase in your project: `firebase init`
3.  Start the emulators: `firebase emulators:start`

The application is configured to automatically connect to the emulators when running in a development environment.

### 6. Building for Production

To create a production build, run:

```bash
npm run build
```

This will generate an optimized build in the `.next` directory.

### 7. Deploying to Firebase Hosting

To deploy the application to Firebase Hosting, run:

```bash
firebase deploy --only hosting
```

Make sure you have configured your `firebase.json` and `apphosting.yaml` files correctly for your project.

## Voice Guide

The UI microcopy and tone follow the GT Alternative-1 voice model. The core structure is:

**Hook → Context → Question → Emoji**

For more details, refer to the "Voice Guide" modal within the app's `/templates` section or the canonical spec document.
