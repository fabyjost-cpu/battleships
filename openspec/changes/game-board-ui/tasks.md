## 1. Create Cell Component

- [x] 1.1 Create `src/components/game/Cell.tsx` with cell states (unknown, water, ship, hit, miss, bomb, revealed)
- [x] 1.2 Add hover state styling for interactive cells
- [x] 1.3 Add click handler for bomb placement mode
- [x] 1.4 Add visual styling for each cell state using Tailwind CSS

## 2. Create Board Component

- [x] 2.1 Create `src/components/game/Board.tsx` that renders 10x10 grid
- [x] 2.2 Pass board data as prop and render Cell components
- [x] 2.3 Support bomb placement mode prop
- [x] 2.4 Handle onCellClick callback

## 3. Create SetupControls Component

- [x] 3.1 Create `src/components/game/SetupControls.tsx` with Regenerate button
- [x] 3.2 Add Ready button with disabled state after click
- [x] 3.3 Add "Place Bomb" toggle button for bomb placement mode
- [x] 3.4 Show opponent readiness status

## 4. Create useGameState Hook

- [x] 4.1 Create `src/hooks/useGameState.ts`
- [x] 4.2 Subscribe to Firebase RTDB at `/games/{roomId}`
- [x] 4.3 Return { game, loading, error, currentPlayerState, opponentState }
- [x] 4.4 Clean up listener on unmount and roomId change

## 5. Create Game Room Page

- [x] 5.1 Create `src/app/game/[roomId]/page.tsx`
- [x] 5.2 Load game state using useGameState hook
- [x] 5.3 Show loading state while fetching
- [x] 5.4 Render Board with player's ships
- [x] 5.5 Render SetupControls for bomb placement and ready
- [x] 5.6 Handle phase transition (redirect when battle phase starts)

## 6. Update Landing Page

- [x] 6.1 Modify landing page to redirect to game room when status is 'matched'
- [x] 6.2 Use `useMatchmaking().roomId` to detect match
