# game-over

## Capability Overview

The game-over capability provides end-game UI when a battle concludes, displaying the outcome, final statistics, and options to return to lobby or play again.

## ADDED Requirements

### Requirement: GameOver component displays winner announcement
The system SHALL display an appropriate message based on the game outcome.

#### Scenario: Player wins
- **WHEN** GameOver component receives `winner === currentUserId`
- **THEN** component displays "You Win!" in green text

#### Scenario: Player loses
- **WHEN** GameOver component receives `winner !== currentUserId` and `winner !== 'draw'`
- **THEN** component displays "You Lose!" in red text

#### Scenario: Draw game
- **WHEN** GameOver component receives `winner === 'draw'`
- **THEN** component displays "It's a Draw!" in yellow text

### Requirement: GameOver displays final battle statistics
The system SHALL show battle statistics for both the current player and opponent.

#### Scenario: Display player stats
- **WHEN** GameOver component renders
- **WHEN** player stats are available
- **THEN** component displays player's hits, misses, accuracy, and shots fired

#### Scenario: Display opponent stats
- **WHEN** GameOver component renders
- **WHEN** opponent stats are available
- **THEN** component displays opponent's hits, misses, accuracy, and shots fired

#### Scenario: Calculate accuracy
- **WHEN** accuracy is displayed
- **THEN** accuracy is calculated as `(hits / shotsFired) * 100` rounded to 1 decimal place
- **WHEN** shotsFired is 0
- **THEN** accuracy displays as "0.0%"

### Requirement: GameOver provides navigation options
The system SHALL provide buttons to navigate back to lobby or re-enter matchmaking.

#### Scenario: Return to lobby
- **WHEN** player clicks "Return to Lobby" button
- **THEN** player is navigated to the home page

#### Scenario: Play again
- **WHEN** player clicks "Play Again" button
- **THEN** player leaves the current game room
- **THEN** player is automatically placed in matchmaking queue

### Requirement: GameOver displays ship sink status
The system SHALL show which ships were sunk during the battle.

#### Scenario: Show sunk ships
- **WHEN** GameOver component renders
- **WHEN** a ship has all segments hit
- **THEN** that ship is displayed as "sunk" in the stats

#### Scenario: Show remaining ships
- **WHEN** GameOver component renders
- **WHEN** a ship has at least one unhit segment
- **THEN** that ship is displayed as intact

## File Structure

```
src/components/game/GameOver.tsx   # Main GameOver component
```
