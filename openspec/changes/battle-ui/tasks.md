## 1. Cloud Function: Shot Resolution

- [x] 1.1 Create `src/app/api/game/shot/route.ts` endpoint
- [x] 1.2 Validate cooldown elapsed server-side
- [x] 1.3 Resolve hit/miss against opponent board
- [x] 1.4 Handle bomb explosion and reveal surrounding tiles
- [x] 1.5 Detect ship sinking and win/draw conditions
- [x] 1.6 Persist shot result to `/games/{roomId}/shots/{shotId}`

## 2. Components: Battle Boards

- [x] 2.1 Create `src/components/game/EnemyBoard.tsx` with click targeting
- [x] 2.2 Create `src/components/game/OwnBoard.tsx` for display-only
- [x] 2.3 Create `src/components/game/CooldownIndicator.tsx` for timer UI
- [x] 2.4 Create `src/components/game/Cell.tsx` states for hit/miss/revealed

## 3. Hooks: Battle State

- [x] 3.1 Create `src/hooks/useCooldownTimer.ts` for countdown logic
- [x] 3.2 Create `src/hooks/useBattleState.ts` for shot queue and board state
- [x] 3.3 Wire RTDB listener for shot updates
- [x] 3.4 Handle cooldown reset on hit (2s) vs miss (5s)

## 4. Integration: Game Room Page

- [x] 4.1 Update `src/app/game/[roomId]/page.tsx` to show battle UI after setup
- [x] 4.2 Render EnemyBoard and OwnBoard side by side
- [x] 4.3 Show CooldownIndicator
- [x] 4.4 Handle game over state and winner display
