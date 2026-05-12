'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { useBattleState } from '@/hooks/useBattleState';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import Board from '@/components/game/Board';
import SetupControls from '@/components/game/SetupControls';
import EnemyBoard from '@/components/game/EnemyBoard';
import OwnBoard from '@/components/game/OwnBoard';
import CooldownIndicator from '@/components/game/CooldownIndicator';
import GameOver from '@/components/game/GameOver';

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

  const {
    targetedCells,
    hitCells,
    canFire,
    remainingCooldown,
    totalCooldown,
    fire,
    winner,
  } = useBattleState(roomId, game);

  const [isPlacementMode, setIsPlacementMode] = useState(false);

  useEffect(() => {
    if (status === 'matched' && matchedRoomId && matchedRoomId !== roomId) {
      router.push(`/game/${matchedRoomId}`);
    }
  }, [status, matchedRoomId, roomId, router]);

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

  const handleCellClick = async (x: number, y: number) => {
    if (!isPlacementMode || !currentUserId) return;

    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    const response = await fetch('/api/game/bomb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomId, x, y }),
    });

    if (response.ok) {
      setIsPlacementMode(false);
    }
  };

  const handleEnemyCellClick = (x: number, y: number) => {
    if (canFire) {
      fire(x, y);
    }
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

  if (game.status === 'finished') {
    return (
      <GameOver
        game={game}
        currentUserId={currentUserId}
      />
    );
  }

  if (game.status === 'battle') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
        <h1 className="text-3xl font-bold">Battle Phase</h1>

        <CooldownIndicator
          remainingMs={remainingCooldown}
          totalMs={totalCooldown}
        />

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Your Fleet</h2>
            {currentPlayerState && (
              <OwnBoard
                board={currentPlayerState.board}
                hitCells={hitCells}
                bombPosition={currentPlayerState.bombPosition}
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Enemy Waters</h2>
            <EnemyBoard
              targetedCells={targetedCells}
              onCellClick={handleEnemyCellClick}
              canFire={canFire}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-xl text-slate-400">Unknown game state</div>
    </main>
  );
}

import { auth } from '@/lib/firebase';
