'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchmaking } from '@/hooks/useMatchmaking';

export default function Home() {
  const { status, roomId, joinQueue, leaveQueue, error } = useMatchmaking();
  const router = useRouter();

  useEffect(() => {
    if (status === 'matched' && roomId) {
      router.push(`/game/${roomId}`);
    }
  }, [status, roomId, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Battleships</h1>
      <p className="mt-4 text-slate-400">Real-time 2-player game</p>

      <div className="mt-8 flex flex-col items-center gap-4">
        {status === 'idle' && (
          <button
            onClick={joinQueue}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Match
          </button>
        )}

        {status === 'searching' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg text-slate-300">Searching for opponent...</div>
            <button
              onClick={leaveQueue}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg text-red-400">{error}</div>
            <button
              onClick={joinQueue}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
