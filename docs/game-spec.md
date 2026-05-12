# Battleships - Game Specification

## Overview
Real-time 2-player Battleships game with hidden bombs and acceleration mechanics.

---

## Game Setup

### Board
- 10x10 grid per player
- Each cell can contain: water, ship segment, or hidden bomb

### Ships
| Ship Type | Size | Quantity |
|-----------|------|----------|
| Carrier | 5 | 1 |
| Battleship | 4 | 1 |
| Cruiser | 3 | 1 |
| Submarine | 3 | 1 |
| Destroyer | 2 | 1 |

**Total grid coverage:** 5+4+3+3+2 = 17 tiles

### Hidden Bomb
- 1 bomb per player
- Placed on any empty water tile during setup
- When hit: **explodes and reveals all 8 surrounding tiles**

---

## Phase 1: Setup (30 seconds)

### Actions
1. **Ship Placement**: Ships are **randomly placed** on the grid
2. **Regenerate**: Button to re-randomize all ship positions
3. **Bomb Placement**: Player places their hidden bomb on any empty water tile
4. **Confirm Ready**: Button to indicate readiness (both must confirm)

### Constraints
- Ships cannot overlap
- Ships cannot touch diagonally (but can touch orthogonally)
- Bomb cannot be placed on ship tiles

### Timeout
- If 30 seconds expire, random placement is finalized with bomb in random empty spot

---

## Phase 2: Battle (Real-time)

### Turn System
- **Global turn timer**: 5 seconds per shot interval
- Players can fire **once per interval**
- Firing is **simultaneous** - both shots resolve at end of interval

### Firing Mechanics
1. Click enemy grid cell to target
2. Shot resolves at interval end
3. **On Hit**: Cooldown reduces to **2 seconds**, player gets bonus shot
4. **On Miss**: Standard 5 second cooldown

### Acceleration Rule
- **Hit → 2 second cooldown**
- **Miss → 5 second cooldown**
- Multiple hits = multiple 2-second shots (can fire rapidly if landing hits)

### Bomb Explosion
When a bomb is hit:
1. Bomb tile is revealed
2. All 8 surrounding tiles are **immediately revealed** (shown on enemy grid)
3. This affects both players' views

### Win Condition
- First player to **sink all enemy ships** wins
- If both destroy each other's fleet on same interval → **draw**

---

## Matchmaking

### Queue System
1. Player clicks "Find Match"
2. Player enters queue (stored in Firebase RTDB)
3. When 2 players in queue → Cloud Function creates game room
4. Both players redirected to game

### Game Room
- Room ID generated
- Both players' states tracked
- 30 second timeout for Phase 1 (both must be ready)

---

## Data Structures

See [architecture.md](./architecture.md) for Firebase RTDB data structures.

## API Design

See [architecture.md](./architecture.md) for Firebase API design.
