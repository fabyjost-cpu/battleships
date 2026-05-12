## ADDED Requirements

> **Note:** This spec was partially implemented. Cloud Functions were set up but the architecture has since been updated to use **Vercel Serverless Functions** instead, due to Firebase Cloud Functions requiring a Blaze (paid) plan. Firebase Realtime Database and Firebase Hosting are still in use.

### Requirement: Firebase CLI configuration
The system SHALL have a `firebase.json` file configured for Firebase CLI deployment.

### Requirement: Realtime Database configuration
The `firebase.json` SHALL include configuration for Firebase Realtime Database.

### Requirement: Vercel configuration
The system SHALL have a `vercel.json` file configured for Vercel deployment of serverless functions and Next.js hosting.

### Requirement: Hosting configuration
The `vercel.json` SHALL include configuration for Next.js hosting.

#### Scenario: Vercel deploy targets are configured
- **WHEN** `vercel deploy` is run
- **THEN** Vercel CLI deploys to the configured project
