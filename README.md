# GLITCH IN THE ARCHIVE

A daily detective deception game. Every day at 00:00 UTC, **The Archivist** — an algorithm that
corrupts history — forges one lie into one of three recovered documents about a real historical
event. Accuse the fabricated document. Mark the forged sentence. Build your streak. Earn your rank.

Built by **Eiman Wasim**. An original game and an original villain — training the human skill of
catching confident, plausible falsehoods in the AI era.

## Run it

```bash
npm install
npm run dev
```

`npm run build` produces a static production bundle in `dist/`. Deploy anywhere static
(Vercel, Netlify, GitHub Pages). `vercel.json` already handles SPA routing.

**Fully static. No backend, no database, no API keys, no accounts, no tracking.**
Player stats live in browser localStorage only.

## How it works (the thesis)

Compute-then-explain, applied to a game:

- A **verified fact database** (60 well-documented historical events, `src/data/events.ts`) is the ground truth.
- A **deterministic engine** (`src/lib/engine.ts`) derives everything from the calendar date: which
  event, which document lies, which fact field is corrupted (date / name / place / figure / outcome),
  and by how much — difficulty escalates through the week (Mon loud → Sun surgical).
- The six facts are **split across the three documents with no overlap**, so the lie cannot be
  found by cross-referencing — only by knowledge and instinct.
- Narration is template-composed from the fact sheets in three archival voices. The corrupted
  document uses the identical template with the false value: equally confident, equally fluent.
  That is the entire deception — and the entire lesson.

The whole world gets the same case each day. The reveal always shows exactly what was forged,
so even a lost case teaches a true fact.

## Content runway

60 cases ship in `src/data/events.ts` — the daily rotation cycles with varied corruption, so no
two passes through an event play the same. To extend, append events following the same shape.

## The Archivist

All characters, ranks, and taunts are original IP. Rank ladder: Clerk → … → THE ADVERSARY.
The Archivist's notes escalate with your streak. He is, fittingly, an algorithm.
