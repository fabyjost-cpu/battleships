# Battleships - Implementation TODO

## Project Setup ✓
- [x] Initialize Next.js 14 App Router project
- [x] Configure Firebase SDK (client + admin)
- [x] Setup Tailwind CSS
- [x] Create folder structure (per architecture.md)
- [x] Initialize git repo with `main` branch
- [x] Create `firebase.json` with RTDB, Functions, Hosting

**Branch:** `feat/setup`

---

## Slice 1: Game Logic Library ✓
**Branch:** `feat/game-logic` ✓ (merged)

Pure TypeScript game logic (no Firebase, no React):

### board.ts
- `generateBoard()`: 10x10 grid of 'water'
- `placeShipRandomly(board, ship)`: random valid placement
- `canPlaceShip(board, ship)`: checks no overlap
- `hasNoAdjacentShips(board, ship)`: diagonal adjacency rule

### ships.ts
- `SHIP_TYPES`: carrier(5), battleship(4), cruiser(3), submarine(3), destroyer(2)
- `createShips()`: returns all 5 ships with random positions

### battle.ts
- `resolveShot(board, x, y)`: returns {hit, sunk, bombExplosion, newBoard}
- `checkWin(board)`: returns boolean
- `applyBombExplosion(board, x, y)`: reveals surrounding 8 tiles

**Tests:** Unit tests for all functions (25 passing)

---

## Slice 2: Cloud Functions Base ✓
**Branch:** `feat/cloud-functions` ✓ (merged)

### src/lib/firebase-admin.ts
- Firebase Admin initialization with env credentials
- Exported `adminDb` reference

### src/lib/api-error.ts
- `ApiError` class with `toResponse()` method
- Consistent JSON error format for API routes

**Tests:** ApiError tests (3 passing)

---

## Slice 3: Matchmaking System ✓
**Branch:** `feat/matchmaking` ✓ (merged)

### src/lib/types.ts
- `QueueEntry`: joinedAt, status
- `GameRoom`: status, phaseEndsAt, winner, players, shots
- `PlayerState`: board, ships, bombPosition, ready, cooldown, stats
- `MatchmakingStatus`: idle | searching | matched | error

### src/lib/matchmaking.ts
- `matchPlayers()`: pairs 2 FIFO players from queue, creates room
- `createGameRoom()`: initializes room at `/games/{roomId}` with status: "setup"
- `handleSetupTimeout()`: auto-finalizes ships/bomb if timeout reached
- `setupMatchmakingListener()`: RTDB listener for auto-matching

### src/app/api/matchmaking/join/route.ts
- POST /api/matchmaking/join - joins queue with auth token validation
- Returns 401 for invalid auth, 409 if already in queue
- Sets onDisconnect handler for auto-cleanup

### src/app/api/matchmaking/leave/route.ts
- POST /api/matchmaking/leave - leaves queue (idempotent)

### src/hooks/useMatchmaking.ts
- `useMatchmaking()` hook: joinQueue(), leaveQueue(), status, roomId, user
- Real-time status via RTDB listeners

### RTDB Paths
- `/matchmaking/queue/{playerId}`
- `/games/{roomId}`

### Features
- 30-second room timeout handling
- Anonymous auth integration
- FIFO ordering by joinedAt timestamp

---

## Slice 4: Game Board UI ✓
**Branch:** `feat/game-board-ui` (implementation complete)

### components/game/Board.tsx
- 10x10 grid display
- Shows own ships (for setup phase)
- Click handlers for bomb placement
- Regenerate button

### components/game/Cell.tsx
- Cell states: unknown, ship, hit, miss, bomb, revealed
- Visual styling per state

### components/game/SetupControls.tsx
- Regenerate button (calls /api/game/regenerate)
- Ready button with disabled state
- Place Bomb toggle button
- Opponent readiness status display

### pages/game/[roomId]/page.tsx
- Joins game room via Firebase listener
- Phase 1: setup UI with regenerate + ready button
- Shows opponent ready status
- Redirects to battle phase (placeholder)

### hooks/useGameState.ts
- Firebase RTDB listener for game state
- Returns {game, loading, error, currentPlayerState, opponentState, currentUserId}

### API endpoints created
- `/api/game/regenerate` - Re-randomizes ship placement
- `/api/game/ready` - Marks player ready, transitions to battle when both ready

---

## Slice 5: Battle Phase UI
**Branch:** `feat/battle-ui`

### components/game/EnemyBoard.tsx
- 10x10 grid of unknown cells
- Click to target shot
- Shows hit/miss results
- Cooldown indicator

### components/game/OwnBoard.tsx
- Shows own ships with hit/miss markers
- Shows bomb explosion effects

### hooks/useBattleState.ts
- Handles shot cooldown timers
- Manages shot queue (simultaneous resolution)
- Listens to /games/{roomId}/shots

### Cloud Function: onGameShot
- Validates shot
- Resolves hit/miss
- Triggers bomb explosion if applicable
- Checks win condition

---

## Slice 6: Game Over & Stats
**Branch:** `feat/game-over`

### components/game/GameOver.tsx
- Winner announcement
- Final stats display
- Play again / leave buttons

### Cloud Function: onGameEnd
- Calculates winner
- Updates room status
- Stores final stats in RTDB

### Features
- Draw detection (both fleets destroyed same turn)
- Stats: hits, misses, accuracy, shots fired

---

## Git Workflow (Per Slice)

**Note**: See [CLAUDE.md](./CLAUDE.md) for the required per-feature workflow using OpenSpec.

---

## Dependencies Between Slices

```
feat/setup
    ↓
feat/game-logic ──→ (no dependencies)
    ↓
feat/cloud-functions ──→ feat/game-logic
    ↓
feat/matchmaking ──→ feat/cloud-functions
    ↓
feat/game-board-ui ──→ feat/game-logic, feat/matchmaking
    ↓
feat/battle-ui ──→ feat/game-board-ui, feat/cloud-functions
    ↓
feat/game-over ──→ feat/battle-ui
```
