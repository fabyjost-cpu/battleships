## ADDED Requirements

### Requirement: Shot validation checks cooldown
The cloud function SHALL validate that sufficient time has passed since the player's last shot before accepting a new shot.

#### Scenario: Shot rejected when cooldown not elapsed
- **WHEN** player fires a shot at (x, y)
- **WHEN** time since last shot is less than cooldown period
- **THEN** the shot is rejected with 429 status

#### Scenario: Shot accepted when cooldown elapsed
- **WHEN** player fires a shot at (x, y)
- **WHEN** time since last shot is greater than or equal to cooldown period
- **THEN** the shot is accepted and stored in RTDB

### Requirement: Shot resolution determines hit or miss
The cloud function SHALL evaluate the shot against the target board and determine hit/miss.

#### Scenario: Hit when shot lands on ship
- **WHEN** player fires at cell (x, y)
- **WHEN** cell (x, y) contains a ship segment
- **THEN** shot result is {hit: true, sunk: false}

#### Scenario: Miss when shot lands on water
- **WHEN** player fires at cell (x, y)
- **WHEN** cell (x, y) contains water (not a ship, not a bomb)
- **THEN** shot result is {hit: false}

#### Scenario: Bomb hit triggers explosion
- **WHEN** player fires at cell (x, y)
- **WHEN** cell (x, y) contains enemy bomb
- **THEN** shot result is {hit: true, bombExplosion: {x, y}}
- **AND** bombExplosion reveals all 8 surrounding tiles

### Requirement: Ship sinking detection
The cloud function SHALL detect when all segments of a ship have been hit.

#### Scenario: Ship marked as sunk when all segments hit
- **WHEN** player hits the final undamaged segment of a ship
- **THEN** shot result includes {sunk: true, shipType: "carrier"}

### Requirement: Win condition detection
The cloud function SHALL detect when all enemy ships have been sunk.

#### Scenario: Winner declared when all ships sunk
- **WHEN** player fires a shot that sinks the last enemy ship
- **THEN** game status is updated to "ended"
- **AND** winner is set to the firing player

#### Scenario: Draw when both fleets destroyed same turn
- **WHEN** both players have no ships remaining after shot resolution
- **THEN** game status is updated to "ended"
- **AND** winner is set to "draw"
