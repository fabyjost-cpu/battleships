## ADDED Requirements

### Requirement: Board is 10x10 grid of water cells
The system SHALL generate a 10x10 grid where every cell is initialized to `'water'`.

#### Scenario: Generate empty board
- **WHEN** `generateBoard()` is called
- **THEN** a 10x10 2D array is returned
- **AND** all cells equal `'water'`

### Requirement: Coordinate validation
The system SHALL reject coordinates outside [0-9] range for both x and y.

#### Scenario: Valid coordinate
- **WHEN** `isValidCoordinate(5, 3)` is called
- **THEN** `true` is returned

#### Scenario: Invalid x coordinate
- **WHEN** `isValidCoordinate(10, 3)` is called
- **THEN** `false` is returned

#### Scenario: Invalid y coordinate
- **WHEN** `isValidCoordinate(5, -1)` is called
- **THEN** `false` is returned

### Requirement: Ship placement validation - no overlap
The system SHALL reject ship placements that overlap with existing ships.

#### Scenario: Can place ship on empty cells
- **WHEN** `canPlaceShip(board, ship)` is called with ship at non-overlapping position
- **THEN** `true` is returned

#### Scenario: Cannot place ship on occupied cells
- **WHEN** `canPlaceShip(board, ship)` is called with ship overlapping existing ship
- **THEN** `false` is returned

### Requirement: Ship placement validation - no diagonal adjacency
The system SHALL reject ship placements where any segment is diagonally adjacent to another ship's segment.

#### Scenario: Can place ship orthogonally adjacent
- **WHEN** `hasNoAdjacentShips(board, ship)` is called with orthogonal adjacency
- **THEN** `true` is returned

#### Scenario: Cannot place ship diagonally adjacent
- **WHEN** `hasNoAdjacentShips(board, ship)` is called with diagonal adjacency
- **THEN** `false` is returned

### Requirement: Random ship placement
The system SHALL place a ship at a random valid position using `placeShipRandomly(board, ship)`.

#### Scenario: Ship placed at valid random position
- **WHEN** `placeShipRandomly(board, ship)` is called
- **THEN** a ship is placed on the board at a valid position
- **AND** the returned board has the ship placed

### Requirement: Bomb placement on empty water
The system SHALL allow placing a bomb only on cells containing `'water'`.

#### Scenario: Can place bomb on water
- **WHEN** `canPlaceBomb(board, x, y)` is called on a water cell
- **THEN** `true` is returned

#### Scenario: Cannot place bomb on ship
- **WHEN** `canPlaceBomb(board, x, y)` is called on a ship cell
- **THEN** `false` is returned
