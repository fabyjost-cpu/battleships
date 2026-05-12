'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import Board from '@/components/game/Board';
import SetupControls from '@/components/game/SetupControls';

export default function GameRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const { status, roomId: matchedRoomId } = useMatchmaking();

  const {
    game,
    loading,
    error,
    currentPlayerState,
    opponentState,
    currentUserId,
  } = useGameState(roomId);

  const [isPlacementMode, setIsPlacementMode] = useState(false);

  useEffect(() => {
    if (status === 'matched' && matchedRoomId && matchedRoomId !== roomId) {
      router.push(`/game/${matchedRoomId}`);
    }
  }, [status, matchedRoomId, roomId, router]);

  useEffect(() => {
    if (game?.status === 'battle' || game?.status === 'finished') {
      // Future: redirect to battle UI or game over
    }
  }, [game?.status]);

  const handleRegenerate = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    await fetch('/api/game/regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomId }),
    });
  };

  const handleReady = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    await fetch('/api/game/ready', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomId }),
    });
  };

  const handlePlaceBomb = () => {
    setIsPlacementMode(!isPlacementMode);
  };

  const handleCellClick = (x: number, y: number) => {
    if (!isPlacementMode || !currentUserId) return;
    // Bomb placement will be handled via API in future
    console.log(`Bomb placement at ${x}, ${y}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl text-slate-400">Loading game...</div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl text-red-400">{error || 'Game not found'}</div>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Lobby
        </button>
      </main>
    );
  }

  if (game.status === 'setup') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
        <h1 className="text-3xl font-bold">Setup Phase</h1>
        <div className="text-slate-400">
          Time remaining: {Math.max(0, Math.ceil((game.phaseEndsAt - Date.now()) / 1000))}s
        </div>

        {currentPlayerState && (
          <Board
            board={currentPlayerState.board}
            bombPosition={currentPlayerState.bombPosition}
            isSetup={true}
            isPlacementMode={isPlacementMode}
            onCellClick={handleCellClick}
          />
        )}

        {currentPlayerState && (
          <SetupControls
            isReady={currentPlayerState.ready}
            opponentReady={opponentState?.ready ?? false}
            bombPlaced={currentPlayerState.bombPosition !== null}
            onRegenerate={handleRegenerate}
            onReady={handleReady}
            onPlaceBomb={handlePlaceBomb}
          />
        )}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-xl text-slate-400">
        {game.status === 'battle' ? 'Battle Phase (coming soon)' : 'Game Over'}
      </div>
    </main>
  );
}

import { auth } from '@/lib/firebase';
