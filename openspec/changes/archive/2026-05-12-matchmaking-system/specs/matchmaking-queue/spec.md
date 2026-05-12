## ADDED Requirements

### Requirement: Player can join matchmaking queue
The system SHALL allow a player to enter the matchmaking queue via an HTTP POST request. The player SHALL be identified by their Firebase Anonymous Auth UID.

#### Scenario: Player joins queue successfully
- **WHEN** player sends POST to `/api/matchmaking/join` with valid auth token
- **THEN** player entry is created at `/matchmaking/queue/{playerId}` with `joinedAt` timestamp and `status: "waiting"`

#### Scenario: Player already in queue
- **WHEN** player sends POST to `/api/matchmaking/join` while already in queue
- **THEN** system returns error with status code 409 (Conflict)

#### Scenario: Player joins with invalid auth token
- **WHEN** player sends POST to `/api/matchmaking/join` with invalid or missing auth token
- **THEN** system returns error with status code 401 (Unauthorized)

### Requirement: Player can leave matchmaking queue
The system SHALL allow a player to exit the matchmaking queue via an HTTP POST request.

#### Scenario: Player leaves queue successfully
- **WHEN** player sends POST to `/api/matchmaking/leave` with valid auth token
- **THEN** player entry at `/matchmaking/queue/{playerId}` is removed

#### Scenario: Player not in queue when leaving
- **WHEN** player sends POST to `/api/matchmaking/leave` and player is not in queue
- **THEN** system returns success (idempotent operation)

#### Scenario: Player disconnects unexpectedly
- **WHEN** player's Firebase connection drops
- **THEN** `onDisconnect` handler removes player entry from queue

### Requirement: Queue entry tracks join time
The system SHALL record the timestamp when a player joins the queue to enable FIFO ordering.

#### Scenario: Queue entry contains timestamp
- **WHEN** player joins queue
- **THEN** entry includes `joinedAt` as Unix timestamp in milliseconds
