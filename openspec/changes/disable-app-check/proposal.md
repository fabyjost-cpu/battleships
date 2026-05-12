## Why

Firebase App Check enforcement is blocking all unauthenticated requests to Firebase services, causing the deployed site to return 401 errors. This prevents E2E tests from running and users from accessing the game. App Check was likely enabled during development but is too aggressive for a hobby game that doesn't need abuse prevention at this scale.

## What Changes

- Disable Firebase App Check enforcement for the `workshop-battleships` Firebase project
- No code changes required - this is a Firebase Console configuration change
- E2E tests will be updated to handle Firebase auth gracefully

## Capabilities

### New Capabilities
- `app-check-config`: Documents Firebase App Check configuration state (disabled)

### Modified Capabilities
- (none)

## Impact

- **Firebase Console**: App Check enforcement must be disabled
- **Testing**: E2E tests currently fail due to Firebase blocking anonymous auth
- **Production**: Site returns 401 error to all users
