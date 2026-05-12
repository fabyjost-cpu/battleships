# Guidelines

## File Types

### TypeScript/React (`.ts`, `.tsx`)

**Component Files**
- One component per file
- File name = component name (PascalCase)
- Co-locate tests as `ComponentName.test.tsx`
- Use `function` declaration, not arrow function for components

```typescript
// components/Board.tsx
export function Board({ size }: { size: number }) {
  return <div>{/* ... */}</div>;
}
```

**Utility Files**
- File name = descriptive kebab-case
- Default export for single function
- Named exports for multiple utilities

```typescript
// lib/game/board.ts
export function generateBoard(): Board { }
export function placeShip(board: Board, ship: Ship): Board { }
```

**Type Definition Files**
- Co-locate with implementation or in `types/` directory
- Use `type` for unions/interfaces, `interface` for object shapes

```typescript
// types/game.ts
export type CellType = 'water' | 'ship' | 'bomb';

export interface Ship {
  type: ShipType;
  positions: Position[];
  hits: number;
}

export interface Position {
  x: number;
  y: number;
}
```

### Cloud Functions (`functions/src/`)

- **TypeScript** - All Cloud Functions written in TypeScript
- One function per file for large functions
- Group related functions in same file
- Export naming: `onMatchmakingJoin`, `onGameShot`

```typescript
// functions/src/matchmaking.ts
export async function onJoinQueue(...): Promise<...> { }
export async function onLeaveQueue(...): Promise<...> { }
```

### Styles (`.module.css` or Tailwind)

- Prefer Tailwind utility classes over custom CSS
- Use CSS modules only for complex component-specific styles
- Keep Tailwind classes in JSX, not extracted to variables

```tsx
// Good
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">

// Avoid
const buttonClass = "bg-blue-500";
<button className={buttonClass}>
```

---

## Functions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `GameBoard` |
| Hooks | camelCase, `use` prefix | `useGameState` |
| Utilities | camelCase or kebab-case | `generateBoard` |
| Cloud Functions | `on` + Resource + Action | `onMatchmakingJoin` |
| Event Handlers | `handle` + Event | `handleCellClick` |
| Callbacks | `on` + Result | `onShotFired` |

### Function Structure

Keep functions small and focused:
- Maximum ~50 lines for utilities
- Maximum ~100 lines for React components
- Split complex functions into smaller helpers

```typescript
// Good: focused, testable
export function isValidPlacement(board: Board, ship: Ship): boolean {
  return canPlaceShip(board, ship) &&
         hasNoAdjacentShips(board, ship);
}

// Good: extracted complexity
export function resolveShot(board: Board, shot: Shot): ShotResult {
  const target = board[shot.y][shot.x];
  if (target === 'ship') return handleShipHit(board, shot);
  if (target === 'bomb') return handleBombExplosion(board, shot);
  return { hit: false };
}
```

### React Hooks

```typescript
// Custom hook pattern
export function useGameState(roomId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = ref(db, `games/${roomId}`);
    return onValue(ref, (snapshot) => {
      setGame(snapshot.val());
      setLoading(false);
    });
  }, [roomId]);

  return { game, loading };
}
```

---

## Best Practices

### State Management

- **Firebase RTDB is source of truth** - don't duplicate game state in React
- Use React state only for UI-specific state (modals, loading, errors)
- Subscribe to Firebase paths, don't poll

```typescript
// Good: Firebase drives state
const { game } = useGameState(roomId);

// Bad: Duplicate state
const [localGame, setLocalGame] = useState(game);
```

### Error Handling

```typescript
// Cloud Functions: Always wrap in try/catch
export async function onGameShot(...) {
  try {
    // ... logic
  } catch (error) {
    console.error('Shot error:', error);
    throw new HttpsError('internal', 'Failed to process shot');
  }
}

// React: Handle loading/error states
const { game, loading, error } = useGameState(roomId);
if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

### Security

- **Validate in Cloud Functions, not just client**
- Use Firebase Auth UID as player identifier
- Check player is in room before processing actions
- Never trust client-provided data

```typescript
// Good: Server validates
export async function onGameShot(data: {x: number, y: number}, context: Context) {
  const uid = context.auth?.uid;
  if (!canPlayerShoot(roomId, uid)) {
    throw new HttpsError('permission-denied', 'Not your turn');
  }
}
```

### Performance

- Use Firebase RTDB listeners over polling
- Limit data scope: listen to `/games/{id}/players/{uid}` not entire `/games`
- Use `useCallback` and `useMemo` for expensive computations
- Lazy load non-critical components

---

## File Structure

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing/matchmaking
│   ├── game/
│   │   └── [roomId]/        # Dynamic route for games
│   │       └── page.tsx
│   └── layout.tsx           # Root layout
├── components/              # Shared UI components
│   ├── ui/                  # Generic (Button, Card, Spinner)
│   ├── game/                # Game-specific (Board, Cell, Ship)
│   └── lobby/               # Matchmaking (QueueStatus, FindMatch)
├── lib/                     # Shared utilities
│   ├── game/                # Game logic (pure functions)
│   │   ├── board.ts
│   │   ├── ships.ts
│   │   └── battle.ts
│   ├── firebase.ts          # Firebase client init
│   └── hooks/               # Custom React hooks
│       ├── useAuth.ts
│       └── useGameState.ts
└── types/                   # TypeScript types
    └── game.ts

functions/src/              # Cloud Functions
├── index.ts                # Exports
├── matchmaking.ts           # Queue logic
├── game.ts                 # Game actions
└── db.ts                   # Admin init
```

