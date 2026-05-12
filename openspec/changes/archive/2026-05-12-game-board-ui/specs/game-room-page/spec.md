## ADDED Requirements

### Requirement: Game room page loads with roomId
The system SHALL load the game room page at `/game/[roomId]` and initialize the game state.

#### Scenario: Page loads and shows loading state
- **WHEN** user navigates to `/game/abc123`
- **THEN** a loading indicator is displayed while Firebase state is fetched

#### Scenario: Page loads and shows board when room exists
- **WHEN** user navigates to `/game/abc123` and room exists in Firebase
- **THEN** the game board is displayed with player's ships

#### Scenario: Page redirects when room not found
- **WHEN** user navigates to `/game/invalid` and room does not exist
- **THEN** user is redirected to landing page

### Requirement: Setup phase displays player board
The system SHALL display the player's own board during Phase 1 (setup).

#### Scenario: Ships visible on own board
- **WHEN** game is in setup phase
- **THEN** the player's ships are visible on their board

#### Scenario: Bomb position shown after placement
- **WHEN** player has placed their bomb
- **THEN** the bomb indicator appears at the chosen cell

### Requirement: Regenerate button re-randomizes ships
The system SHALL provide a regenerate button that re-randomizes ship placement.

#### Scenario: Regenerate calls API
- **WHEN** user clicks the "Regenerate" button
- **THEN** a POST request is made to `/api/game/regenerate`

#### Scenario: Regenerate updates board display
- **WHEN** regenerate API call succeeds
- **THEN** the board display updates with new ship positions

### Requirement: Ready button confirms setup
The system SHALL provide a ready button that marks the player as ready.

#### Scenario: Ready button calls API
- **WHEN** user clicks the "Ready" button
- **THEN** a POST request is made to `/api/game/ready`

#### Scenario: Ready button disabled after clicking
- **WHEN** user clicks the "Ready" button
- **THEN** the button becomes disabled and shows "Waiting..."

### Requirement: Bomb placement mode
The system SHALL allow player to enter bomb placement mode and select a cell.

#### Scenario: Enter bomb placement mode
- **WHEN** user clicks "Place Bomb" button
- **THEN** board enters bomb placement mode and cells become clickable

#### Scenario: Exit bomb placement mode on cell click
- **WHEN** user is in bomb placement mode and clicks a valid cell
- **THEN** bomb is placed and placement mode exits

#### Scenario: Cancel bomb placement
- **WHEN** user is in bomb placement mode and presses Escape
- **THEN** placement mode is cancelled without placing bomb

### Requirement: Opponent readiness shown
The system SHALL display whether the opponent has confirmed ready.

#### Scenario: Opponent not ready shows status
- **WHEN** opponent has not clicked ready
- **THEN** UI shows "Waiting for opponent..."

#### Scenario: Opponent ready shows status
- **WHEN** opponent has clicked ready
- **THEN** UI shows "Opponent ready!"

### Requirement: Phase transition to battle
The system SHALL transition to battle phase when both players are ready.

#### Scenario: Both ready triggers battle phase
- **WHEN** both players have clicked ready (or timeout occurs)
- **THEN** game status changes from 'setup' to 'battle'
- **AND** UI updates to show battle interface (future slice)

### Requirement: Landing page redirects after match
The system SHALL redirect from landing page to game room when matchmaking completes.

#### Scenario: Redirect to game room on match
- **WHEN** user is on landing page and matchmaking finds a match
- **THEN** user is automatically navigated to `/game/{roomId}`
