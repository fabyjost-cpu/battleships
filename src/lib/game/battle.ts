import { Board, CellState, isValidCoordinate } from './board';
import { Ship } from './ships';

export interface ShotResult {
  hit: boolean;
  sunk: boolean;
  bombExplosion: boolean;
  newBoard: Board;
  newShips?: Ship[];
}

function getShipAt(ships: Ship[], x: number, y: number): Ship | null {
  for (const ship of ships) {
    for (let i = 0; i < ship.size; i++) {
      const sx = ship.horizontal ? ship.x + i : ship.x;
      const sy = ship.horizontal ? ship.y : ship.y + i;
      if (sx === x && sy === y && !ship.hits[i]) {
        return ship;
      }
    }
  }
  return null;
}

function markShipHit(ship: Ship, segmentIndex: number): Ship {
  const newHits = [...ship.hits];
  newHits[segmentIndex] = true;
  return { ...ship, hits: newHits };
}

function isShipSunk(ship: Ship): boolean {
  return ship.hits.every(hit => hit);
}

export function applyBombExplosion(board: Board, x: number, y: number): Board {
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = 'revealed';

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (isValidCoordinate(nx, ny) && newBoard[ny][nx] === 'water') {
        newBoard[ny][nx] = 'revealed';
      }
    }
  }

  return newBoard;
}

export function resolveShot(
  board: Board,
  ships: Ship[],
  x: number,
  y: number
): ShotResult {
  const cell = board[y][x];

  if (cell === 'water' || cell === 'revealed') {
    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = 'miss';
    return { hit: false, sunk: false, bombExplosion: false, newBoard, newShips: ships };
  }

  if (cell === 'bomb') {
    const newBoard = applyBombExplosion(board, x, y);
    return { hit: true, sunk: false, bombExplosion: true, newBoard, newShips: ships };
  }

  if (cell === 'ship') {
    const ship = getShipAt(ships, x, y);
    if (!ship) {
      return { hit: false, sunk: false, bombExplosion: false, newBoard: board, newShips: ships };
    }

    let segmentIndex = -1;
    for (let i = 0; i < ship.size; i++) {
      const sx = ship.horizontal ? ship.x + i : ship.x;
      const sy = ship.horizontal ? ship.y : ship.y + i;
      if (sx === x && sy === y) {
        segmentIndex = i;
        break;
      }
    }

    const updatedShip = markShipHit(ship, segmentIndex);
    const newShips = ships.map(s => s.id === ship.id ? updatedShip : s);
    const sunk = isShipSunk(updatedShip);

    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = 'hit';

    return { hit: true, sunk, bombExplosion: false, newBoard, newShips };
  }

  return { hit: false, sunk: false, bombExplosion: false, newBoard: board, newShips: ships };
}

export function checkWin(ships: Ship[]): boolean {
  return ships.every(ship => isShipSunk(ship));
}

export function checkDraw(ships: Ship[]): boolean {
  return ships.every(ship => isShipSunk(ship));
}
