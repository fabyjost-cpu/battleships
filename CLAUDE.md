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

## Required Workflow

**Per-Feature Workflow** - Use OpenSpec for all changes:

1. **Propose**: Run `/opsx:propose` or `openspec propose` to create change artifacts
2. **Implement**: Run `/opsx:apply <name>` to implement tasks from the change
3. **Test**: Verify `npm run build && npm test` pass before committing
4. **Commit**: Create a commit with conventional commit message
5. **Push**: Push to remote when ready
6. **Archive**: Run `/opsx:archive <name>` when change is complete and merged

**Never commit directly to main** - always use feature branches and PRs.

## Project Overview

**Battleships Real-Time** - A 2-player web-based Battleships game with hidden bombs and acceleration mechanics.

- **Game Rules**: See [docs/game-spec.md](./docs/game-spec.md)
- **Architecture**: See [docs/architecture.md](./docs/architecture.md)
- **Guidelines**: See [docs/guidelines.md](./docs/guidelines.md)

## Quick Reference

### Tech Stack
Next.js 15 (App Router) + Firebase (RTDB) + Vercel (Serverless Functions + Hosting)

### Key Commands
```bash
npm run dev              # Start Next.js dev server
vercel dev               # Start Vercel dev server (includes serverless functions)
vercel deploy            # Deploy to Vercel (hosting + serverless functions)
npm run build            # Build Next.js for production
```

### Critical Files
- `src/lib/game/board.ts` - Ship placement algorithm
- `src/lib/game/battle.ts` - Combat resolution
- `src/app/api/matchmaking/route.ts` - Matchmaking endpoint
- `src/app/api/game/route.ts` - Game logic endpoints

### TODO
- [x] Project initialization (Next.js + Firebase)
- [ ] Firebase project setup (RTDB)
- [x] Game logic library (board, ships, battle) ✓
- [ ] Vercel Serverless Functions (matchmaking, game logic)
- [ ] Firebase RTDB security rules
- [ ] Frontend UI (landing, game board)
- [ ] Real-time game sync with Firebase SDK
- [ ] Game over and stats
