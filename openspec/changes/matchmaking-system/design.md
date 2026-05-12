## Context

The matchmaking system pairs two players to start a Battleships game. Players click "Find Match" and wait in a Firebase RTDB queue until a second player joins. When paired, a game room is created and both players are redirected.

**Current state**: Game logic library (Slice 1) and Firebase Admin SDK (Slice 2) are complete. No matchmaking exists yet.

**Constraints**:
- Use Firebase RTDB for queue state (real-time sync required)
- Use Vercel Serverless Functions for matching logic
- Use Firebase Anonymous Auth for player session IDs
- 30-second timeout for Phase 1 setup readiness

## Goals / Non-Goals

**Goals:**
- Enable players to enter/exit a matchmaking queue
- Pair two waiting players automatically
- Create a game room with both players assigned
- Handle room timeouts gracefully

**Non-Goals:**
- Ranked matchmaking or ELO system
- Tournament mode
- Spectator support
- Chat between players

## Decisions

### 1. RTDB Queue Structure

**Decision**: Store queue as `/matchmaking/queue/{playerId}` with `joinedAt` timestamp and `status`.

**Rationale**: Simple key-value structure allows O(1) leave operations and efficient `onValue` listener for UI updates. Alternative (a list with push IDs) would require O(n) search for leave.

**Alternative considered**: Use Firebase's `onDisconnect` for auto-cleanup. Not used because we want explicit leave operations.

### 2. Matching Strategy

**Decision**: Match on a first-in-first-out basis. The two oldest waiting players are paired.

**Rationale**: Simple, fair, and predictable. No randomness means players won't feel cheated.

**Alternative considered**: Random pairing. Rejected for perceived unfairness.

### 3. Room Creation Trigger

**Decision**: Vercel serverless function triggered via RTDB `onValue` listener monitoring queue changes.

**Rationale**: Event-driven approach scales to many concurrent matchings without polling. When queue length >= 2, the function runs automatically.

**Alternative considered**: Client-side polling. Rejected - adds latency and server load.

### 4. Room ID Generation

**Decision**: Use Firebase push ID (random key) for room IDs.

**Rationale**: Guaranteed unique, no collision risk, server-generated so clients can't guess room IDs.

## Risks / Trade-offs

**[Risk] Player disconnects during matchmaking**
→ **Mitigation**: `onDisconnect` handler removes player from queue automatically if connection drops.

**[Risk] Both players ready but room times out**
→ **Mitigation**: If 30 seconds pass without both ready, auto-finalize with random placements.

**[Risk] Serverless function runs multiple times for same match**
→ **Mitigation**: Use Firebase transaction when checking/claiming players to ensure atomic pairing.

## Open Questions

1. Should we limit queue size to prevent memory issues? (Default: no limit needed for casual game)
2. What happens if a matched player never connects to the room? (Timeout handles this - room becomes invalid)
