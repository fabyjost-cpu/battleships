## ADDED Requirements

### Requirement: Board renders 10x10 grid
The system SHALL render a 10x10 grid of cells representing the player's game board.

#### Scenario: Board displays with correct dimensions
- **WHEN** Board component is rendered
- **THEN** it displays exactly 100 cells arranged in 10 rows and 10 columns

#### Scenario: Board shows water cells by default
- **WHEN** Board is rendered with a board array containing 'water' values
- **THEN** each cell displays the water visual state

#### Scenario: Board shows ship cells
- **WHEN** Board is rendered with a board array containing 'ship' values
- **THEN** each cell with 'ship' displays the ship visual state

### Requirement: Cell responds to hover
The system SHALL show a hover state when the user hovers over an interactive cell.

#### Scenario: Hover shows visual feedback
- **WHEN** user hovers over an empty water cell in placement mode
- **THEN** cell displays a hover indicator

### Requirement: Cell responds to click during bomb placement
The system SHALL allow clicking on cells to place the bomb during setup phase.

#### Scenario: Bomb placed on water cell
- **WHEN** user is in bomb placement mode and clicks a water cell
- **THEN** the bomb position is set and cell shows bomb indicator

#### Scenario: Bomb not placeable on ship
- **WHEN** user is in bomb placement mode and clicks a ship cell
- **THEN** the bomb is NOT placed and an error is not shown (click is ignored)

### Requirement: Cell shows hit/miss states
The system SHALL display hit and miss markers on cells after shots are fired.

#### Scenario: Hit cell displays marker
- **WHEN** a cell has been hit by an opponent shot
- **THEN** it displays a hit indicator (red/cross)

#### Scenario: Miss cell displays marker
- **WHEN** a shot misses at a cell (water with no ship)
- **THEN** it displays a miss indicator (white/dot)

### Requirement: Bomb explosion reveals surrounding cells
The system SHALL display revealed state for cells around an exploded bomb.

#### Scenario: Bomb explosion cell shows bomb
- **WHEN** a bomb at position (x,y) is hit
- **THEN** the bomb cell displays the bomb visual

#### Scenario: Surrounding cells revealed
- **WHEN** a bomb at position (x,y) explodes
- **THEN** all 8 surrounding cells (where valid) display as revealed
