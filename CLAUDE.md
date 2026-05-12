# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## General rules
**DO:**
- always ask if there is any uncertainty or you see room for improvement
- always try to follow the docs md files. if there's an inconsistency or something that should be added there, ask the user about the requested change and only continue your task afterward
- whenever architecture, techstack or game features change due to a prompt by the user, propose that change in the respective md files as well.
**DON'T:** 
- implement without being told to do so
- push changes to main branch without explicit approval
- igore existing patterns or readme files we created

## Project Overview

**Battleships Real-Time** - A 2-player web-based Battleships game with hidden bombs and acceleration mechanics.

- **Game Rules**: See [docs/game-spec.md](./docs/game-spec.md)
- **Architecture**: See [docs/architecture.md](./docs/architecture.md)
- **Guidelines**: See [docs/guidelines.md](./docs/guidelines.md)

## Quick Reference

### Tech Stack
Next.js 14 + Firebase (RTDB + Cloud Functions + Hosting)

### Key Commands
```bash
npm run dev              # Start Next.js dev server
firebase emulators:start # Start Firebase emulators
firebase deploy          # Deploy to Firebase
```

### Critical Files
- `src/lib/game/board.ts` - Ship placement algorithm
- `src/lib/game/battle.ts` - Combat resolution
- `functions/src/matchmaking.ts` - Queue & room creation
- `functions/src/game.ts` - Game logic Cloud Functions

### TODO
- [ ] Project initialization (Next.js + Firebase)
- [ ] Firebase project setup (RTDB, Functions, Hosting)
- [ ] Game logic library (board, ships, battle)
- [ ] Firebase Cloud Functions (matchmaking, game logic)
- [ ] Firebase RTDB security rules
- [ ] Frontend UI (landing, game board)
- [ ] Real-time game sync with Firebase SDK
- [ ] Game over and stats
