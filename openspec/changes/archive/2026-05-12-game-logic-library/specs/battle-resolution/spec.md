## ADDED Requirements

### Requirement: Resolve shot on water
The system SHALL return `{hit: false, sunk: false, bombExplosion: false}` when shooting water.

#### Scenario: Shot misses water
- **WHEN** `resolveShot(board, x, y)` is called on a water cell
- **THEN** result is `{hit: false, sunk: false, bombExplosion: false, newBoard}`

### Requirement: Resolve shot on ship
The system SHALL return `{hit: true, sunk: false, bombExplosion: false}` when shooting a ship segment (unless last segment).

#### Scenario: Shot hits ship
- **WHEN** `resolveShot(board, x, y)` is called on a ship cell
- **THEN** result is `{hit: true, sunk: false, bombExplosion: false, newBoard}`
- **AND** newBoard cell at (x, y) is marked as `'hit'`

### Requirement: Resolve shot on bomb
The system SHALL return `{hit: true, sunk: false, bombExplosion: true}` when shooting a bomb cell.

#### Scenario: Shot hits bomb triggers explosion
- **WHEN** `resolveShot(board, x, y)` is called on a bomb cell
- **THEN** result is `{hit: true, sunk: false, bombExplosion: true, newBoard}`
- **AND** all 8 surrounding cells are revealed in newBoard

### Requirement: Bomb explosion reveals surrounding tiles
When a bomb explodes, all 8 surrounding cells SHALL be revealed as `'revealed'` state.

#### Scenario: Bomb reveals all neighbors
- **WHEN** bomb at (5, 5) is hit
- **THEN** cells at (4,4), (4,5), (4,6), (5,4), (5,6), (6,4), (6,5), (6,6) are revealed
- **AND** they appear as `'revealed'` in newBoard

#### Scenario: Bomb at edge reveals fewer cells
- **WHEN** bomb at (0, 0) is hit
- **THEN** only cells within board bounds are revealed

### Requirement: Ship sinking detection
The system SHALL return `{sunk: true}` when the last unhit segment of a ship is destroyed.

#### Scenario: Ship sinks when last segment hit
- **WHEN** `resolveShot(board, x, y)` hits the last unhit segment of a ship
- **THEN** result includes `sunk: true`

### Requirement: Check win condition
The system SHALL return `true` from `checkWin(board)` when all ship segments are hit.

#### Scenario: Win when all ships sunk
- **WHEN** `checkWin(board)` is called
- **AND** all ship segments are hit
- **THEN** `true` is returned

#### Scenario: No win when ships remain
- **WHEN** `checkWin(board)` is called
- **AND** at least one ship has unhit segments
- **THEN** `false` is returned

### Requirement: Check draw condition
The system SHALL return `true` from `checkDraw(board)` when no ships remain but win not yet determined.

#### Scenario: Draw when both sides have no ships
- **WHEN** `checkDraw(board)` is called
- **AND** no ship segments remain unhit
- **THEN** `true` is returned
