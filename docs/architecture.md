# Architecture

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Firebase Cloud Functions (Node.js) |
| Real-time | Firebase Realtime Database (WebSocket-based) |
| State | Server-authoritative (Firebase RTDB) |
| Hosting | Firebase Hosting |
| Auth | Firebase Anonymous Auth (for session IDs) |

---

## Project Structure

```
battleships/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing/matchmaking UI
│   │   ├── game/[roomId]/      # Game room page
│   │   └── api/                # API routes (if needed)
│   ├── components/              # React components
│   │   ├── Board.tsx           # 10x10 game grid
│   │   ├── Cell.tsx            # Individual cell
│   │   ├── Ship.tsx            # Ship display
│   │   ├── GameLobby.tsx       # Matchmaking UI
│   │   └── ...
│   ├── lib/
│   │   ├── game/               # Game logic (shared)
│   │   │   ├── board.ts        # Board generation, ship placement
│   │   │   ├── ships.ts        # Ship definitions and rules
│   │   │   └── battle.ts       # Combat resolution
│   │   ├── firebase.ts         # Firebase client config
│   │   └── matchmaking.ts      # Matchmaking hooks
│   └── types/                  # TypeScript types
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts            # Function exports
│   │   ├── matchmaking.ts      # Queue & room creation
│   │   ├── game.ts             # Game logic functions
│   │   └── db.ts               # Firebase Admin init
│   └── package.json
├── docs/
│   ├── game-spec.md            # Game rules and mechanics
│   └── architecture.md         # This file
└── firebase.json               # Firebase config
```

---

## Server Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐
│   Client    │────▶│  Firebase    │────▶│  Firebase Realtime  │
│  (Browser)  │◀────│  SDK         │◀────│  Database           │
└─────────────┘     └──────────────┘     └─────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Cloud      │
                    │  Functions  │
                    └─────────────┘
```

**Firebase Realtime Database**: Handles real-time sync, game state, matchmaking queue
**Cloud Functions**: Server-side game logic, validation, room management
**Anonymous Auth**: Simple session-based player identification

---

## Commands

### Development
```bash
npm run dev              # Start Next.js dev server
npm run build            # Build Next.js for production
firebase emulators:start # Start Firebase emulators (RTDB, Functions)
npm test                 # Run tests
npm test -- <file>      # Run single test file
```

### Deployment
```bash
firebase deploy          # Deploy to Firebase
firebase deploy --only functions  # Deploy functions only
```

---

## Game Flow

1. **Landing Page** → Click "Find Match" → Enter matchmaking queue
2. **Matchmaking** → Firebase RTDB queue, Cloud Function pairs 2 players → Create room
3. **Phase 1: Setup (30s)** → Random ships + bomb placement → Both ready
4. **Phase 2: Battle** → 5s intervals, simultaneous shots → Hit = 2s cooldown
5. **Game End** → Winner declared, stats shown

---

## Firebase Realtime Database Events

Firebase RTDB uses `onValue` / `onChildAdded` listeners.

### Client → Cloud Functions (via REST/HTTPS)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/matchmaking/join` | POST | Enter matchmaking queue |
| `/matchmaking/leave` | POST | Leave queue |
| `/games/{roomId}/ready` | PUT | Confirm Phase 1 ready |
| `/games/{roomId}/shot` | POST | Fire at coordinates |
| `/games/{roomId}/regenerate` | POST | Re-randomize ships |

### Client ← Firebase RTDB (Real-time listeners)
| Path | Event | Description |
|------|-------|-------------|
| `/matchmaking/queue/{playerId}` | `onValue` | Queue status |
| `/games/{roomId}` | `onValue` | Full game state sync |
| `/games/{roomId}/players/{playerId}` | `onValue` | Player-specific updates |
| `/games/{roomId}/turn` | `onValue` | Turn interval updates |

---

## Firebase RTDB Structure

```json
{
  "matchmaking": {
    "queue": {
      "<playerId>": {
        "joinedAt": 1234567890,
        "status": "waiting"
      }
    }
  },
  "games": {
    "<roomId>": {
      "status": "setup|battle|finished",
      "phaseEndsAt": 1234567890,
      "currentTurnEndsAt": 1234567890,
      "winner": null,
      "players": {
        "<playerId>": {
          "board": [["water", "ship", ...], ...],
          "ships": [{"type": "carrier", "positions": [{"x": 0, "y": 1}]}],
          "bombPosition": {"x": 5, "y": 5},
          "ready": true,
          "cooldown": 0,
          "stats": {"hits": 0, "misses": 0, "shotsFired": 0}
        }
      },
      "shots": [
        {"from": "<playerId>", "x": 3, "y": 4, "timestamp": 123}
      ]
    }
  }
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/game/board.ts` | Board generation, ship placement algorithm |
| `src/lib/game/battle.ts` | Shot resolution, bomb explosion logic |
| `src/lib/firebase.ts` | Firebase client initialization |
| `functions/src/index.ts` | Cloud Functions exports |
| `functions/src/matchmaking.ts` | Queue & room creation logic |
| `functions/src/game.ts` | Game logic Cloud Functions |
| `docs/game-spec.md` | Game rules and mechanics |
