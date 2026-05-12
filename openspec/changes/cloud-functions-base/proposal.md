## Why

The Vercel Serverless Functions need to interact with Firebase Realtime Database for game state management and matchmaking. Currently only the client-side Firebase SDK is configured; we need server-side Firebase Admin SDK access with proper error handling.

## What Changes

- Add `firebase-admin` package for server-side Firebase access
- Create `src/lib/firebase-admin.ts` with Firebase Admin initialization
- Export `adminDb` reference for use across all API routes
- Add centralized error handling wrapper for API routes using `HttpsError`-style responses
- Configure service account credentials from environment variables

## Capabilities

### New Capabilities

- `firebase-admin`: Firebase Admin SDK initialization and database access for Vercel Serverless Functions

## Impact

- New dependency: `firebase-admin` npm package
- All API routes (`src/app/api/`) will use `adminDb` from `src/lib/firebase-admin.ts`
- Environment variables required: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
