import { resolveShot, applyBombExplosion, checkWin, checkDraw } from '../battle';
import { generateBoard, placeBomb } from '../board';
import { createShips } from '../ships';

describe('battle.ts', () => {
  describe('resolveShot', () => {
    it('should miss water', () => {
      const board = generateBoard();
      const { ships } = createShips();
      const result = resolveShot(board, ships, 0, 0);
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.bombExplosion).toBe(false);
      expect(result.newBoard[0][0]).toBe('miss');
    });

    it('should hit ship', () => {
      const board = generateBoard();
      board[0][0] = 'ship';
      const ships = [{ id: 'test', type: 'Carrier', size: 1, x: 0, y: 0, horizontal: true, hits: [false] }];
      const result = resolveShot(board, ships, 0, 0);
      expect(result.hit).toBe(true);
      expect(result.newBoard[0][0]).toBe('hit');
    });

    it('should detect bomb explosion', () => {
      const board = placeBomb(generateBoard(), 5, 5);
      const { ships } = createShips();
      const result = resolveShot(board, ships, 5, 5);
      expect(result.hit).toBe(true);
      expect(result.bombExplosion).toBe(true);
      expect(result.newBoard[5][5]).toBe('revealed');
    });
  });

  describe('applyBombExplosion', () => {
    it('should reveal surrounding tiles', () => {
      const board = generateBoard();
      const newBoard = applyBombExplosion(board, 5, 5);
      expect(newBoard[5][5]).toBe('revealed');
      expect(newBoard[4][4]).toBe('revealed');
      expect(newBoard[4][5]).toBe('revealed');
      expect(newBoard[4][6]).toBe('revealed');
      expect(newBoard[5][4]).toBe('revealed');
      expect(newBoard[5][6]).toBe('revealed');
      expect(newBoard[6][4]).toBe('revealed');
      expect(newBoard[6][5]).toBe('revealed');
      expect(newBoard[6][6]).toBe('revealed');
    });

    it('should handle edge bomb', () => {
      const board = generateBoard();
      const newBoard = applyBombExplosion(board, 0, 0);
      expect(newBoard[0][0]).toBe('revealed');
    });
  });

  describe('checkWin', () => {
    it('should return false when ships remain', () => {
      const ships = [{ id: 'test', type: 'Carrier', size: 1, x: 0, y: 0, horizontal: true, hits: [false] }];
      expect(checkWin(ships)).toBe(false);
    });

    it('should return true when all ships sunk', () => {
      const ships = [{ id: 'test', type: 'Carrier', size: 1, x: 0, y: 0, horizontal: true, hits: [true] }];
      expect(checkWin(ships)).toBe(true);
    });
  });

  describe('checkDraw', () => {
    it('should return true when all ships destroyed', () => {
      const ships = [{ id: 'test', type: 'Carrier', size: 1, x: 0, y: 0, horizontal: true, hits: [true] }];
      expect(checkDraw(ships)).toBe(true);
    });
  });
});
