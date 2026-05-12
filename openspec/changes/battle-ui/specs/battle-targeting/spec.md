## ADDED Requirements

### Requirement: Enemy board displays 10x10 targeting grid
The system SHALL render a 10x10 grid of cells representing the enemy's game board for targeting.

#### Scenario: Grid shows unknown cells by default
- **WHEN** EnemyBoard is rendered in battle phase
- **WHEN** no shots have been fired at any cell
- **THEN** all 100 cells display the unknown state

#### Scenario: Hit cells show red marker
- **WHEN** a shot has been fired at cell (x, y) and it was a hit
- **THEN** cell (x, y) displays the hit visual state

#### Scenario: Miss cells show white marker
- **WHEN** a shot has been fired at cell (x, y) and it was a miss
- **THEN** cell (x, y) displays the miss visual state

#### Scenario: Revealed cells show bomb or water
- **WHEN** a bomb at cell (x, y) has exploded
- **WHEN** surrounding cell (x+1, y+1) is within board bounds
- **THEN** cell (x+1, y+1) displays the revealed visual state

### Requirement: Cells are clickable when player can fire
The system SHALL allow clicking on cells to target a shot when cooldown has elapsed.

#### Scenario: Clicking cell during ready state fires shot
- **WHEN** player cooldown has elapsed
- **WHEN** player clicks on an unknown cell
- **THEN** a shot is queued for that cell

#### Scenario: Clicking cell during cooldown does nothing
- **WHEN** player cooldown has NOT elapsed
- **WHEN** player clicks on a cell
- **THEN** no shot is queued
- **AND** cooldown indicator remains visible

#### Scenario: Cannot target already targeted cells
- **WHEN** player clicks on a cell that already has a hit or miss marker
- **THEN** no shot is queued
- **AND** click is ignored

### Requirement: Cooldown indicator displays remaining time
The system SHALL show a visual indicator of the shot cooldown timer.

#### Scenario: Shows 2 second indicator after hit
- **WHEN** player has fired a shot that was a hit
- **THEN** cooldown indicator shows 2 seconds

#### Scenario: Shows 5 second indicator after miss
- **WHEN** player has fired a shot that was a miss
- **THEN** cooldown indicator shows 5 seconds

#### Scenario: Shows ready state when cooldown elapsed
- **WHEN** cooldown timer has reached 0
- **THEN** indicator shows ready state (e.g., glowing border)
