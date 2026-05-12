# game-stats

## Capability Overview

The game-stats capability tracks and persists per-player statistics during battle, making them available for display at game end.

## ADDED Requirements

### Requirement: Stats are persisted per player during battle
The system SHALL update player statistics in RTDB after each shot resolves.

#### Scenario: Increment hits on hit
- **WHEN** player fires a shot that hits an enemy ship
- **THEN** player's `stats.hits` is incremented by 1
- **THEN** player's `stats.shotsFired` is incremented by 1

#### Scenario: Increment misses on miss
- **WHEN** player fires a shot that misses
- **THEN** player's `stats.misses` is incremented by 1
- **THEN** player's `stats.shotsFired` is incremented by 1

### Requirement: Stats are computed accurately
The system SHALL calculate derived statistics correctly.

#### Scenario: Accuracy calculation
- **WHEN** accuracy is requested
- **THEN** it is calculated as `(hits / shotsFired) * 100`
- **WHEN** shotsFired is 0
- **THEN** accuracy is 0

#### Scenario: Opponent stats reflect received damage
- **WHEN** opponent's board receives a hit
- **THEN** opponent's `stats.hits` is NOT incremented
- **THEN** the firing player's stats reflect the outcome

### Requirement: Stats are available at game end
The system SHALL make final statistics available for the GameOver display.

#### Scenario: Stats available when game finishes
- **WHEN** game status changes to 'finished'
- **THEN** both players' final stats are readable from RTDB
- **THEN** GameOver component can retrieve stats for display

## File Structure

```
src/app/api/game/shot/route.ts   # Shot endpoint that persists stats
```
