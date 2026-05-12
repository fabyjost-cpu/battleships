## Context

The project uses Firebase Realtime Database (RTDB) for real-time game state sync and matchmaking. Client-side Firebase is configured in `src/lib/firebase.ts`. The Vercel Serverless Functions (API routes in `src/app/api/`) need server-side access to RTDB using Firebase Admin SDK.

Current state: Only client SDK exists, serverless functions cannot access RTDB.

## Goals / Non-Goals

**Goals:**
- Initialize Firebase Admin SDK in a reusable module
- Export `adminDb` for use across all API routes
- Provide error handling utility for consistent API error responses

**Non-Goals:**
- Implementing any game logic in this slice (handled by game-logic library)
- Implementing actual API routes (future slices)
- Client-side Firebase changes

## Decisions

### Decision: Firebase Admin Initialization Location

**Choice**: `src/lib/firebase-admin.ts`

**Rationale**: Follows existing pattern from `src/lib/firebase.ts` (client SDK). Keeps all Firebase-related code in `src/lib/`. API routes already import from `src/lib/`.

**Alternatives**:
- `src/app/api/firebase-admin.ts` - Would require relative imports like `../../lib/firebase-admin`
- `src/lib/admin.ts` - Less explicit about Firebase focus

### Decision: Credential Management

**Choice**: Environment variables `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

**Rationale**: Vercel provides seamless environment variable management. Firebase Admin SDK supports credential object creation from these values. Private key uses newline-escaped string format.

**Alternatives**:
- Service account JSON file - Would require file management in repo
- Default credentials (`google.auth.ApplicationDefaultCredentials`) - Requires GCP setup beyond Firebase

### Decision: Error Handling Pattern

**Choice**: Centralized `ApiError` class with `toResponse()` method returning NextResponse

**Rationale**: Next.js API routes use NextResponse. Having a consistent error format across all routes improves client error handling. Using standard HTTP status codes.

**Alternatives**:
- Firebase HttpsError pattern - Designed for Cloud Functions, not Next.js
- Throw errors and let Next.js handle - Less control over error response format

## Risks / Trade-offs

[Risk] Environment variables not set → Mitigation: Next.js will throw at runtime; fail fast with clear message

[Risk] Private key newline escaping → Mitigation: Use `FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')` during initialization

## Migration Plan

1. Add `firebase-admin` to dependencies
2. Create `src/lib/firebase-admin.ts` with initialization
3. Create `src/lib/api-error.ts` for error handling
4. Verify with `npm run build`
5. Future slices import and use `adminDb` and `ApiError`
