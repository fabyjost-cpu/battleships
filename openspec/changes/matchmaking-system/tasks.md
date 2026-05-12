## 1. Firebase RTDB Structure

- [x] 1.1 Define TypeScript types for QueueEntry in `src/lib/types.ts`
- [x] 1.2 Define TypeScript types for GameRoom and PlayerState in `src/lib/types.ts`

## 2. Matchmaking API Endpoints

- [x] 2.1 Create `POST /api/matchmaking/join` endpoint in `src/app/api/matchmaking/join/route.ts`
- [x] 2.2 Create `POST /api/matchmaking/leave` endpoint in `src/app/api/matchmaking/leave/route.ts`
- [x] 2.3 Add Firebase `onDisconnect` handler for automatic queue cleanup
- [x] 2.4 Add error handling for invalid auth tokens (401) and already-in-queue (409)

## 3. Player Matching Logic

- [x] 3.1 Create `matchPlayers` function in `src/lib/matchmaking.ts`
- [x] 3.2 Implement RTDB `onValue` listener that triggers matching when queue >= 2
- [x] 3.3 Use Firebase transaction for atomic pairing to prevent race conditions
- [x] 3.4 Implement FIFO ordering by `joinedAt` timestamp

## 4. Game Room Creation

- [x] 4.1 Create `createGameRoom` function in `src/lib/matchmaking.ts`
- [x] 4.2 Generate unique room ID using Firebase push ID
- [x] 4.3 Initialize room at `/games/{roomId}` with `status: "setup"`
- [x] 4.4 Set `phaseEndsAt` to 30 seconds from creation
- [x] 4.5 Initialize player slots with empty boards, `ready: false`

## 5. Setup Phase Timeout

- [x] 5.1 Implement RTDB listener for `phaseEndsAt` timestamp
- [x] 5.2 Auto-finalize ships and bomb placement when timeout reached
- [x] 5.3 Transition room to `"battle"` status when both players ready

## 6. Client Hook

- [x] 6.1 Create `useMatchmaking` hook in `src/hooks/useMatchmaking.ts`
- [x] 6.2 Expose `joinQueue()`, `leaveQueue()`, `matchmakingStatus`
- [x] 6.3 Add real-time status updates via RTDB listener

## 7. Testing

- [x] 7.1 Add unit tests for `matchPlayers` function
- [x] 7.2 Add unit tests for `createGameRoom` function
- [x] 7.3 Add unit tests for join/leave queue edge cases
