## 1. Initialize Next.js 14 Project

- [x] 1.1 Create Next.js 14 app with App Router and TypeScript using `npx create-next-app@latest battleships --typescript --tailwind --app --src-dir --no-git`
- [x] 1.2 Enable strict TypeScript mode in tsconfig.json if not default
- [x] 1.3 Create folder structure: `src/components/`, `src/lib/`, `src/types/`, `src/app/game/`
- [x] 1.4 Verify `npm run dev` starts without errors

## 2. Configure Firebase Client SDK

- [x] 2.1 Install Firebase client SDK: `npm install firebase`
- [x] 2.2 Create `src/lib/firebase.ts` with Firebase initialization using provided config
- [x] 2.3 Export `db` (database reference) and `analytics` from firebase.ts
- [x] 2.4 Configure Anonymous Auth in firebase.ts
- [x] 2.5 Create `.env.local` with Firebase config:
  - NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA1HvLCr6m9nduKgYs2idDMAxX92hoggR8
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=workshop-battleships.firebaseapp.com
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID=workshop-battleships
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=workshop-battleships.firebasestorage.app
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=284638327796
  - NEXT_PUBLIC_FIREBASE_APP_ID=1:284638327796:web:cf361c54042b204268ffa1
  - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Q6YT6J1425

## 3. Configure Tailwind Design System

- [x] 3.1 Update `tailwind.config.ts` with design system colors from guidelines.md
- [x] 3.2 Add primary (blue-500), secondary (gray-500), success (green-500), danger (red-500), background (slate-900), surface (slate-800)
- [x] 3.3 Update `src/app/globals.css` to set default background to slate-900
- [x] 3.4 Verify Tailwind classes render correctly with design colors

## 4. Configure Firebase Cloud Functions

- [x] 4.1 Install Firebase CLI globally if not present: `npm install -g firebase-tools`
- [x] 4.2 Initialize Cloud Functions in `functions/` folder with `firebase init functions`
- [x] 4.3 Configure functions/package.json with TypeScript and firebase-admin dependency (Cloud Functions in TypeScript)
- [x] 4.4 Create `functions/src/db.ts` with Firebase Admin initialization
- [x] 4.5 Export `adminDb` reference from `functions/src/db.ts`
- [x] 4.6 Create `functions/src/index.ts` as entry point with placeholder exports

## 5. Configure Firebase Project

- [x] 5.1 Create `firebase.json` with RTDB, Functions, and Hosting configuration
- [x] 5.2 Configure hosting to serve Next.js build output from `.next/`
- [x] 5.3 Configure Cloud Functions with Node.js 18 runtime
- [x] 5.4 Set up Firebase emulators in `firebase.json` for RTDB and Functions
- [ ] 5.5 Verify `firebase emulators:start` runs without errors

## 6. Initialize Git Repository

- [x] 6.1 Run `git init` in project root
- [x] 6.2 Create initial commit with project skeleton
- [x] 6.3 Create `feat/setup` branch from main for this change
- [x] 6.4 Add `.gitignore` excluding node_modules, .next, firebase-debug.log, emulators.debug.log

## 7. Verify Project

- [x] 7.1 Verify `npm run build` completes without errors
- [x] 7.2 Verify Firebase emulators start correctly (Java 21 installed, emulators running on ports 9099/5001/9000/3000)
- [x] 7.3 Verify landing page renders at localhost:3000
