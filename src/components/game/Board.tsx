'use client';

import Cell from './Cell';

export type CellState = 'unknown' | 'water' | 'ship' | 'hit' | 'miss' | 'bomb' | 'revealed';

interface BoardProps {
  board: string[][];
  cellStates?: Record<string, CellState>;
  bombPosition?: { x: number; y: number } | null;
  isSetup?: boolean;
  isPlacementMode?: boolean;
  onCellClick?: (x: number, y: number) => void;
}

export default function Board({
  board,
  cellStates = {},
  bombPosition = null,
  isSetup = false,
  isPlacementMode = false,
  onCellClick,
}: BoardProps) {
  const getCellState = (x: number, y: number): CellState => {
    const key = `${x},${y}`;

    if (cellStates[key]) {
      return cellStates[key];
    }

    if (isSetup) {
      return board[y]?.[x] === 'ship' ? 'ship' : 'water';
    }

    return 'unknown';
  };

  const isInteractive = (x: number, y: number): boolean => {
    if (!onCellClick) return false;
    if (isPlacementMode) {
      return board[y]?.[x] === 'water';
    }
    return false;
  };

  const handleCellClick = (x: number, y: number) => {
    if (onCellClick && isInteractive(x, y)) {
      onCellClick(x, y);
    }
  };

  return (
    <div className="inline-grid grid-cols-10 gap-0 border-2 border-slate-500">
      {Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => {
          const state = getCellState(x, y);
          const isBomb = bombPosition?.x === x && bombPosition?.y === y;
          const displayState = isBomb && isSetup ? 'bomb' : state;

          return (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              state={displayState}
              isInteractive={isInteractive(x, y)}
              onClick={handleCellClick}
            />
          );
        })
      )}
    </div>
  );
}
