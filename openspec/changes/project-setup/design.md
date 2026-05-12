## Context

The Battleships game is a new project requiring a complete foundation setup. The TODO.md defines 7 sequential slices, with project setup being the first. The tech stack is defined in CLAUDE.md and architecture.md: Next.js 14 App Router + Firebase (RTDB, Cloud Functions, Hosting) + Tailwind CSS.

## Goals / Non-Goals

**Goals:**
- Initialize Next.js 14 with App Router and TypeScript
- Integrate Firebase client SDK and Admin SDK
- Configure Tailwind CSS with design tokens from guidelines.md
- Create the folder structure defined in architecture.md
- Enable Firebase emulators for local development
- Set up git with initial commit on main branch

**Non-Goals:**
- Implementing game logic (Slice 2)
- Setting up actual Firebase production project (only config placeholders)
- Writing tests (covered in subsequent slices)
- Deploying to Firebase production

## Decisions

### Next.js 14 with App Router
**Decision**: Use Next.js 14 with App Router, not Pages Router.
**Rationale**: App Router is the current default and supports React Server Components, which aligns with the project's need for real-time game state. Tailwind integration is standard with App Router.
**Alternatives**: Pages Router was considered but is legacy; no other framework considered due to CLAUDE.md constraint.

### Tailwind CSS Configuration
**Decision**: Configure Tailwind with design tokens from guidelines.md (colors, spacing, typography).
**Rationale**: Guidelines.md defines a specific dark theme color palette (slate-900 background, slate-800 surface) that should be codified in tailwind.config.ts.
**Alternatives**: Using default Tailwind colors was rejected to maintain consistency with the design system.

### Firebase SDK Versions
**Decision**: Use latest stable versions of firebase and firebase-admin.
**Rationale**: Firebase has rapid releases; latest stable avoids known bugs while providing modern features.
**Alternatives**: Pinning specific versions was considered but adds maintenance burden.

### Firebase Emulators
**Decision**: Configure Firebase CLI with emulator support.
**Rationale**: Development requires local Firebase emulators for RTDB and Cloud Functions. This avoids needing a live Firebase project for development.
**Alternatives**: Using production Firebase directly was rejected due to cost and latency for development.

### Git Initialization
**Decision**: Initialize git with `main` branch and initial commit.
**Rationale**: The TODO.md specifies `feat/setup` branch as the first feature branch. Starting with a clean main and branching from it follows the workflow defined in guidelines.md.
**Alternatives**: Starting on main directly was rejected per the git workflow specification.

## Risks / Trade-offs

- **Firebase Config Exposure** → Use environment variables (.env.local) for all Firebase credentials. Never commit service account keys.
- **Next.js Server Components** → Game components need `'use client'` directive since they use Firebase listeners and hooks. Add a note in the folder structure.
- **Emulator Performance** → RTDB emulator can be slow on Windows. If issues arise, recommend increasing memory allocation.

## Migration Plan

1. Create Next.js app with `npx create-next-app`
2. Add Firebase dependencies
3. Configure Tailwind with design tokens
4. Create folder structure per architecture.md
5. Add Firebase config to .env.local with placeholders
6. Initialize git with main branch
7. Verify emulators start correctly

## Open Questions

1. Firebase project ID and credentials - user will provide these for .env.local
2. Whether to use JavaScript or TypeScript for Cloud Functions (TypeScript recommended but requires additional config)
