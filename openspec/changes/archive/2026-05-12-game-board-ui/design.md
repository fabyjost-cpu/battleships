## Context

The game-logic library and matchmaking system are implemented. Players can find matches and enter game rooms, but there is no UI to display the board or interact with Phase 1 setup. The tech stack is Next.js 15 App Router + Firebase RTDB + Tailwind CSS.

## Goals / Non-Goals

**Goals:**
- Render a 10x10 interactive grid for the game board
- Display ships on the player's own board during setup
- Allow bomb placement on empty water tiles
- Show opponent readiness status
- Provide regenerate and ready buttons
- Redirect to game room after matchmaking matches

**Non-Goals:**
- Battle phase UI (handled in Slice 5)
- Game over UI (handled in Slice 6)
- Mobile responsiveness (future enhancement)

## Decisions

### Component Structure

```
src/components/game/
  Board.tsx      # 10x10 grid container
  Cell.tsx      # Individual cell with state-based rendering
  SetupControls.tsx  # Regenerate, ready, bomb placement
```

**Why:** Separation of concerns - Board handles layout, Cell handles rendering, parent component handles game logic.

### State Management

- `useGameState` hook subscribes to `/games/{roomId}` via Firebase RTDB `onValue`
- Local React state for UI-only concerns (bomb placement mode, hover states)
- Server-authoritative state from Firebase RTDB drives game truth

### Phase 1 Flow

1. Page loads → `useGameState` attaches listener to game room
2. User sees board with ships from `room.players[userId].board`
3. User clicks empty water tile to place bomb
4. User clicks "Regenerate" to re-randomize ships (calls `/api/game/regenerate`)
5. User clicks "Ready" to confirm (calls `/api/game/ready`)
6. When both ready → phase transitions to "battle"

## Risks / Trade-offs

[Risk] Firebase listener memory leak → **Mitigation**: Ensure `off()` is called in useEffect cleanup
[Risk] Optimistic UI vs server truth → **Mitigation**: Always trust Firebase state, show loading during sync
