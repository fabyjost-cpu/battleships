## ADDED Requirements

### Requirement: Own board displays ship positions with damage
The system SHALL render a 10x10 grid showing the player's ships with hit/miss markers from enemy shots.

#### Scenario: Ships visible during battle phase
- **WHEN** OwnBoard is rendered in battle phase
- **WHEN** no enemy shots have hit any ship
- **THEN** all ship cells display the ship visual state

#### Scenario: Hit markers on damaged ship segments
- **WHEN** enemy has fired at cell (x, y) containing a ship segment
- **WHEN** the shot was a hit
- **THEN** cell (x, y) displays the hit visual state overlaid on ship

#### Scenario: Miss markers on water cells
- **WHEN** enemy has fired at cell (x, y) containing water
- **WHEN** the shot was a miss
- **THEN** cell (x, y) displays the miss visual state

### Requirement: Bomb explosion displays on own board
The system SHALL display the bomb explosion effect when the player's bomb is hit by enemy.

#### Scenario: Bomb cell revealed when hit
- **WHEN** enemy fires at the cell containing player's bomb
- **THEN** the bomb cell displays the bomb visual state

#### Scenario: Surrounding cells revealed
- **WHEN** enemy fires at player's bomb at cell (x, y)
- **WHEN** cell (x+1, y+1) is within board bounds
- **THEN** cell (x+1, y+1) displays the revealed visual state

### Requirement: Own board is not interactive
The system SHALL NOT allow clicking on own board cells during battle phase.

#### Scenario: Click on own board cell ignored
- **WHEN** player clicks on any cell of OwnBoard
- **THEN** no action is taken
