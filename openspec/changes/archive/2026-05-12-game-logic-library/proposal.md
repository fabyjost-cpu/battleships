## Why

The game logic library provides the core pure TypeScript foundations for Battleships — board generation, ship placement, and battle resolution. This slice must be completed before any cloud functions or UI can be built, as all subsequent features depend on these game rules being correct and tested.

## What Changes

- New `src/lib/game/board.ts` with board state management and ship placement validation
- New `src/lib/game/ships.ts` with ship type definitions and randomized creation
- New `src/lib/game/battle.ts` with shot resolution, bomb explosion mechanics, and win detection
- Comprehensive unit tests for all functions
- Pure TypeScript implementation with no Firebase or React dependencies

## Capabilities

### New Capabilities

- `board-management`: 10x10 grid state, coordinate validation, ship placement with adjacency rules
- `ship-creation`: Ship type definitions (Carrier-5, Battleship-4, Cruiser-3, Submarine-3, Destroyer-2), randomized fleet generation
- `battle-resolution`: Shot resolution returning hit/miss/bomb-explosion results, bomb chain reveals, win/draw detection

## Impact

- **Added**: `src/lib/game/board.ts`, `src/lib/game/ships.ts`, `src/lib/game/battle.ts`
- **Added**: `src/lib/game/__tests__/` with Jest unit tests
- **No breaking changes** — new code only
- **Dependency**: Required by all subsequent slices (cloud functions, UI)
