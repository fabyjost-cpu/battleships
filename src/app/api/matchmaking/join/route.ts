import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { ApiError } from '@/lib/api-error';
import { QueueEntry } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid authorization header');
    }

    const idToken = authHeader.substring(7);
    const { getAuth } = await import('firebase-admin/auth');
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch {
      throw new ApiError(401, 'Invalid ID token');
    }

    const playerId = decodedToken.uid;
    const queueRef = adminDb.ref(`matchmaking/queue/${playerId}`);

    const existing = await queueRef.get();
    if (existing.exists()) {
      throw new ApiError(409, 'Already in matchmaking queue');
    }

    const entry: QueueEntry = {
      joinedAt: Date.now(),
      status: 'waiting',
    };

    await queueRef.set(entry);

    const onDisconnectRef = adminDb.ref(`matchmaking/queue/${playerId}`);
    await onDisconnectRef.onDisconnect().remove();

    return NextResponse.json({ success: true, playerId });
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    console.error('Join queue error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
