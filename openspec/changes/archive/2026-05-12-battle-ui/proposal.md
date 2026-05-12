## Why

The game is currently stuck at the end of the setup phase with no way to transition to battle. Players need a fully functional battle phase UI where they can target enemy ships, see their own ship damage, and experience the acceleration mechanics (2s cooldown on hit, 5s on miss).

## What Changes

- Add `EnemyBoard.tsx` component for targeting enemy grid
- Add `OwnBoard.tsx` component showing own ships with hit/miss markers
- Add `useBattleState.ts` hook for shot cooldown management and shot queue
- Add `onGameShot` cloud function to validate and resolve shots
- Add `useCooldownTimer.ts` utility for tracking shot readiness
- Wire battle phase into existing `game/[roomId]/page.tsx`

## Capabilities

### New Capabilities

- `battle-targeting`: Enemy grid UI for selecting and firing shots at opponent's board
- `battle-display`: Own board UI showing ship integrity and bomb explosion effects
- `battle-resolution`: Cloud function for resolving shots, handling bomb explosions, and detecting wins
- `battle-state`: Hook for managing shot queue, cooldowns, and real-time shot updates

### Modified Capabilities

- `game-room-page`: Transitions to battle phase when both players are ready; shows battle UI instead of setup UI
- `game-state-hook`: Extended to include shot-related state for the battle phase

## Impact

- New files: 4 components/hooks, 1 cloud function
- Modified: `pages/game/[roomId]/page.tsx` to include battle phase UI
- Cloud Function: `onGameShot` at `/api/game/shot`
- RTDB additions: `/games/{roomId}/shots/{shotId}` for shot history
