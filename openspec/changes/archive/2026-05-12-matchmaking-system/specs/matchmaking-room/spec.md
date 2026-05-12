## ADDED Requirements

### Requirement: Game room initializes with setup phase
The system SHALL create a game room in "setup" phase with empty player boards.

#### Scenario: Room created in setup phase
- **WHEN** two players are matched
- **THEN** `/games/{roomId}` is created with `status: "setup"`
- **AND** `phaseEndsAt` is set to current time + 30000ms
- **AND** `players` contains two entries with empty `board`, `ships: []`, `bombPosition: null`, `ready: false`

### Requirement: Room expires if players don't ready up
The system SHALL finalize the game room with random ship placements if 30 seconds pass without both players ready.

#### Scenario: Room timeout with one player not ready
- **WHEN** `phaseEndsAt` timestamp is reached
- **AND** not all players have `ready: true`
- **THEN** each non-ready player's ships and bomb are randomly placed
- **AND** each player's `ready` is set to `true`
- **AND** `status` transitions to `"battle"`

#### Scenario: Room timeout with all players ready
- **WHEN** `phaseEndsAt` timestamp is reached
- **AND** all players have `ready: true`
- **THEN** `status` transitions to `"battle"`

### Requirement: Room tracks both players independently
The system SHALL maintain separate state for each player within the room.

#### Scenario: Player state tracked separately
- **WHEN** room exists at `/games/{roomId}`
- **THEN** each player has their own entry at `/games/{roomId}/players/{playerId}`
- **AND** each player's board, ships, bomb position, ready status, and stats are tracked independently

### Requirement: Player can leave room before battle starts
The system SHALL allow a player to leave a room during setup phase.

#### Scenario: Player leaves room
- **WHEN** player sends leave request during setup phase
- **THEN** player's entry is removed from `/games/{roomId}/players/{playerId}`
- **AND** if only one player remains, room is marked abandoned
