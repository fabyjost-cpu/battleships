'use client';

import { useState } from 'react';

interface SetupControlsProps {
  isReady: boolean;
  opponentReady: boolean;
  bombPlaced: boolean;
  onRegenerate: () => Promise<void>;
  onReady: () => Promise<void>;
  onPlaceBomb: () => void;
}

export default function SetupControls({
  isReady,
  opponentReady,
  bombPlaced,
  onRegenerate,
  onReady,
  onPlaceBomb,
}: SetupControlsProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [readying, setReadying] = useState(false);
  const [isPlacementMode, setIsPlacementMode] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setRegenerating(false);
    }
  };

  const handleReady = async () => {
    setReadying(true);
    try {
      await onReady();
    } finally {
      setReadying(false);
    }
  };

  const handlePlaceBombClick = () => {
    setIsPlacementMode(!isPlacementMode);
    onPlaceBomb();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800 rounded-lg">
      <div className="flex gap-2">
        <button
          onClick={handleRegenerate}
          disabled={isReady || regenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {regenerating ? 'Regenerating...' : 'Regenerate'}
        </button>

        <button
          onClick={handlePlaceBombClick}
          disabled={isReady || bombPlaced}
          className={`px-4 py-2 rounded ${
            isPlacementMode
              ? 'bg-yellow-600 text-white'
              : bombPlaced
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {bombPlaced ? 'Bomb Placed' : isPlacementMode ? 'Cancel' : 'Place Bomb'}
        </button>

        <button
          onClick={handleReady}
          disabled={isReady || readying}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
        >
          {isReady ? 'Waiting...' : readying ? 'Ready...' : 'Ready'}
        </button>
      </div>

      <div className="text-sm text-slate-300">
        {opponentReady ? 'Opponent ready!' : 'Waiting for opponent...'}
      </div>
    </div>
  );
}

export { SetupControls };
