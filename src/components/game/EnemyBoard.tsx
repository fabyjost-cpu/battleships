'use client';

import Cell from './Cell';
import { CellState } from './Board';

interface EnemyBoardProps {
  targetedCells: Record<string, CellState>;
  onCellClick: (x: number, y: number) => void;
  canFire: boolean;
}

export default function EnemyBoard({ targetedCells, onCellClick, canFire }: EnemyBoardProps) {
  const getCellState = (x: number, y: number): CellState => {
    const key = `${x},${y}`;
    return targetedCells[key] || 'unknown';
  };

  const isInteractive = (x: number, y: number): boolean => {
    if (!canFire) return false;
    const key = `${x},${y}`;
    const state = targetedCells[key];
    return !state;
  };

  const handleCellClick = (x: number, y: number) => {
    if (isInteractive(x, y)) {
      onCellClick(x, y);
    }
  };

  return (
    <div className="inline-grid grid-cols-10 gap-0 border-2 border-slate-500">
      {Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => {
          const state = getCellState(x, y);
          return (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              state={state}
              isInteractive={isInteractive(x, y)}
              onClick={handleCellClick}
            />
          );
        })
      )}
    </div>
  );
}
