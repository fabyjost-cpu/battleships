## Context

Pure TypeScript game logic library for Battleships. No external dependencies (no Firebase, no React). Provides board management, ship placement, and battle resolution. All subsequent slices (cloud functions, UI) depend on this library.

## Goals / Non-Goals

**Goals:**
- Board: 10x10 grid state management with coordinate validation
- Ships: Randomized fleet generation respecting no-diagonal-adjacency rule
- Battle: Shot resolution with hit/miss/bomb-explosion results, win detection

**Non-Goals:**
- No Firebase integration (pure TS only)
- No React components
- No matchmaking or room management
- No UI rendering or styling

## Decisions

1. **Use `CellState` union type for board cells**
   - Values: `'water' | 'ship' | 'bomb'`
   - Board stored as 2D array: `CellState[][]`
   - Rationale: Simple, type-safe, matches game-spec cell states

2. **Ship placement uses Fisher-Yates shuffle for positions**
   - Generate all possible ship positions, shuffle, pick first valid
   - Rationale: Simpler than recursive backtracking, works well for 5 ships

3. **Battle resolution returns new board state (immutable)**
   - `resolveShot(board, x, y)` returns `{result, newBoard}`
   - Rationale: Immutable patterns easier to test and reason about

4. **Bomb explosion uses BFS for 8-tile reveal**
   - Collect all 8 neighbors within board bounds
   - Rationale: Clear, readable, no edge-case bugs

## Risks / Trade-offs

- [Risk] Random ship placement may occasionally take many attempts
  - → Mitigation: With only 5 ships on 10x10, failure probability is negligible
- [Risk] No validation that fleet is fully destroyed on win
  - → Mitigation: `checkWin` counts remaining ship cells
