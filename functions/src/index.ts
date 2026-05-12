import * as functions from 'firebase-functions';
import { adminDb } from './db';

export { adminDb };

// Placeholder for future Cloud Functions
export const onMatchmakingJoin = functions.https.onCall(async (data, context) => {
  // TODO: Implement matchmaking join
  return { success: true };
});

export const onMatchmakingLeave = functions.https.onCall(async (data, context) => {
  // TODO: Implement matchmaking leave
  return { success: true };
});
