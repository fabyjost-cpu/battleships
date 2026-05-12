import { SHIP_TYPES, createShip, createShips } from '../ships';

describe('ships.ts', () => {
  describe('SHIP_TYPES', () => {
    it('should have 5 ship types', () => {
      expect(SHIP_TYPES.length).toBe(5);
    });

    it('should have correct sizes', () => {
      expect(SHIP_TYPES).toContainEqual({ type: 'Carrier', size: 5 });
      expect(SHIP_TYPES).toContainEqual({ type: 'Battleship', size: 4 });
      expect(SHIP_TYPES).toContainEqual({ type: 'Cruiser', size: 3 });
      expect(SHIP_TYPES).toContainEqual({ type: 'Submarine', size: 3 });
      expect(SHIP_TYPES).toContainEqual({ type: 'Destroyer', size: 2 });
    });
  });

  describe('createShip', () => {
    it('should create ship with correct properties', () => {
      const ship = createShip('Carrier', 5, 0, 0, true);
      expect(ship.type).toBe('Carrier');
      expect(ship.size).toBe(5);
      expect(ship.x).toBe(0);
      expect(ship.y).toBe(0);
      expect(ship.horizontal).toBe(true);
      expect(ship.hits.length).toBe(5);
      expect(ship.hits.every(h => h === false)).toBe(true);
    });
  });

  describe('createShips', () => {
    it('should return 5 ships', () => {
      const { ships } = createShips();
      expect(ships.length).toBe(5);
    });

    it('should place ships without overlap', () => {
      const { ships, board } = createShips();
      let shipCells = 0;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          if (board[y][x] === 'ship') shipCells++;
        }
      }
      const totalShipSize = ships.reduce((sum, s) => sum + s.size, 0);
      expect(shipCells).toBe(totalShipSize);
    });
  });
});
