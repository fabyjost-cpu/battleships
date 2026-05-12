import { initializeApp, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const emulatorHost = process.env.FIREBASE_DATABASE_EMULATOR_HOST;

if (!getApps().length) {
  if (emulatorHost) {
    initializeApp({
      projectId: 'workshop-battleships',
      databaseURL: `http://${emulatorHost}?ns=workshop-battleships`,
    });
  } else {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    const { cert } = await import('firebase-admin/app');
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: 'https://workshop-battleships-default-rtdb.firebaseio.com',
    });
  }
}

export const adminDb = getDatabase();
