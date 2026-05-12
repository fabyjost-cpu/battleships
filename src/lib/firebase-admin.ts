import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

let adminDbInstance: ReturnType<typeof getDatabase> | null = null;

function getAdminDb() {
  if (adminDbInstance) {
    return adminDbInstance;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin environment variables. ' +
      'Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  const firebaseAdmin = getApps().length === 0
    ? initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        databaseURL: 'https://workshop-battleships-default-rtdb.firebaseio.com',
      })
    : getApps()[0];

  adminDbInstance = getDatabase(firebaseAdmin);
  return adminDbInstance;
}

export const adminDb = new Proxy({} as ReturnType<typeof getDatabase>, {
  get(_target, prop) {
    return getAdminDb()[prop as keyof ReturnType<typeof getDatabase>];
  },
});
