export interface QueueEntry {
  joinedAt: number;
  status: 'waiting';
}

import { Ship } from './game/ships';

export interface PlayerState {
  board: string[][];
  ships: Ship[];
  bombPosition: { x: number; y: number } | null;
  ready: boolean;
  cooldown: number;
  lastShotTime?: number;
  stats: {
    hits: number;
    misses: number;
    shotsFired: number;
  };
}

export interface GameRoom {
  status: 'setup' | 'battle' | 'finished';
  phaseEndsAt: number;
  currentTurnEndsAt?: number;
  winner: string | null;
  players: Record<string, PlayerState>;
  shots: Shot[];
}

export interface Shot {
  from: string;
  x: number;
  y: number;
  timestamp: number;
  hit?: boolean;
  sunk?: boolean;
  bombExplosion?: boolean;
}

export type MatchmakingStatus = 'idle' | 'searching' | 'matched' | 'error';
