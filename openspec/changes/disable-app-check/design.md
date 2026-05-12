## Context

Firebase App Check is currently enforcing token validation on all Firebase services (Auth, RTDB). This is blocking Playwright E2E tests and preventing users from accessing the deployed site. App Check was likely enabled during project setup but is too aggressive for a hobby game.

## Goals / Non-Goals

**Goals:**
- Restore site accessibility at https://battleships-qrgzuww7i-fabyjost-cpus-projects.vercel.app/
- Allow E2E tests to run against Firebase services

**Non-Goals:**
- Implement alternative authentication or abuse prevention
- Change Firebase pricing tier

## Decisions

**1. Disable App Check enforcement (not delete)**

Disable enforcement in Firebase Console rather than unregistering apps. This preserves App Check configuration for future use while removing the blocking behavior.

**Why**: App Check can be re-enabled later if abuse becomes an issue. Deleting the configuration would require re-setup.

**2. Keep existing Firebase configuration**

No code changes needed. The Firebase SDKs are already configured correctly - they just need to receive valid responses.

**Why**: Firebase App Check is a server-side enforcement, not a client-side requirement. The client code doesn't change.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Increased abuse potential | Monitor usage; re-enable App Check if needed |
| Firebase billing spike | Set usage limits in Firebase Console |
