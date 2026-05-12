'use client';

import { useRouter } from 'next/navigation';
import { GameRoom, PlayerState } from '@/lib/types';
import { Ship } from '@/lib/game/ships';

interface GameOverProps {
  game: GameRoom;
  currentUserId: string | null;
  onPlayAgain?: () => void;
}

interface PlayerStats {
  hits: number;
  misses: number;
  shotsFired: number;
  accuracy: string;
}

function calculateStats(stats: PlayerState['stats']): PlayerStats {
  const hits = stats?.hits || 0;
  const misses = stats?.misses || 0;
  const shotsFired = stats?.shotsFired || 0;
  const accuracy = shotsFired > 0
    ? ((hits / shotsFired) * 100).toFixed(1)
    : '0.0';
  return { hits, misses, shotsFired, accuracy };
}

function isShipSunk(ship: Ship): boolean {
  return ship.hits.every(hit => hit);
}

function ShipStatus({ ships, label }: { ships: Ship[]; label: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <div className="space-y-1">
        {ships.map(ship => (
          <div
            key={ship.id}
            className={`text-sm ${isShipSunk(ship) ? 'text-red-400 line-through' : 'text-green-400'}`}
          >
            {ship.type} ({ship.size}) - {isShipSunk(ship) ? 'SUNK' : 'Intact'}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsCard({ stats, label, isWinner }: { stats: PlayerStats; label: string; isWinner: boolean }) {
  return (
    <div className={`p-4 rounded-lg ${isWinner ? 'bg-green-900/30 border border-green-600' : 'bg-slate-800'}`}>
      <h3 className="text-lg font-semibold mb-3">{label}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-slate-400">Hits:</div>
        <div className="text-right font-mono">{stats.hits}</div>
        <div className="text-slate-400">Misses:</div>
        <div className="text-right font-mono">{stats.misses}</div>
        <div className="text-slate-400">Shots Fired:</div>
        <div className="text-right font-mono">{stats.shotsFired}</div>
        <div className="text-slate-400">Accuracy:</div>
        <div className="text-right font-mono">{stats.accuracy}%</div>
      </div>
    </div>
  );
}

export default function GameOver({ game, currentUserId, onPlayAgain }: GameOverProps) {
  const router = useRouter();

  const winner = game.winner;
  const isDraw = winner === 'draw';
  const isWinner = winner === currentUserId;
  const isLoser = winner !== null && winner !== 'draw' && winner !== currentUserId;

  const opponentId = Object.keys(game.players).find(pid => pid !== currentUserId);
  const currentPlayer = currentUserId ? game.players[currentUserId] : null;
  const opponent = opponentId ? game.players[opponentId] : null;

  const currentStats = currentPlayer ? calculateStats(currentPlayer.stats) : null;
  const opponentStats = opponent ? calculateStats(opponent.stats) : null;

  const handleReturnToLobby = () => {
    router.push('/');
  };

  const handlePlayAgain = () => {
    router.push('/');
    if (onPlayAgain) {
      onPlayAgain();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-5xl font-bold mb-4">Game Over</h1>

      {/* Winner Announcement */}
      <div className="text-3xl font-bold mb-6">
        {isDraw ? (
          <span className="text-yellow-400">It&apos;s a Draw!</span>
        ) : isWinner ? (
          <span className="text-green-400">You Win!</span>
        ) : (
          <span className="text-red-400">You Lose!</span>
        )}
      </div>

      {/* Battle Statistics */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Battle Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentStats && (
            <StatsCard
              stats={currentStats}
              label="Your Fleet"
              isWinner={isWinner && !isDraw}
            />
          )}
          {opponentStats && (
            <StatsCard
              stats={opponentStats}
              label="Enemy Fleet"
              isWinner={isLoser}
            />
          )}
        </div>
      </div>

      {/* Ship Status */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Ships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlayer && (
            <ShipStatus ships={currentPlayer.ships} label="Your Ships" />
          )}
          {opponent && (
            <ShipStatus ships={opponent.ships} label="Enemy Ships" />
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleReturnToLobby}
          className="px-6 py-3 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
        >
          Return to Lobby
        </button>
        <button
          onClick={handlePlayAgain}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    </main>
  );
}
