'use client';

import Cell from './Cell';
import { CellState } from './Board';

interface OwnBoardProps {
  board: string[][];
  hitCells: Record<string, CellState>;
  bombPosition?: { x: number; y: number } | null;
}

export default function OwnBoard({ board, hitCells, bombPosition }: OwnBoardProps) {
  const getCellState = (x: number, y: number): CellState => {
    const key = `${x},${y}`;
    if (hitCells[key]) {
      return hitCells[key];
    }
    if (board[y]?.[x] === 'ship') {
      return 'ship';
    }
    if (board[y]?.[x] === 'water') {
      return 'water';
    }
    return 'unknown';
  };

  return (
    <div className="inline-grid grid-cols-10 gap-0 border-2 border-slate-500">
      {Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => {
          const state = getCellState(x, y);
          const isBomb = bombPosition?.x === x && bombPosition?.y === y;
          const displayState = isBomb && state === 'water' ? 'bomb' : state;

          return (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              state={displayState}
              isInteractive={false}
            />
          );
        })
      )}
    </div>
  );
}
