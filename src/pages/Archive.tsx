import { Link } from 'react-router-dom';
import { todayDayIndex } from '../lib/engine';
import { loadStats } from '../lib/stats';

export default function Archive() {
  const today = todayDayIndex();
  const stats = loadStats();
  const days = Array.from({ length: today + 1 }, (_, i) => today - i);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24">
      <section className="py-10 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-ivory">The Archive</h1>
        <p className="mt-3 text-sm text-silver">
          Every case The Archivist has ever forged. Past cases are practice — streaks are earned only on the daily case.
        </p>
      </section>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {days.map((d) => {
          const r = stats.results[d];
          const status = r ? (r.correct ? (r.exact ? 'LINE PERFECT' : 'SOLVED') : 'DECEIVED') : d === today ? 'OPEN' : 'UNTOUCHED';
          const color = r ? (r.correct ? 'text-blood border-blood/60' : 'text-silver border-silver/40') : 'text-silver/70 border-silver/25';
          return (
            <li key={d}>
              <Link
                to={d === today ? '/' : `/?day=${d}`}
                className={`block border ${color} bg-void p-4 text-center transition-colors hover:border-ivory hover:text-ivory`}
                data-testid={`archive-case-${d}`}
              >
                <span className="font-heading text-2xl font-bold">#{d + 1}</span>
                <span className="mt-1 block text-[10px] tracking-[0.2em]">{status}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
