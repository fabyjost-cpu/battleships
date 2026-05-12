'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import { GameRoom, PlayerState } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UseGameStateResult {
  game: GameRoom | null;
  loading: boolean;
  error: string | null;
  currentPlayerState: PlayerState | null;
  opponentState: PlayerState | null;
  currentUserId: string | null;
}

export function useGameState(roomId: string | null): UseGameStateResult {
  const [game, setGame] = useState<GameRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid ?? null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!roomId) {
      setGame(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const gameRef = ref(db, `games/${roomId}`);

    const handleSnapshot = (snapshot: any) => {
      try {
        if (snapshot.exists()) {
          setGame(snapshot.val());
          setError(null);
        } else {
          setGame(null);
          setError('Game room not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load game state');
        setLoading(false);
      }
    };

    onValue(gameRef, handleSnapshot, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => {
      off(gameRef, 'value', handleSnapshot);
    };
  }, [roomId]);

  const currentPlayerState = game?.players && currentUserId
    ? game.players[currentUserId] ?? null
    : null;

  const opponentState = game?.players && currentUserId
    ? Object.entries(game.players)
        .filter(([pid]) => pid !== currentUserId)
        .map(([, state]) => state)[0] ?? null
    : null;

  return {
    game,
    loading,
    error,
    currentPlayerState,
    opponentState,
    currentUserId,
  };
}
