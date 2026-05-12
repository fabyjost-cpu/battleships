## Why

The matchmaking system is complete, but players have no way to see or interact with the game board. We need a UI layer for Phase 1 (setup) where players can view their randomly-placed ships, place their hidden bomb, and confirm readiness.

## What Changes

- New `Board` and `Cell` React components for rendering the 10x10 grid
- New `GameRoom` page at `/game/[roomId]` that displays during setup phase
- New `useGameState` hook for subscribing to Firebase RTDB game state
- Landing page updates to redirect to game room after match is found
- Bomb placement interface during setup phase

## Capabilities

### New Capabilities

- `game-board`: Renders a 10x10 Battleships grid with interactive cells
- `game-room-page`: Game room page that handles Phase 1 setup UI
- `game-state-hook`: Firebase RTDB listener hook for real-time game state sync

### Modified Capabilities

(no modified capabilities)

## Impact

- New UI components in `src/components/game/`
- New page route `src/app/game/[roomId]/page.tsx`
- New hook `src/hooks/useGameState.ts`
- Depends on: `src/lib/game/board.ts`, `src/lib/matchmaking.ts`, `src/hooks/useMatchmaking.ts`
