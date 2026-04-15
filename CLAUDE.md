# Trivia Game — Project Brief

## Vision

A local co-op trivia game in the spirit of Jackbox Party Pack, where a group of people can play together in the same room. The primary experience is social — sitting around a TV, reacting together, arguing about answers. Online play is a secondary concern and will be addressed only after the local experience is solid (people look up answers online anyway).

Long-term, the goal is for every player to participate from their own phone, exactly like Jackbox — one screen on the TV, everyone else on mobile. This should be kept in mind during architecture decisions but will not be built until Phase 3.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite | Fast dev loop, component-driven |
| Language | TypeScript | Strict mode on |
| Styling | Tailwind CSS | TV-optimized layout, large text |
| State | Zustand | Simple global game state |
| Questions | Open Trivia DB + Anthropic API | Normalized into shared schema |
| Hosting | Vercel / Netlify | One-click deploy, cast from any browser |

---

## Core Data Shapes

### Question
```ts
interface Question {
  id: string;
  question: string;
  answers: string[];       // always 4 options
  correctIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'api' | 'ai';
}
```

### Player
```ts
interface Player {
  id: string;
  name: string;
}
```

### GameState
```ts
type GamePhase =
  | 'setup'
  | 'category-pick'
  | 'question'
  | 'answer-reveal'
  | 'score-update'
  | 'game-over';

interface GameState {
  phase: GamePhase;
  players: Player[];
  scores: Record<string, number>;    // keyed by player id
  currentQuestion: Question | null;
  questionQueue: Question[];
  currentPlayerIndex: number;        // whose turn it is to select an answer
  roundNumber: number;
  totalRounds: number;
  selectedAnswerIndex: number | null;
}
```

---

## Game State Machine

```
setup → category-pick → question → answer-reveal → score-update
                ←______________________________________________|
                                                    (loop until game over)
                                                               ↓
                                                          game-over
```

The active player selects one of four answers on screen. Everyone in the room discusses openly — no buzz-in race. Buzz-in is a Phase 2 option.

---

## Question Sources

Both sources must be normalized into the `Question` interface above before entering the game.

### Open Trivia DB (base layer)
- Free public API: `https://opentdb.com/api.php`
- Returns HTML-encoded strings — must be decoded before display
- Used for standard categories (science, history, geography, etc.)

### Anthropic API (custom/AI layer) — deferred
- `src/services/aiQuestionService.ts` exists but is not wired into the engine
- Will be enabled when an API key is available
- Also planned: parse `Family Feud Question Database.xlsx` and `Trivia-Printable.xlsx` (repo root) as an offline question source using the `xlsx` package

---

## Phases

### Phase 1 — Core gameplay (current)
- [x] Scaffold: React + Vite + TypeScript + Tailwind + Zustand
- [x] Define all TypeScript types
- [x] Question engine service (OTDB, normalized output)
- [x] Zustand game store with full state machine
- [x] Setup screen (player names, round count, category selection)
- [x] Question display screen (TV-readable, big fonts, 4 answer options)
- [x] Turn-based answer selection (active player picks A/B/C/D, everyone discusses openly)
- [x] Answer reveal screen (correct answer highlighted, points awarded)
- [x] Winner screen
- [ ] Incorporate Excel question files (Family Feud + Trivia-Printable) as offline source
- [ ] Wire in Anthropic API question service (needs API key)

### Phase 2 — Polish the experience
- [ ] TV-optimized layout (high contrast, minimum 32px body text)
- [ ] Sound effects (correct, wrong, round end)
- [ ] Animations on answer reveal
- [ ] Buzz-in mechanic (optional competitive mode, keyboard keys per player)
- [ ] Wager/confidence mechanic (bet points before question is shown)
- [ ] Custom question pack support
- [ ] Handicap system for trailing players

### Phase 3 — Jackbox-style mobile participation
- [ ] WebSocket server (likely via Socket.io or Partykit)
- [ ] Room/session management (4-letter room codes like Jackbox)
- [ ] Mobile-friendly player UI (join via phone, tap to answer)
- [ ] TV host screen remains the shared display
- [ ] Abstract player input so answer selection works from any source

> **Architecture note for Phase 3**: Keep answer selection behind an abstraction from day one. Game actions (select answer, advance round) should be dispatchable from any source — click event, keyboard, or eventually WebSocket message. This makes the Phase 3 upgrade a transport addition, not a refactor.

---

## Key Design Principles

- **Local co-op first**: the social experience around one TV is the core product
- **TV-readable**: minimum 32px for question text, high contrast, visible from 3m away
- **Discussion-friendly**: turn-based answering encourages everyone to debate before committing
- **Fast rounds**: questions should resolve in under 60 seconds
- **Replayable**: mix of OTDB and AI-generated questions keeps the pool fresh

---

## Project Structure (target)

```
src/
  components/
    screens/
      SetupScreen.tsx
      CategoryPickScreen.tsx
      QuestionScreen.tsx
      AnswerRevealScreen.tsx
      ScoreboardScreen.tsx
      WinnerScreen.tsx
    ui/
      PlayerCard.tsx
      AnswerOption.tsx
      Timer.tsx
  store/
    gameStore.ts          # Zustand store + state machine
  services/
    questionEngine.ts     # fetches + normalizes from OTDB and Anthropic
    otdbService.ts
    aiQuestionService.ts
  types/
    index.ts              # all shared TypeScript types
  hooks/
    useGameActions.ts     # dispatchable game actions (answer, advance, etc.)
  App.tsx
  main.tsx
```

---

## Environment Variables

No environment variables are required to run the app currently — OTDB is a free public API with no key.

When the Anthropic AI question service is re-enabled:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

> Note: In Phase 3 when a backend is introduced, the Anthropic API key moves server-side.
