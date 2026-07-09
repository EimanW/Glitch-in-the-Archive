#  GLITCH in the Archive

> Every document looks authentic.
> One of them is lying.
> Find the glitch before history is rewritten.

![banner](docs/banner.png)

---

##  Play

Every day you receive an archival case containing multiple historical documents.

Only **one statement** has been corrupted.

Your job isn't to memorize history—
it's to investigate it.

Compare evidence, examine contradictions, build deductions, and accuse the correct document before submitting your verdict.

No AI.
No randomness.
Only logic.

---

#  Features

##  Evidence Board

Collect clues while reading.

- Pin suspicious facts
- Compare documents
- Organize evidence visually
- Track contradictions

---

##  Deduction Notebook

Instead of simply guessing, players build a logical case.

Write:

- Observations
- Contradictions
- Supporting evidence
- Final reasoning

Your notebook becomes part of the investigation.

---

##  Suspicion System

Each document has a suspicion meter.

Increase or decrease suspicion while investigating until you're confident enough to accuse.

No hidden probabilities—
only your reasoning.

---

##  Document Investigation

Every case contains multiple archival documents.

Examples include:

- Newspaper articles
- Government reports
- Personal letters
- Military dispatches
- Historical records

Exactly **one** document contains the corruption.

---

##  Deterministic Engine

The game is entirely deterministic.

A verified historical database acts as the source of truth.

The engine automatically decides:

- today's historical event
- corrupted document
- corrupted fact
- corruption type
- difficulty

Every player receives the exact same daily investigation.

---

##  Progression

Players unlock ranks by maintaining investigation streaks.

Example ladder:

```
Clerk
Researcher
Archivist
Investigator
Senior Investigator
Chief Archivist
The Adversary
```

---

##  Statistics

The game tracks:

- Win rate
- Accuracy
- Investigation streak
- Best streak
- Cases solved
- Daily history

Stored locally in the browser.

No account required.

---

#  Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- LocalStorage

No backend.

No database.

No API keys.

---

#  Getting Started

Clone the repository.

```bash
git clone https://github.com/EimanW/Glitch-in-the-Archive.git

cd Glitch-in-the-Archive

npm install

npm run dev
```

Production build:

```bash
npm run build
```

---

#  Project Structure

```
src/
│
├── components/
│   ├── DocumentCard
│   ├── EvidenceBoard
│   ├── SuspicionSliders
│   ├── DeductionNotebook
│   └── DeductionForm
│
├── data/
│   └── historical events
│
├── lib/
│   ├── engine
│   ├── stats
│   ├── sharecard
│   └── types
│
└── pages/
    └── Play
```

---

#  How It Works

1. A historical event is selected.
2. The engine corrupts exactly one fact.
3. Documents are generated.
4. Players investigate.
5. Evidence is collected.
6. Suspicion is assigned.
7. A deduction is written.
8. A final accusation is submitted.
9. The reveal explains the corruption.

Every solved case teaches a real historical fact.

---

#  Philosophy

GLITCH in the Archive explores a simple question:

> **Can misinformation look completely trustworthy?**

Rather than telling players what is true, the game asks them to discover it.

Critical thinking becomes the gameplay.

---

#  License

MIT

---

Made with ❤️ by **Eiman Wasim**
<img width="1241" height="1034" alt="Screenshot 2026-07-09 at 14 35 01" src="https://github.com/user-attachments/assets/981006fa-db0a-4aa9-88fe-ad649073a106" />
<img width="1238" height="1024" alt="Screenshot 2026-07-09 at 14 35 10" src="https://github.com/user-attachments/assets/1f968676-43fc-4dda-9078-70eee6628b8b" />
