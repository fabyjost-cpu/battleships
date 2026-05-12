'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCooldownTimerResult {
  remainingMs: number;
  totalMs: number;
  canFire: boolean;
}

export function useCooldownTimer(
  cooldownMs: number,
  enabled: boolean = true
): UseCooldownTimerResult {
  const [remainingMs, setRemainingMs] = useState(0);
  const [totalMs, setTotalMs] = useState(cooldownMs);
  const startTimeRef = useRef<number | null>(null);
  const cooldownMsRef = useRef(cooldownMs);

  cooldownMsRef.current = cooldownMs;

  const reset = useCallback((newCooldownMs?: number) => {
    const ms = newCooldownMs ?? cooldownMsRef.current;
    setTotalMs(ms);
    setRemainingMs(ms);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!enabled) {
      setRemainingMs(0);
      setTotalMs(cooldownMs);
      return;
    }

    reset(cooldownMs);

    const interval = setInterval(() => {
      if (startTimeRef.current === null) {
        setRemainingMs(cooldownMsRef.current);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, cooldownMsRef.current - elapsed);
      setRemainingMs(remaining);

      if (remaining <= 0) {
        startTimeRef.current = null;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [enabled, cooldownMs, reset]);

  return {
    remainingMs,
    totalMs,
    canFire: remainingMs <= 0,
  };
}
