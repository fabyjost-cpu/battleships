## 1. Setup

- [x] 1.1 Install `firebase-admin` npm package as production dependency

## 2. Firebase Admin Module

- [x] 2.1 Create `src/lib/firebase-admin.ts` with Firebase Admin initialization
- [x] 2.2 Export `adminDb` reference from `src/lib/firebase-admin.ts`
- [x] 2.3 Handle missing environment variables with descriptive error

## 3. API Error Handling

- [x] 3.1 Create `src/lib/api-error.ts` with `ApiError` class
- [x] 3.2 Implement `toResponse()` method returning NextResponse with JSON body
- [x] 3.3 Support status code and optional error code

## 4. Verification

- [x] 4.1 Run `npm run build` to verify TypeScript compilation
- [x] 4.2 Create basic test verifying ApiError.toResponse() behavior
