'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { signInAnonymously, User } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { MatchmakingStatus } from '@/lib/types';

interface UseMatchmakingResult {
  user: User | null;
  status: MatchmakingStatus;
  roomId: string | null;
  error: string | null;
  joinQueue: () => Promise<void>;
  leaveQueue: () => Promise<void>;
}

export function useMatchmaking(): UseMatchmakingResult {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<MatchmakingStatus>('idle');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const result = await signInAnonymously(auth);
        if (mounted) {
          setUser(result.user);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to authenticate');
          setStatus('error');
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const queueRef = ref(db, `matchmaking/queue/${user.uid}`);

    const handleQueueChange = onValue(queueRef, (snapshot) => {
      if (snapshot.exists()) {
        setStatus('searching');
      } else {
        if (status === 'searching') {
          setStatus('idle');
        }
      }
    });

    return () => {
      off(queueRef, 'value', handleQueueChange);
    };
  }, [user, status]);

  useEffect(() => {
    if (!user) return;

    const gamesRef = ref(db, 'games');

    const handleGamesChange = onValue(gamesRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const games = snapshot.val();
      const userId = user.uid;

      for (const [id, game] of Object.entries(games) as [string, any][]) {
        if (game.players && game.players[userId]) {
          setRoomId(id);
          setStatus('matched');
          break;
        }
      }
    });

    return () => {
      off(gamesRef, 'value', handleGamesChange);
    };
  }, [user]);

  const joinQueue = useCallback(async () => {
    if (!user) {
      setError('Not authenticated');
      return;
    }

    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/matchmaking/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to join queue');
      }

      setStatus('searching');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join queue');
      setStatus('error');
    }
  }, [user]);

  const leaveQueue = useCallback(async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await fetch('/api/matchmaking/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus('idle');
    } catch (err) {
      console.error('Leave queue error:', err);
    }
  }, [user]);

  return {
    user,
    status,
    roomId,
    error,
    joinQueue,
    leaveQueue,
  };
}
