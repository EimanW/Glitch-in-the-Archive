import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { caseForDay, todayDayIndex, FIELD_LABEL } from '../lib/engine';
import { loadStats, recordResult, solveRate, type Stats } from '../lib/stats';
import { rankFor, pointsFor } from '../data/ranks';
import { FAIL_TAUNTS, WIN_TAUNTS, STREAK_TAUNTS, EXACT_BONUS_LINES, pickTaunt } from '../data/taunts';
import { downloadShareCard } from '../lib/sharecard';
import DocumentCard, { type Phase } from '../components/DocumentCard';

export default function Play() {
  const [params] = useSearchParams();
  const today = todayDayIndex();
  const requested = params.get('day');
  const dayIndex = requested !== null ? Math.max(0, Math.min(today, parseInt(requested, 10) || 0)) : today;
  const practice = dayIndex !== today;

  const dailyCase = useMemo(() => caseForDay(dayIndex), [dayIndex]);
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const alreadyPlayed = !practice && !!stats.results[dayIndex];

  const [phase, setPhase] = useState<Phase>(alreadyPlayed ? 'reveal' : 'pick-doc');
  const [pickedDoc, setPickedDoc] = useState<number | null>(alreadyPlayed ? stats.results[dayIndex].picked : null);
  const [pickedSentence, setPickedSentence] = useState<number | null>(null);

  const result = !practice ? stats.results[dayIndex] : undefined;
  const correct = result ? result.correct : pickedDoc === dailyCase.liarDoc;
  const exact = result ? result.exact : pickedSentence === dailyCase.lieSentence;

  function handlePickDoc(i: number) {
    setPickedDoc(i);
    if (i === dailyCase.liarDoc) {
      setPhase('pick-sentence');
    } else {
      finish(i, false, false);
    }
  }

  function handlePickSentence(si: number) {
    setPickedSentence(si);
    finish(pickedDoc!, true, si === dailyCase.lieSentence);
  }

  function finish(picked: number, wasCorrect: boolean, wasExact: boolean) {
    setPhase('reveal');
    if (!practice) {
      const score = wasCorrect ? (wasExact ? 150 : 100) : 0;
      setStats(recordResult(dayIndex, { picked, correct: wasCorrect, exact: wasExact, score }));
    }
  }

  const taunt = useMemo(() => {
    if (phase !== 'reveal') return '';
    const seed = dayIndex * 7 + (correct ? 3 : 1);
    if (correct && stats.streak >= 5 && !practice) return pickTaunt(STREAK_TAUNTS, Math.floor(stats.streak / 5) + dayIndex);
    return correct ? pickTaunt(WIN_TAUNTS, seed) : pickTaunt(FAIL_TAUNTS, seed);
  }, [phase, correct, dayIndex, stats.streak, practice]);

  const rank = rankFor(pointsFor(stats.wins, stats.exactWins, stats.bestStreak));

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24">
      {/* case header */}
      <section className="py-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-silver">
          {practice ? 'From the archive · practice — no streak at stake' : dailyCase.dateISO + ' · one new case daily at 00:00 UTC'}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
          CASE FILE #{dailyCase.caseNumber}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed">
          Three documents concerning <span className="text-ivory">{dailyCase.event.title}</span> have been recovered.
          The Archivist has corrupted <span className="text-blood">one</span>. Accuse the fabricated document.
        </p>
        {!practice && (
          <p className="mt-2 text-xs text-silver/70" data-testid="stats-line">
            Streak {stats.streak} · Best {stats.bestStreak} · Solve rate {solveRate(stats)}% · Rank: <span className="text-ivory">{rank.name}</span>
          </p>
        )}
      </section>

      {phase === 'pick-sentence' && (
        <p className="mb-6 border border-blood/60 bg-blood/10 p-3 text-center text-sm text-ivory" data-testid="bonus-prompt">
          Correct document. For the tribunal — <span className="text-blood">mark the exact fabricated sentence.</span> (+50)
        </p>
      )}

      <section className="grid gap-8 md:grid-cols-3 md:gap-6">
        {dailyCase.documents.map((doc, i) => (
          <DocumentCard
            key={i}
            doc={doc}
            index={i}
            phase={phase}
            pickedDoc={pickedDoc}
            pickedSentence={pickedSentence}
            liarDoc={dailyCase.liarDoc}
            lieSentence={dailyCase.lieSentence}
            onPickDoc={handlePickDoc}
            onPickSentence={handlePickSentence}
          />
        ))}
      </section>

      {phase === 'reveal' && (
        <section className="mx-auto mt-12 max-w-2xl text-center" data-testid="reveal-panel">
          <h2 className={`font-heading text-3xl font-bold ${correct ? 'text-blood' : 'text-silver'}`}>
            {alreadyPlayed && !practice ? 'CASE ALREADY FILED' : correct ? (exact ? 'SOLVED — LINE PERFECT' : 'CASE SOLVED') : 'DECEIVED'}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-ivory">
            The fabrication corrupted <span className="text-blood">{FIELD_LABEL[dailyCase.corruptedField]}</span>: the document claimed{' '}
            <span className="text-blood">{dailyCase.falseValueText}</span> — in truth, <span className="text-ivory underline decoration-blood decoration-2 underline-offset-4">{dailyCase.trueValueText}</span>.
          </p>
          {correct && exact && (
            <p className="mt-2 text-xs text-blood">{pickTaunt(EXACT_BONUS_LINES, dayIndex)}</p>
          )}

          {/* the Archivist's note */}
          <figure className="mx-auto mt-8 max-w-md -rotate-1 border border-blood/40 bg-void p-5 shadow-[0_0_30px_rgba(179,0,27,0.15)]">
            <blockquote className="font-heading text-lg italic text-ivory">“{taunt}”</blockquote>
            <figcaption className="mt-2 font-blackletter text-blood">— The Archivist</figcaption>
          </figure>

          {!practice && (
            <p className="mt-6 text-sm" data-testid="score-line">
              Score: <span className="text-ivory">{result?.score ?? 0}</span> · Streak: <span className="text-ivory">{stats.streak}</span> · Rank: <span className="text-blood">{rank.name}</span>
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!practice && (
              <button
                onClick={() => downloadShareCard(dailyCase.caseNumber, correct, exact, stats)}
                className="border border-blood px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-blood transition-colors hover:bg-blood hover:text-ivory"
                data-testid="share-button"
              >
                Download result card
              </button>
            )}
            {dayIndex > 0 && (
              <Link
                to={`/?day=${dayIndex - 1}`}
                className="border border-silver/40 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-silver transition-colors hover:border-ivory hover:text-ivory"
                data-testid="yesterday-button"
              >
                Play yesterday's case
              </Link>
            )}
            <Link
              to="/archive"
              className="border border-silver/40 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-silver transition-colors hover:border-ivory hover:text-ivory"
            >
              Open the archive
            </Link>
          </div>

          {practice && (
            <p className="mt-6 text-xs text-silver/60">
              Practice case — nothing was recorded.{' '}
              <Link to="/" className="text-blood underline underline-offset-2">Return to today's case.</Link>
            </p>
          )}
        </section>
      )}
    </main>
  );
}
