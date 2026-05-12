## Context

The game setup phase is complete (slice 4). Ships are placed, bombs are positioned, both players have readied up. Now the game needs to transition to the battle phase where players take turns firing at each other's grids.

Key constraints from game-spec.md:
- 5-second global turn timer for shot intervals
- Hit = 2 second cooldown, Miss = 5 second cooldown
- Simultaneous firing (both players fire, then both resolve)
- Bomb explosions reveal 8 surrounding tiles immediately
- First to sink all enemy ships wins; draw if both destroy each other same interval

Current architecture:
- Firebase RTDB for real-time state
- Next.js API routes for serverless functions
- React components for UI

## Goals / Non-Goals

**Goals:**
- Target enemy board with click-to-fire interface
- Display own board with hit/miss damage indicators
- Manage shot cooldowns per the acceleration rule
- Resolve simultaneous shots via cloud function
- Detect and display win/loss/draw conditions
- Handle bomb explosions with immediate surrounding tile reveal

**Non-Goals:**
- Sound effects or visual animations beyond basic state changes
- Re-implementation of ship placement or setup phase (already complete)
- Matchmaking (already complete)

## Decisions

### Shot Queue Pattern

**Decision**: Queue shots locally and resolve on interval tick rather than immediate resolution.

**Why**: The game spec says "simultaneous" - both players fire within the interval, then both resolve. If we resolved immediately, player A would see their hit before player B fires, giving an unfair info advantage.

**Alternatives considered**:
- Immediate resolution: Rejected because it breaks the simultaneous firing semantics
- Server-authoritative interval: Would require maintaining server state; RTDB-based resolution is simpler for this scale

**Implementation**:
- `useBattleState` maintains local shot queue
- Shots are optimistically added to local UI
- Cloud function `onGameShot` validates and persists to `/games/{roomId}/shots/{shotId}`
- Listener on `/games/{roomId}/shots` triggers resolution for all pending shots at interval end

### Cooldown Timer Architecture

**Decision**: Cooldown timers run client-side with server validation.

**Why**: UI needs immediate feedback on whether a shot can be fired. Running timers client-side provides instant response without network latency. Server validates that cooldown has actually elapsed before accepting a shot.

**Implementation**:
- `useCooldownTimer(roomId, userId)` hook tracks cooldown state locally
- Timer starts at 0 (ready) and counts up
- When user fires, timer resets and counts up again
- On hit: timer resets (2s cooldown starts)
- Cloud function checks `Date.now() - lastShotTime >= cooldown` before accepting

### Enemy Board vs Own Board

**Decision**: Separate components rather than unified board with mode prop.

**Why**: Enemy board and own board have fundamentally different interactions (targeting vs display-only) and different visual states. Separating them avoids complex conditional logic and makes each easier to reason about.

### Bomb Explosion Reveal

**Decision**: Bomb explosion reveals are persisted to RTDB and reflected in both players' enemy board views.

**Why**: Both players need to see which tiles are revealed. The cloud function applies bomb explosion effects to the opponent's board state in RTDB, and both players subscribe to that state.

## Risks / Trade-offs

**[Risk] Clock drift between clients** → Mitigation: Server is the source of truth for cooldown validation. Clients show optimistic UI but server can reject shots that fire too soon.

**[Risk] Rapid fire exploits** → Mitigation: Cloud function validates cooldown server-side. Even if client timer is manipulated, the shot will be rejected.

**[Risk] Draw detection complexity** → Mitigation: Cloud function checks win condition for both players after each shot resolution. If both have no ships remaining, the one with fewer total shots fired loses (or draw if equal).

**[Trade-off] Optimistic UI vs server truth** → Shots appear to fire instantly in UI but may be rolled back if rejected. Acceptable for this game pace since 2-5 second intervals hide the latency.
