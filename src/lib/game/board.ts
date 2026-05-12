export type CellState = 'water' | 'ship' | 'bomb' | 'hit' | 'miss' | 'revealed';
export type Board = CellState[][];

export function generateBoard(): Board {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => 'water' as CellState)
  );
}

export function isValidCoordinate(x: number, y: number): boolean {
  return x >= 0 && x < 10 && y >= 0 && y < 10;
}

export function canPlaceShip(
  board: Board,
  size: number,
  x: number,
  y: number,
  horizontal: boolean
): boolean {
  for (let i = 0; i < size; i++) {
    const cx = horizontal ? x + i : x;
    const cy = horizontal ? y : y + i;
    if (!isValidCoordinate(cx, cy)) return false;
    if (board[cy][cx] !== 'water') return false;
  }
  return true;
}

export function hasNoAdjacentShips(
  board: Board,
  size: number,
  x: number,
  y: number,
  horizontal: boolean
): boolean {
  for (let i = 0; i < size; i++) {
    const cx = horizontal ? x + i : x;
    const cy = horizontal ? y : y + i;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (!isValidCoordinate(nx, ny)) continue;
        const cell = board[ny][nx];
        if (cell === 'ship' || cell === 'bomb') return false;
      }
    }
  }
  return true;
}

export function placeShipRandomly(board: Board, size: number): { board: Board; x: number; y: number; horizontal: boolean } | null {
  const attempts = 100;
  for (let i = 0; i < attempts; i++) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const horizontal = Math.random() < 0.5;

    if (canPlaceShip(board, size, x, y, horizontal) && hasNoAdjacentShips(board, size, x, y, horizontal)) {
      const newBoard = board.map(row => [...row]);
      for (let j = 0; j < size; j++) {
        const cx = horizontal ? x + j : x;
        const cy = horizontal ? y : y + j;
        newBoard[cy][cx] = 'ship';
      }
      return { board: newBoard, x, y, horizontal };
    }
  }
  return null;
}

export function canPlaceBomb(board: Board, x: number, y: number): boolean {
  if (!isValidCoordinate(x, y)) return false;
  return board[y][x] === 'water';
}

export function placeBomb(board: Board, x: number, y: number): Board {
  const newBoard = board.map(row => [...row]);
  newBoard[y][x] = 'bomb';
  return newBoard;
}
