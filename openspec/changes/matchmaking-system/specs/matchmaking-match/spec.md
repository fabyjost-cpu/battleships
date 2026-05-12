## ADDED Requirements

### Requirement: Players are paired when queue has 2+ players
The system SHALL automatically pair two waiting players when the queue contains at least 2 players. Pairing SHALL be first-in-first-out based on `joinedAt` timestamp.

#### Scenario: Two players paired successfully
- **WHEN** queue contains exactly 2 players
- **THEN** the two oldest entries are paired and removed from queue
- **AND** a game room is created at `/games/{roomId}`

#### Scenario: Multiple players in queue
- **WHEN** queue contains more than 2 players
- **THEN** the two oldest players are paired first
- **AND** remaining players stay in queue for subsequent matches

#### Scenario: Single player in queue
- **WHEN** queue contains exactly 1 player
- **THEN** no matching occurs
- **AND** player remains waiting

### Requirement: Pairing is atomic
The system SHALL ensure two players are never matched into the same room with different partners.

#### Scenario: Race condition prevented
- **WHEN** multiple serverless function instances detect queue with 2+ players simultaneously
- **THEN** only one instance successfully pairs players (using Firebase transaction)
- **AND** other instances see updated queue state

### Requirement: Room creation includes both player IDs
The system SHALL create a game room with both player IDs assigned.

#### Scenario: Room created with player slots
- **WHEN** players A and B are matched
- **THEN** room is created at `/games/{roomId}`
- **AND** `players` field contains entries for both `playerA` and `playerB`
- **AND** `status` is set to `"setup"`
- **AND** `phaseEndsAt` is set to 30 seconds from now
