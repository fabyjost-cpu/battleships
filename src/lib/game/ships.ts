import { Board, canPlaceShip, hasNoAdjacentShips, placeShipRandomly, generateBoard } from './board';

export interface Ship {
  id: string;
  type: string;
  size: number;
  x: number;
  y: number;
  horizontal: boolean;
  hits: boolean[];
}

export const SHIP_TYPES: { type: string; size: number }[] = [
  { type: 'Carrier', size: 5 },
  { type: 'Battleship', size: 4 },
  { type: 'Cruiser', size: 3 },
  { type: 'Submarine', size: 3 },
  { type: 'Destroyer', size: 2 },
];

export function createShip(
  type: string,
  size: number,
  x: number,
  y: number,
  horizontal: boolean
): Ship {
  return {
    id: `${type}-${x}-${y}`,
    type,
    size,
    x,
    y,
    horizontal,
    hits: Array.from({ length: size }, () => false),
  };
}

export function createShips(): { ships: Ship[]; board: Board } {
  let board = generateBoard();
  const ships: Ship[] = [];

  for (const shipType of SHIP_TYPES) {
    const result = placeShipRandomly(board, shipType.size);
    if (!result) {
      throw new Error(`Could not place ${shipType.type}`);
    }
    board = result.board;
    ships.push(createShip(shipType.type, shipType.size, result.x, result.y, result.horizontal));
  }

  return { ships, board };
}