### Import Order

```typescript
// 1. React / Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. Third-party
import { useDatabase } from 'reactfire';

// 3. Internal
import { Cell } from '@/components/game/Cell';
import { generateBoard } from '@/lib/game/board';
import type { Game, Position } from '@/types/game';
```

---

## Tech Stack Usage

### Next.js App Router

- Server Components by default
- Add `'use client'` only when needed (hooks, event handlers)
- Keep client boundaries minimal

```tsx
// app/game/[roomId]/page.tsx (Server Component)
import { GameBoard } from '@/components/game/GameBoard';

export default function GamePage({ params }: { params: { roomId: string } }) {
  return <GameBoard roomId={params.roomId} />;
}

// components/game/GameBoard.tsx ('use client')
'use client';
import { useGameState } from '@/lib/hooks/useGameState';
```

### Firebase SDK

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const clientFirebase = initializeApp(firebaseConfig);
export const db = getDatabase(clientFirebase);

// functions/src/db.ts (Admin)
import { initializeApp, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount), databaseURL: ... });
}
export const adminDb = getDatabase();
```

### Tailwind CSS

- Use design system tokens (colors, spacing)
- Follow consistent naming: `bg-{color}-{shade}`
- Use `group` and `group-*` for nested hover/active states

```tsx
// Use semantic names from tailwind config
<button className="bg-primary hover:bg-primary/90 text-white rounded">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Hover states
<button className="hover:scale-105 transition-transform">
```

---

## Visual Design

### Design System

**Colors**
- Primary: Blue-500 (buttons, highlights)
- Secondary: Gray-500 (secondary actions)
- Success: Green-500 (hits, wins)
- Danger: Red-500 (bombs, misses)
- Background: Slate-900 (dark theme)
- Surface: Slate-800 (cards, boards)

**Typography**
- Font: System sans-serif (Tailwind default)
- Headings: Bold, tracking-tight
- Body: Normal weight, leading-relaxed

**Spacing**
- Base unit: 4px (Tailwind default)
- Consistent padding: p-4 for cards, gap-2 for grids

### Component Patterns

**Game Board Cell**
```
Size: 32x32px (sm), 40x40px (md), 48x48px (lg)
Border: 1px slate-600
States:
  - Water (unknown): bg-slate-700
  - Ship (own board): bg-slate-500
  - Hit: bg-red-500 with X icon
  - Miss: bg-slate-800 with dot
  - Bomb explosion: bg-orange-500 radiating
```

**Buttons**
```
Primary: bg-blue-500 text-white px-4 py-2 rounded-lg
Secondary: bg-slate-700 text-slate-200 px-4 py-2 rounded-lg
Danger: bg-red-500 text-white px-4 py-2 rounded-lg
Disabled: opacity-50 cursor-not-allowed
```

**Cards**
```
Background: bg-slate-800
Border: border border-slate-700
Border-radius: rounded-xl
Padding: p-4 or p-6
Shadow: shadow-lg shadow-black/20
```

### Layout

**Responsive Breakpoints**
- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (centered max-w-5xl)

**Grid System**
- Board: CSS Grid, fixed cell sizes
- Page: Flexbox or Grid depending on content

---

## Testing

- Unit test pure functions (game logic)
- Integration test Cloud Functions with Firebase Emulator
- E2E test critical flows (matchmaking, game, win/lose)

```typescript
// lib/game/board.test.ts
describe('generateBoard', () => {
  it('creates 10x10 board', () => {
    const board = generateBoard();
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(10);
  });

  it('places all ships', () => {
    const board = generateBoard();
    const shipCells = board.flat().filter(c => c === 'ship');
    expect(shipCells.length).toBe(17); // 5+4+3+3+2
  });
});
```

---

## Git Workflow

### Branch Strategy
- `main` - production-ready code
- Feature branches: `feat/<feature-name>`

### Per-Feature Workflow
1. Create branch: `git checkout -b feat/game-logic`
2. Implement and test
3. Commit: `git commit -m "feat: add game logic library"`
4. Push: `git push -u origin HEAD`
5. PR to `main` when ready

### Commit Messages (Conventional Commits)
```
feat: add matchmaking system
fix: resolve shot cooldown bug
docs: update game spec
refactor: extract board generation
test: add battle resolution tests
chore: setup Firebase emulators
```

### Git Commands
```bash
git checkout -b feat/<name>     # Create feature branch
git add <files>                 # Stage changes
git commit -m "type: message"  # Commit
git push -u origin HEAD         # Push and track
git checkout main && git pull   # Update main
```
