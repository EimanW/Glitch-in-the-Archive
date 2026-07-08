import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24">
      <section className="py-10">
        <h1 className="text-center font-heading text-4xl font-bold tracking-tight text-ivory">How It Works</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed">
          <p>
            Every day at 00:00 UTC, <span className="font-blackletter text-blood">The Archivist</span> corrupts the
            historical record: one real, well-documented event, told across three recovered documents. Two are accurate.
            One carries a single planted lie — a shifted date, a swapped name, an inflated figure, a false outcome.
            Your task is to accuse the fabricated document, then mark the exact forged sentence.
          </p>
          <p className="text-ivory">
            Each document covers different facts of the event. There is nothing to cross-reference — the only
            instrument that works here is your own sense that something is off. That is deliberate.
          </p>
          <h2 className="pt-2 font-heading text-2xl font-bold text-ivory">The machine behind the villain</h2>
          <p>
            The lie is never improvised. A deterministic engine derives everything from the calendar date — which event,
            which document lies, which fact is corrupted, and by how much. Early in the week the forgeries are loud
            (a date shifted by decades); by Sunday they are surgical (a date off by two years, a plausible name swap).
            Everyone in the world faces the same case, and the truth behind every claim traces back to a verified fact
            sheet. The reveal always shows you exactly what was changed, so a lost case still teaches a true thing.
          </p>
          <h2 className="pt-2 font-heading text-2xl font-bold text-ivory">Why this game exists</h2>
          <p>
            Confident, plausible falsehoods are cheap to produce now. The skill of noticing them — reading closely,
            distrusting fluency, checking the figure that feels slightly wrong — is trainable. This game trains
            exactly that, one forged document at a time. The Archivist, fittingly, is an algorithm.
          </p>
          <h2 className="pt-2 font-heading text-2xl font-bold text-ivory">Scoring and rank</h2>
          <p>
            Correct document: 100 points. Exact sentence: +50. Daily wins build your streak; streaks and precision
            raise your Deduction Rank across ten grades, from <span className="text-ivory">Clerk</span> to{' '}
            <span className="text-blood">THE ADVERSARY</span> — the only rank The Archivist fears. Progress lives in
            your browser. No accounts, no tracking.
          </p>
        </div>

        <p className="mt-10 text-center">
          <Link to="/" className="border border-blood px-6 py-3 text-xs uppercase tracking-[0.2em] text-blood transition-colors hover:bg-blood hover:text-ivory">
            Open today's case
          </Link>
        </p>
      </section>
    </main>
  );
}
