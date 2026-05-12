import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { ApiError } from '@/lib/api-error';

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
    const body = await request.json();
    const { roomId, x, y } = body;

    if (!roomId || x === undefined || y === undefined) {
      throw new ApiError(400, 'Missing roomId, x, or y');
    }

    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      throw new ApiError(400, 'Invalid coordinates');
    }

    const roomRef = adminDb.ref(`games/${roomId}`);
    const snapshot = await roomRef.get();

    if (!snapshot.exists()) {
      throw new ApiError(404, 'Game room not found');
    }

    const room = snapshot.val();

    if (room.status !== 'setup') {
      throw new ApiError(400, 'Game is not in setup phase');
    }

    if (!room.players?.[playerId]) {
      throw new ApiError(403, 'Player not in this game room');
    }

    // Check if setup phase has timed out
    const now = Date.now();
    if (now > room.phaseEndsAt) {
      throw new ApiError(400, 'Setup phase has ended');
    }

    if (room.players[playerId].ready) {
      throw new ApiError(400, 'Cannot place bomb after ready');
    }

    const playerBoard = room.players[playerId].board;
    if (playerBoard[y][x] !== 'water') {
      throw new ApiError(400, 'Bomb can only be placed on water');
    }

    if (room.players[playerId].bombPosition !== null) {
      throw new ApiError(400, 'Bomb already placed');
    }

    await roomRef.child(`players/${playerId}/bombPosition`).set({ x, y });

    return NextResponse.json({ success: true, bombPosition: { x, y } });
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    console.error('Bomb placement error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
