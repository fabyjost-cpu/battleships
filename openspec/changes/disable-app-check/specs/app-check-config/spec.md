# app-check-config

## Capability Overview

Documents Firebase App Check configuration state for the Battleships project.

## ADDED Requirements

### Requirement: App Check enforcement is disabled
Firebase App Check enforcement SHALL be disabled for all Firebase services.

#### Scenario: App Check disabled in Firebase Console
- **WHEN** Firebase Console → App Check is accessed
- **THEN** All services show enforcement as "Disabled"

### Requirement: E2E tests can connect to Firebase
Playwright E2E tests SHALL be able to connect to Firebase services without App Check tokens.

#### Scenario: E2E tests pass with Firebase
- **WHEN** `npm run test:e2e` executes
- **THEN** Firebase Auth anonymous sign-in succeeds
- **THEN** Firebase RTDB read/write operations succeed

### Requirement: Site is accessible to users
The deployed site SHALL be accessible without authentication errors.

#### Scenario: Site loads without 401 error
- **WHEN** User navigates to the deployed Vercel URL
- **THEN** Page loads successfully
- **THEN** Firebase services respond without 401 Unauthorized errors
