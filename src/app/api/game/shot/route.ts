import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { ApiError } from '@/lib/api-error';
import { resolveShot, checkWin, checkDraw } from '@/lib/game/battle';
import { Board } from '@/lib/game/board';
import { Ship } from '@/lib/game/ships';

const COOLDOWN_HIT = 2000;
const COOLDOWN_MISS = 5000;

interface ShotResult {
  hit: boolean;
  sunk: boolean;
  bombExplosion: boolean;
  shipType?: string;
}

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

    if (room.status !== 'battle') {
      throw new ApiError(400, 'Game is not in battle phase');
    }

    if (!room.players?.[playerId]) {
      throw new ApiError(403, 'Player not in this game room');
    }

    const opponentId = Object.keys(room.players).find(pid => pid !== playerId);
    if (!opponentId) {
      throw new ApiError(404, 'No opponent found');
    }

    const opponent = room.players[opponentId];
    const player = room.players[playerId];
    const lastShotTime = player.lastShotTime || 0;
    const now = Date.now();
    const cooldown = player.cooldown || COOLDOWN_MISS;

    if (now - lastShotTime < cooldown) {
      throw new ApiError(429, 'Cooldown not elapsed');
    }

    const opponentBoard = opponent.board as Board;
    const opponentShips = opponent.ships as Ship[];

    if (opponentBoard[y][x] === 'hit' || opponentBoard[y][x] === 'miss') {
      throw new ApiError(400, 'Cell already targeted');
    }

    const result = resolveShot(opponentBoard, opponentShips, x, y);

    const shotId = `${playerId}_${now}`;
    const newCooldown = result.hit ? COOLDOWN_HIT : COOLDOWN_MISS;

    await roomRef.child(`players/${playerId}/lastShotTime`).set(now);
    await roomRef.child(`players/${playerId}/cooldown`).set(newCooldown);
    await roomRef.child(`players/${opponentId}/board`).set(result.newBoard);
    if (result.newShips) {
      await roomRef.child(`players/${opponentId}/ships`).set(result.newShips);
    }

    const shotData = {
      from: playerId,
      x,
      y,
      timestamp: now,
      hit: result.hit,
      sunk: result.sunk,
      bombExplosion: result.bombExplosion,
    };
    await roomRef.child(`shots/${shotId}`).set(shotData);

    const updatedSnapshot = await roomRef.get();
    const updatedRoom = updatedSnapshot.val();
    const updatedOpponentShips = updatedRoom.players[opponentId].ships;

    const opponentWon = checkWin(updatedOpponentShips);
    const playerWon = checkWin(player.ships);

    if (opponentWon && playerWon) {
      await roomRef.child('status').set('finished');
      await roomRef.child('winner').set('draw');
    } else if (opponentWon) {
      await roomRef.child('status').set('finished');
      await roomRef.child('winner').set(opponentId);
    } else if (playerWon) {
      await roomRef.child('status').set('finished');
      await roomRef.child('winner').set(playerId);
    }

    return NextResponse.json({
      success: true,
      shotId,
      result: {
        hit: result.hit,
        sunk: result.sunk,
        bombExplosion: result.bombExplosion,
        shipType: result.sunk ? opponentShips.find(s => s.hits.every(h => h))?.type : undefined,
      },
      cooldown: newCooldown,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return error.toResponse();
    }
    console.error('Shot error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
