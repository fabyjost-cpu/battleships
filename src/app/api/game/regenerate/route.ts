import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { ApiError } from '@/lib/api-error';
import { createShips } from '@/lib/game/ships';

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
    const { roomId } = body;

    if (!roomId) {
      throw new ApiError(400, 'Missing roomId');
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

    if (room.players[playerId].ready) {
      throw new ApiError(400, 'Cannot regenerate after ready');
    }

    // Check if setup phase has timed out
    const now = Date.now();
    const timedOut = now > room.phaseEndsAt;

    if (timedOut) {
      // Auto-finalize setup for all players and transition to battle
      const players = room.players;
      const updatedPlayers: Record<string, any> = {};

      for (const pid of Object.keys(players)) {
        const p = players[pid];
        if (p.ready) {
          updatedPlayers[pid] = p;
        } else {
          const { ships: shipsArray, board: boardWithShips } = createShips();

          const emptyPositions: { x: number; y: number }[] = [];
          for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
              if (boardWithShips[y][x] === 'water') {
                emptyPositions.push({ x, y });
              }
            }
          }

          const bombPosition = emptyPositions.length > 0
            ? emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
            : null;

          updatedPlayers[pid] = {
            ...p,
            board: boardWithShips,
            ships: shipsArray,
            bombPosition,
            ready: true,
          };
        }
      }

      await roomRef.child('players').set(updatedPlayers);
      await roomRef.child('status').set('battle');
      return NextResponse.json({ success: true, timedOut: true });
    }

    const { ships: newShips, board: newBoard } = createShips();

    await roomRef.child(`players/${playerId}/board`).set(newBoard);
    await roomRef.child(`players/${playerId}/ships`).set(newShips);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    console.error('Regenerate error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
