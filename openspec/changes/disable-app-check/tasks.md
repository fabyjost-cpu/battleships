## 1. Disable App Check Enforcement

- [ ] 1.1 Navigate to Firebase Console → App Check
- [ ] 1.2 Click on each service (Authentication, Realtime Database)
- [ ] 1.3 Disable enforcement for each service

## 2. Verify Configuration

- [ ] 2.1 Confirm all services show "Disabled" status in App Check dashboard

## 3. Test Site Accessibility

- [ ] 3.1 Navigate to deployed Vercel URL in browser
- [ ] 3.2 Verify page loads without 401 error

## 4. Run E2E Tests

- [ ] 4.1 Run `npm run test:e2e`
- [ ] 4.2 Verify all tests pass
