'use client';

import { CellState } from './Board';

interface CellProps {
  x: number;
  y: number;
  state: CellState;
  isInteractive?: boolean;
  onClick?: (x: number, y: number) => void;
}

export default function Cell({ x, y, state, isInteractive = false, onClick }: CellProps) {
  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick(x, y);
    }
  };

  const baseClasses = 'w-8 h-8 sm:w-10 sm:h-10 border border-slate-600 transition-colors';

  const stateClasses: Record<CellState, string> = {
    unknown: 'bg-slate-700 hover:bg-slate-600',
    water: 'bg-blue-900',
    ship: 'bg-slate-500',
    hit: 'bg-red-600',
    miss: 'bg-blue-400',
    bomb: 'bg-purple-600',
    revealed: 'bg-slate-800',
  };

  const interactiveClasses = isInteractive ? 'cursor-pointer hover:ring-2 hover:ring-yellow-400' : '';

  return (
    <div
      className={`${baseClasses} ${stateClasses[state]} ${interactiveClasses}`}
      onClick={handleClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {state === 'hit' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3 h-3 bg-red-900 rounded-full" />
        </div>
      )}
      {state === 'miss' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-300 rounded-full opacity-50" />
        </div>
      )}
      {state === 'bomb' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 bg-purple-900 rounded-full" />
        </div>
      )}
    </div>
  );
}
