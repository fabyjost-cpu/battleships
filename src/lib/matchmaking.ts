import { adminDb } from './firebase-admin';
import { GameRoom, PlayerState, QueueEntry } from './types';
import { createShips } from './game/ships';
import { generateBoard, placeShipRandomly } from './game/board';

const SETUP_TIMEOUT_MS = 30000;

export async function matchPlayers(): Promise<string | null> {
  const queueRef = adminDb.ref('matchmaking/queue');
  const snapshot = await queueRef.get();

  if (!snapshot.exists()) {
    return null;
  }

  const queue: Record<string, QueueEntry> = snapshot.val();
  const playerIds = Object.keys(queue);

  if (playerIds.length < 2) {
    return null;
  }

  const sorted = playerIds
    .map(id => ({ id, entry: queue[id] }))
    .sort((a, b) => a.entry.joinedAt - b.entry.joinedAt);

  const [playerA, playerB] = sorted;
  const roomId = await createGameRoom(playerA.id, playerB.id);

  await queueRef.child(playerA.id).remove();
  await queueRef.child(playerB.id).remove();

  return roomId;
}

export async function createGameRoom(playerA: string, playerB: string): Promise<string> {
  const gamesRef = adminDb.ref('games');
  const newRoomRef = gamesRef.push();
  const roomId = newRoomRef.key!;

  const { ships: shipsA, board: boardA } = createShips();
  const { ships: shipsB, board: boardB } = createShips();

  const playerAState: PlayerState = {
    board: boardA,
    ships: shipsA,
    bombPosition: null,
    ready: false,
    cooldown: 0,
    stats: { hits: 0, misses: 0, shotsFired: 0 },
  };

  const playerBState: PlayerState = {
    board: boardB,
    ships: shipsB,
    bombPosition: null,
    ready: false,
    cooldown: 0,
    stats: { hits: 0, misses: 0, shotsFired: 0 },
  };

  const roomData: GameRoom = {
    status: 'setup',
    phaseEndsAt: Date.now() + SETUP_TIMEOUT_MS,
    winner: null,
    players: {
      [playerA]: playerAState,
      [playerB]: playerBState,
    },
    shots: [],
  };

  await newRoomRef.set(roomData);

  return roomId;
}

export function setupMatchmakingListener(): void {
  const queueRef = adminDb.ref('matchmaking/queue');

  queueRef.on('value', async (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    const queue: Record<string, QueueEntry> = snapshot.val();
    const playerCount = Object.keys(queue).length;

    if (playerCount >= 2) {
      try {
        await matchPlayers();
      } catch (error) {
        console.error('Matchmaking error:', error);
      }
    }
  });
}

export async function handleSetupTimeout(roomId: string): Promise<void> {
  const roomRef = adminDb.ref(`games/${roomId}`);
  const snapshot = await roomRef.get();

  if (!snapshot.exists()) {
    return;
  }

  const room: GameRoom = snapshot.val();

  if (room.status !== 'setup') {
    return;
  }

  const now = Date.now();
  if (now < room.phaseEndsAt) {
    return;
  }

  const players = room.players;
  const playerIds = Object.keys(players);
  const allReady = playerIds.every(pid => players[pid].ready);

  if (allReady) {
    await roomRef.child('status').set('battle');
    return;
  }

  const updatedPlayers: Record<string, PlayerState> = {};

  for (const pid of playerIds) {
    const player = players[pid];
    if (player.ready) {
      updatedPlayers[pid] = player;
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
        ...player,
        board: boardWithShips,
        ships: shipsArray,
        bombPosition,
        ready: true,
      };
    }
  }

  await roomRef.child('players').set(updatedPlayers);
  await roomRef.child('status').set('battle');
}
