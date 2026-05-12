import {
  generateBoard,
  isValidCoordinate,
  canPlaceShip,
  hasNoAdjacentShips,
  placeShipRandomly,
  canPlaceBomb,
  placeBomb,
} from '../board';

describe('board.ts', () => {
  describe('generateBoard', () => {
    it('should return a 10x10 grid of water cells', () => {
      const board = generateBoard();
      expect(board.length).toBe(10);
      expect(board[0].length).toBe(10);
      expect(board[5][5]).toBe('water');
    });
  });

  describe('isValidCoordinate', () => {
    it('should return true for valid coordinates', () => {
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate(5, 3)).toBe(true);
      expect(isValidCoordinate(9, 9)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(isValidCoordinate(10, 3)).toBe(false);
      expect(isValidCoordinate(5, -1)).toBe(false);
      expect(isValidCoordinate(-1, 5)).toBe(false);
    });
  });

  describe('canPlaceShip', () => {
    it('should return true when ship can be placed', () => {
      const board = generateBoard();
      expect(canPlaceShip(board, 3, 0, 0, true)).toBe(true);
    });

    it('should return false when ship overlaps', () => {
      const board = generateBoard();
      board[0][0] = 'ship';
      board[0][1] = 'ship';
      expect(canPlaceShip(board, 3, 0, 0, true)).toBe(false);
    });

    it('should return false when ship goes out of bounds', () => {
      const board = generateBoard();
      expect(canPlaceShip(board, 3, 8, 0, true)).toBe(false);
    });
  });

  describe('hasNoAdjacentShips', () => {
    it('should return true when no adjacency', () => {
      const board = generateBoard();
      expect(hasNoAdjacentShips(board, 3, 0, 0, true)).toBe(true);
    });

    it('should return false when diagonally adjacent', () => {
      const board = generateBoard();
      board[0][0] = 'ship';
      board[1][1] = 'ship';
      expect(hasNoAdjacentShips(board, 3, 2, 0, true)).toBe(false);
    });
  });

  describe('placeShipRandomly', () => {
    it('should place ship at valid position', () => {
      const board = generateBoard();
      const result = placeShipRandomly(board, 3);
      expect(result).not.toBeNull();
      expect(result!.board[result!.y][result!.x]).toBe('ship');
    });
  });

  describe('canPlaceBomb', () => {
    it('should return true on water', () => {
      const board = generateBoard();
      expect(canPlaceBomb(board, 0, 0)).toBe(true);
    });

    it('should return false on ship', () => {
      const board = generateBoard();
      board[0][0] = 'ship';
      expect(canPlaceBomb(board, 0, 0)).toBe(false);
    });
  });

  describe('placeBomb', () => {
    it('should place bomb at position', () => {
      const board = generateBoard();
      const newBoard = placeBomb(board, 0, 0);
      expect(newBoard[0][0]).toBe('bomb');
    });
  });
});
