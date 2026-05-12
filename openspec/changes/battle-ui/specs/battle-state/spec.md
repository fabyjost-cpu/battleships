## ADDED Requirements

### Requirement: useBattleState manages shot cooldowns
The hook SHALL track when the player can fire based on cooldown elapsed time.

#### Scenario: Returns ready state when cooldown elapsed
- **WHEN** useBattleState is called with roomId and userId
- **WHEN** cooldown time has elapsed since last shot
- **THEN** canFire returns true

#### Scenario: Returns not ready when cooldown not elapsed
- **WHEN** cooldown time has NOT elapsed since last shot
- **THEN** canFire returns false
- **AND** remainingCooldown returns time in milliseconds

### Requirement: useBattleState queues shots
The hook SHALL allow queuing a shot and manage the local shot queue.

#### Scenario: Shot queued on fire call
- **WHEN** player calls fire(x, y) and canFire is true
- **THEN** shot is added to local queue
- **AND** canFire becomes false

#### Scenario: Shot not queued when cannot fire
- **WHEN** player calls fire(x, y) and canFire is false
- **THEN** no shot is queued

### Requirement: useBattleState listens to shot updates
The hook SHALL subscribe to RTDB for shot events to update board state.

#### Scenario: Board updates when shot resolves
- **WHEN** a shot resolves at (x, y) with hit: true
- **WHEN** the target is the opponent's board
- **THEN** the local board state updates to show hit at (x, y)

#### Scenario: Cooldown resets on hit
- **WHEN** shot result is {hit: true}
- **THEN** cooldown resets to 2000ms

#### Scenario: Cooldown resets on miss
- **WHEN** shot result is {hit: false}
- **THEN** cooldown resets to 5000ms

### Requirement: useBattleState returns game over state
The hook SHALL provide game over information when the game has ended.

#### Scenario: Winner available when game ended
- **WHEN** game status is "ended"
- **THEN** hook returns {winner: playerId} or {winner: "draw"}

#### Scenario: Loading state during transition
- **WHEN** game transitions from battle to ended
- **THEN** loading may briefly be true during state update
