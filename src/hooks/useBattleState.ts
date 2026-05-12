'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { GameRoom, Shot } from '@/lib/types';
import { CellState } from '@/components/game/Board';

interface UseBattleStateResult {
  targetedCells: Record<string, CellState>;
  hitCells: Record<string, CellState>;
  canFire: boolean;
  remainingCooldown: number;
  totalCooldown: number;
  fire: (x: number, y: number) => Promise<void>;
  winner: string | null | 'draw';
  loading: boolean;
}

const COOLDOWN_HIT = 2000;
const COOLDOWN_MISS = 5000;

export function useBattleState(
  roomId: string | null,
  game: GameRoom | null
): UseBattleStateResult {
  const [targetedCells, setTargetedCells] = useState<Record<string, CellState>>({});
  const [hitCells, setHitCells] = useState<Record<string, CellState>>({});
  const [remainingCooldown, setRemainingCooldown] = useState(0);
  const [totalCooldown, setTotalCooldown] = useState(COOLDOWN_MISS);
  const [canFire, setCanFire] = useState(true);
  const [winner, setWinner] = useState<string | null | 'draw'>(null);
  const [loading, setLoading] = useState(false);

  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastShotTimeRef = useRef<number>(0);
  const currentCooldownRef = useRef(COOLDOWN_MISS);

  const currentUserId = auth.currentUser?.uid ?? null;

  const startCooldown = useCallback((cooldownMs: number) => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }
    currentCooldownRef.current = cooldownMs;
    setTotalCooldown(cooldownMs);
    lastShotTimeRef.current = Date.now();
    setCanFire(false);

    cooldownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastShotTimeRef.current;
      const remaining = Math.max(0, cooldownMs - elapsed);
      setRemainingCooldown(remaining);

      if (remaining <= 0) {
        if (cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current);
        }
        setCanFire(true);
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const shotsRef = ref(db, `games/${roomId}/shots`);

    const handleShotsSnapshot = (snapshot: any) => {
      if (!snapshot.exists()) return;

      const shots: Shot[] = [];
      snapshot.forEach((child: any) => {
        shots.push({ ...child.val(), id: child.key });
      });

      const newTargeted: Record<string, CellState> = {};
      const newHitCells: Record<string, CellState> = {};

      shots.forEach((shot) => {
        const key = `${shot.x},${shot.y}`;
        if (shot.hit) {
          newTargeted[key] = 'hit';
          newHitCells[key] = 'hit';
        } else {
          newTargeted[key] = 'miss';
          newHitCells[key] = 'miss';
        }
      });

      setTargetedCells(newTargeted);
      setHitCells(newHitCells);
    };

    onValue(shotsRef, handleShotsSnapshot);

    return () => {
      off(shotsRef, 'value', handleShotsSnapshot);
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const gameRef = ref(db, `games/${roomId}`);

    const handleGameSnapshot = (snapshot: any) => {
      if (!snapshot.exists()) return;

      const gameData = snapshot.val() as GameRoom;
      if (gameData.status === 'finished') {
        setWinner(gameData.winner ?? null);
      }
    };

    onValue(gameRef, handleGameSnapshot);

    return () => {
      off(gameRef, 'value', handleGameSnapshot);
    };
  }, [roomId]);

  useEffect(() => {
    if (!game?.players || !currentUserId) return;

    const player = game.players[currentUserId];
    if (player?.lastShotTime && player?.cooldown) {
      const elapsed = Date.now() - player.lastShotTime;
      if (elapsed < player.cooldown) {
        startCooldown(player.cooldown);
        lastShotTimeRef.current = player.lastShotTime;
      } else {
        setCanFire(true);
        setRemainingCooldown(0);
        currentCooldownRef.current = player.cooldown;
        setTotalCooldown(player.cooldown);
      }
    }
  }, [game?.players, currentUserId, startCooldown]);

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const fire = useCallback(async (x: number, y: number) => {
    if (!canFire || !roomId) return;

    setLoading(true);
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/game/shot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId, x, y }),
      });

      if (response.ok) {
        const data = await response.json();
        const cooldownMs = data.cooldown ?? COOLDOWN_MISS;
        startCooldown(cooldownMs);
      }
    } catch (error) {
      console.error('Fire error:', error);
    } finally {
      setLoading(false);
    }
  }, [canFire, roomId, startCooldown]);

  return {
    targetedCells,
    hitCells,
    canFire,
    remainingCooldown,
    totalCooldown,
    fire,
    winner,
    loading,
  };
}
