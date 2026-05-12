## ADDED Requirements

### Requirement: Firebase CLI configuration
The system SHALL have a `firebase.json` file configured for Firebase CLI deployment.

### Requirement: Realtime Database configuration
The `firebase.json` SHALL include configuration for Firebase Realtime Database.

### Requirement: Cloud Functions configuration
The `firebase.json` SHALL include configuration for Cloud Functions with Node.js runtime using TypeScript.

### Requirement: Hosting configuration
The `firebase.json` SHALL include configuration for Firebase Hosting pointing to Next.js build output.

### Requirement: Emulator configuration
The system SHALL have Firebase emulator configuration for local development of RTDB and Cloud Functions.

#### Scenario: Firebase deploy targets are configured
- **WHEN** `firebase deploy --only hosting` is run
- **THEN** Firebase CLI deploys to the configured hosting site

#### Scenario: Emulators start successfully
- **WHEN** `firebase emulators:start` is run
- **THEN** RTDB and Functions emulators start on default ports without errors
