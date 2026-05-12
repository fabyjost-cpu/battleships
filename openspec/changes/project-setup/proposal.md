## Why

The Battleships game requires a solid foundation before game logic, matchmaking, or UI can be built. This project setup establishes the Next.js 14 App Router structure, Firebase integration, Tailwind styling, and git workflow needed for all subsequent slices.

## What Changes

- Initialize Next.js 14 project with App Router in `/src/`
- Add Firebase SDK packages (client + admin)
- Configure Tailwind CSS with design system tokens
- Create folder structure per architecture.md
- Initialize git repo with initial commit
- Create firebase.json with RTDB, Functions, and Hosting
- Configure Firebase Anonymous Auth

## Capabilities

### New Capabilities

- `nextjs-foundation`: Next.js 14 App Router project with TypeScript, folder structure, and layout
- `firebase-integration`: Firebase client SDK, Admin SDK, and emulator support
- `tailwind-design-system`: Tailwind configuration with design tokens from guidelines.md
- `firebase-project-config`: Firebase project configuration for RTDB, Cloud Functions, Hosting, and Anonymous Auth

### Modified Capabilities

<!-- No existing capabilities -->

## Impact

- Creates `src/` directory with Next.js App Router structure
- Creates `functions/` directory for Cloud Functions
- Adds npm dependencies to `package.json`
- Creates `tailwind.config.ts` with design system colors
- Creates `firebase.json` for Firebase CLI
- Creates `.env.local` with Firebase config placeholders
