## Why

Players need a way to be matched with an opponent before starting a game. The matchmaking system handles real-time player pairing via Firebase RTDB, ensuring fair and immediate game starts. Without this, players would have no mechanism to find opponents.

## What Changes

- Add Firebase RTDB structure for matchmaking queue (`/matchmaking/queue/{playerId}`)
- Create serverless functions for joining and leaving the matchmaking queue
- Implement player matching logic that pairs two waiting players
- Add game room initialization in RTDB when players are matched
- Handle 30-second room timeout for Phase 1 setup

## Capabilities

### New Capabilities
- `matchmaking-queue`: Manages player queue state in Firebase RTDB with join/leave operations and timestamp tracking
- `matchmaking-match`: Pairs two waiting players from the queue and creates a game room
- `matchmaking-room`: Initializes and manages game room state including player slots, room timeout, and initial phase

### Modified Capabilities
- (none - this is a new system)

## Impact

- **New RTDB paths**: `/matchmaking/queue/{playerId}`, `/games/{roomId}`
- **New API endpoints**: `POST /api/matchmaking/join`, `POST /api/matchmaking/leave`
- **Dependencies**: Firebase Admin SDK (from Slice 2), Firebase Anonymous Auth
- **Affected files**: New `src/lib/matchmaking.ts` hook, `src/app/api/matchmaking/route.ts`
