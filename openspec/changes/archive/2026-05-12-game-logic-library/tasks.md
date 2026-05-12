## 1. Board Management (`src/lib/game/board.ts`)

- [x] 1.1 Create `CellState` type: `'water' | 'ship' | 'bomb' | 'hit' | 'miss' | 'revealed'`
- [x] 1.2 Implement `generateBoard()`: returns 10x10 2D array of `'water'`
- [x] 1.3 Implement `isValidCoordinate(x, y)`: validates 0-9 range
- [x] 1.4 Implement `canPlaceShip(board, ship, x, y, horizontal)`: checks no overlap
- [x] 1.5 Implement `hasNoAdjacentShips(board, ship, x, y, horizontal)`: checks no diagonal adjacency
- [x] 1.6 Implement `placeShipRandomly(board, ship)`: random valid placement
- [x] 1.7 Implement `canPlaceBomb(board, x, y)`: checks cell is `'water'`
- [x] 1.8 Implement `placeBomb(board, x, y)`: places bomb at position

## 2. Ship Creation (`src/lib/game/ships.ts`)

- [x] 2.1 Define `SHIP_TYPES` constant with all 5 ship types (Carrier-5, Battleship-4, Cruiser-3, Submarine-3, Destroyer-2)
- [x] 2.2 Define `Ship` interface with `id`, `type`, `size`, `x`, `y`, `horizontal`, `hits[]`
- [x] 2.3 Implement `createShips()`: returns array of 5 ships with random valid positions
- [x] 2.4 Implement `createShip(type, size, x, y, horizontal)`: creates single ship with hit tracking

## 3. Battle Resolution (`src/lib/game/battle.ts`)

- [x] 3.1 Define `ShotResult` interface: `{hit, sunk, bombExplosion, newBoard}`
- [x] 3.2 Implement `resolveShot(board, ships, x, y)`: resolves shot, returns new board + result
- [x] 3.3 Implement `getShipAt(board, ships, x, y)`: returns ship at coordinate
- [x] 3.4 Implement `markShipHit(ship, segmentIndex)`: marks segment as hit
- [x] 3.5 Implement `isShipSunk(ship)`: returns true if all segments hit
- [x] 3.6 Implement `applyBombExplosion(board, x, y)`: reveals 8 surrounding tiles
- [x] 3.7 Implement `checkWin(ships)`: returns true if all ships sunk
- [x] 3.8 Implement `checkDraw(ships)`: returns true if all ships destroyed

## 4. Unit Tests (`src/lib/game/__tests__/`)

- [x] 4.1 Setup Jest configuration
- [x] 4.2 Write board.ts tests: generateBoard, isValidCoordinate, canPlaceShip, hasNoAdjacentShips, placeShipRandomly
- [x] 4.3 Write ships.ts tests: SHIP_TYPES values, createShips, ship hit tracking
- [x] 4.4 Write battle.ts tests: resolveShot (water/ship/bomb), bomb explosion, ship sinking, checkWin, checkDraw

## 5. Export Module (`src/lib/game/index.ts`)

- [x] 5.1 Export all functions and types from board.ts, ships.ts, battle.ts
- [x] 5.2 Verify all exports are correctly typed
