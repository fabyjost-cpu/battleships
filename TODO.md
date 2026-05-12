# Battleships - Implementation TODO

## Project Setup
- [ ] Initialize Next.js 14 App Router project
- [ ] Configure Firebase SDK (client + admin)
- [ ] Setup Tailwind CSS
- [ ] Create folder structure (per architecture.md)
- [ ] Initialize git repo with `main` branch
- [ ] Create `firebase.json` with RTDB, Functions, Hosting

**Branch:** `feat/setup`

---

## Slice 1: Game Logic Library
**Branch:** `feat/game-logic`

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

**Tests:** Unit tests for all functions

---

## Slice 2: Cloud Functions Base
**Branch:** `feat/cloud-functions`

### functions/src/db.ts
- Firebase Admin initialization
- Exported adminDb reference

### functions/src/index.ts
- Export all functions
- Basic error handling with HttpsError

---

## Slice 3: Matchmaking System
**Branch:** `feat/matchmaking`

### functions/src/matchmaking.ts
- `onJoinQueue`: adds player to RTDB queue
- `onLeaveQueue`: removes player from RTDB queue
- `matchPlayers`: triggered on queue change, pairs 2 players
- `createGameRoom`: initializes room state in RTDB

### RTDB Paths
- `/matchmaking/queue/{playerId}`
- `/games/{roomId}`

### Features
- 60-second room timeout handling
- Anonymous auth integration

---

## Slice 4: Game Board UI
**Branch:** `feat/game-board-ui`

### components/game/Board.tsx
- 10x10 grid display
- Shows own ships (for setup phase)
- Click handlers for bomb placement
- Regenerate button

### components/game/Cell.tsx
- Cell states: unknown, ship, hit, miss, bomb, revealed
- Visual styling per state

### pages/game/[roomId]/page.tsx
- Joins game room via Firebase listener
- Phase 1: setup UI with regenerate + ready button
- Shows opponent ready status

### hooks/useGameState.ts
- Firebase RTDB listener for game state
- Returns {game, loading, error}

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

```bash
# 1. Create feature branch
git checkout -b feat/<slice-name>

# 2. Implement feature

# 3. Commit
git add .
git commit -m "feat: add <feature description>"

# 4. Push
git push -u origin HEAD

# 5. Create PR to main
# (via GitHub UI or gh cli)

# 6. After merge, update main
git checkout main && git pull origin main
```

### Commit Message Format
```
feat: add game logic library
fix: resolve shot cooldown bug
docs: update game spec
refactor: extract board generation
test: add battle resolution tests
chore: setup Firebase emulators
```

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
