## ADDED Requirements

### Requirement: Ship type definitions
The system SHALL define 5 ship types with correct sizes:

| Ship Type | Size |
|-----------|------|
| Carrier | 5 |
| Battleship | 4 |
| Cruiser | 3 |
| Submarine | 3 |
| Destroyer | 2 |

#### Scenario: Ship types exported correctly
- **WHEN** `SHIP_TYPES` is imported
- **THEN** it contains all 5 ship types with correct sizes

### Requirement: Create all ships for a fleet
The system SHALL create a fleet of 5 ships using `createShips()`.

#### Scenario: Create fleet
- **WHEN** `createShips()` is called
- **THEN** an array of 5 ships is returned
- **AND** each ship has a unique ID, type, size, and position

### Requirement: Ships have random valid positions
The system SHALL place each ship at a random valid position following placement rules.

#### Scenario: Ships placed without overlap
- **WHEN** `createShips()` is called
- **THEN** no two ships overlap
- **AND** no ships are diagonally adjacent

### Requirement: Ship state tracking
Each ship SHALL track its hit segments.

#### Scenario: Ship hit tracking
- **WHEN** a ship is created
- **THEN** it has `hits` array with length equal to size
- **AND** all hit values are `false`
