## ADDED Requirements

### Requirement: useGameState subscribes to game room
The hook SHALL subscribe to Firebase RTDB at `/games/{roomId}` and return game state.

#### Scenario: Hook returns loading initially
- **WHEN** `useGameState(roomId)` is called
- **THEN** it returns `{ game: null, loading: true, error: null }` initially

#### Scenario: Hook returns game data when loaded
- **WHEN** Firebase RTDB has data for the room
- **THEN** hook returns `{ game: GameRoom, loading: false, error: null }`

#### Scenario: Hook returns error on failure
- **WHEN** Firebase RTDB read fails
- **THEN** hook returns `{ game: null, loading: false, error: 'message' }`

### Requirement: Hook unsubscribes on unmount
The hook SHALL clean up the Firebase listener when the component unmounts.

#### Scenario: Listener removed on unmount
- **WHEN** component using `useGameState` unmounts
- **THEN** the Firebase `off()` is called to remove the listener

### Requirement: Hook unsubscribes on roomId change
The hook SHALL clean up the previous listener when roomId changes.

#### Scenario: Old listener removed on roomId change
- **WHEN** roomId changes from 'roomA' to 'roomB'
- **THEN** listener for 'roomA' is removed
- **AND** new listener for 'roomB' is established

### Requirement: Hook returns current user from game
The system SHALL provide access to the current player's state within the game room.

#### Scenario: Current player state available
- **WHEN** game data is loaded
- **THEN** hook provides `currentPlayerState` from `game.players[currentUserId]`

#### Scenario: Opponent state available
- **WHEN** game data is loaded
- **THEN** hook provides `opponentState` from `game.players[otherUserId]`
