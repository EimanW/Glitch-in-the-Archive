import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { caseForDay, todayDayIndex, FIELD_LABEL } from '../lib/engine';
import { loadStats, recordResult, solveRate, type Stats } from '../lib/stats';
import { rankFor, pointsFor } from '../data/ranks';
import { downloadShareCard } from '../lib/sharecard';

import DocumentCard, { type Phase } from '../components/DocumentCard';
import EvidenceBoard from '../components/EvidenceBoard';
import SuspicionSliders from '../components/SuspicionSliders';
import DeductionForm from '../components/DeductionForm';
import DeductionNotebook from '../components/DeductionNotebook';
import type { ConfidenceLevel, ReasoningType, SuspicionState } from '../lib/types';

export default function Play() {
  const [params] = useSearchParams();
  const today = todayDayIndex();
  const requested = params.get('day');
  const dayIndex = requested !== null ? Math.max(0, Math.min(today, parseInt(requested, 10) || 0)) : today;
  const practice = dayIndex !== today;

  const dailyCase = useMemo(() => caseForDay(dayIndex), [dayIndex]);
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const alreadyPlayed = !practice && !!stats.results[dayIndex];

  const result = !practice ? stats.results[dayIndex] : undefined;

  const [phase, setPhase] = useState<Phase>(alreadyPlayed ? 'resolution' : 'investigation');
  const [pickedDoc, setPickedDoc] = useState<number | null>(alreadyPlayed ? result!.picked : null);
  const [pickedSentences, setPickedSentences] = useState<(number | null)[]>([null, null, null]);
  const [suspicion, setSuspicion] = useState<SuspicionState>([33, 33, 34]);
  const [openedEvidenceCount, setOpenedEvidenceCount] = useState(alreadyPlayed ? result!.openedEvidenceCount : 0);

  function handlePickDoc(i: number) {
    if (phase !== 'investigation') return;
    setPickedDoc(i);
    setPhase('deduction');
  }

  function handlePickSentence(docIndex: number, sentenceIndex: number) {
    if (phase !== 'investigation') return;
    const next = [...pickedSentences];
    next[docIndex] = next[docIndex] === sentenceIndex ? null : sentenceIndex;
    setPickedSentences(next);
  }

  function handleLockDeduction(reasoning: ReasoningType, confidence: ConfidenceLevel) {
    if (pickedDoc === null) return;
    
    const correct = pickedDoc === dailyCase.liarDoc;
    const exact = pickedSentences[dailyCase.liarDoc] === dailyCase.lieSentence;
    const reasoningCorrect = reasoning === dailyCase.correctReasoning;
    
    let maxSusVal = -1;
    let highestSusDocs: number[] = [];
    suspicion.forEach((val, idx) => {
      if (val > maxSusVal) { maxSusVal = val; highestSusDocs = [idx]; }
      else if (val === maxSusVal) { highestSusDocs.push(idx); }
    });
    const highestSusCorrect = highestSusDocs.includes(dailyCase.liarDoc);

    let score = 0;
    if (correct) {
      let base = 100;
      if (exact) base += 50;
      if (reasoningCorrect) base += 50;
      if (highestSusCorrect) base += 50;
      base -= (openedEvidenceCount * 10);
      base = Math.max(0, base);

      let mult = 1.0;
      if (confidence === 40) mult = 0.5;
      else if (confidence === 60) mult = 0.8;
      else if (confidence === 75) mult = 1.0;
      else if (confidence === 90) mult = 1.2;
      else if (confidence === 100) mult = 1.5;

      score = Math.round(base * mult);
    } else {
      // Penalty for wrong with high confidence
      if (confidence === 40) score = -10;
      else if (confidence === 60) score = -20;
      else if (confidence === 75) score = -30;
      else if (confidence === 90) score = -50;
      else if (confidence === 100) score = -100;
      
      score -= (openedEvidenceCount * 10);
    }

    setPhase('resolution');
    if (!practice) {
      setStats(recordResult(dayIndex, { 
        picked: pickedDoc, 
        correct, 
        exact, 
        score,
        confidence,
        reasoningCorrect,
        openedEvidenceCount
      }, dailyCase.corruptedField));
    }
  }

  const isCorrect = result ? result.correct : pickedDoc === dailyCase.liarDoc;
  const isExact = result ? result.exact : pickedSentences[dailyCase.liarDoc] === dailyCase.lieSentence;
  const rank = rankFor(pointsFor(stats.wins, stats.exactWins, stats.bestStreak));

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24">
      {/* case header */}
      <section className="py-8 text-center border-b border-zinc-800 mb-8">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
          {practice ? 'ARCHIVE PRACTICE — NO STREAK' : `${dailyCase.dateISO} · ACTIVE INVESTIGATION`}
        </p>
        <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight text-zinc-200 sm:text-5xl">
          CASE FILE #{dailyCase.caseNumber}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
          Three historical documents concerning <span className="text-zinc-200">{dailyCase.event.title}</span> have been recovered.
          The Archivist has corrupted <span className="text-red-500 font-bold">one</span>. 
          Use evidence and logic to identify the fabrication.
        </p>
        {!practice && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-500">
            <span className="bg-zinc-900 px-3 py-1 rounded-sm">Streak: {stats.streak} (Best: {stats.bestStreak})</span>
            <span className="bg-zinc-900 px-3 py-1 rounded-sm">Solve Rate: {solveRate(stats)}%</span>
            <span className="bg-zinc-900 px-3 py-1 rounded-sm border border-zinc-700">Rank: <span className="text-zinc-300">{rank.name}</span></span>
          </div>
        )}
      </section>

      {phase !== 'resolution' && (
        <SuspicionSliders 
          suspicion={suspicion} 
          onChange={setSuspicion} 
          disabled={phase === 'deduction'} 
        />
      )}

      {phase !== 'resolution' && (
        <EvidenceBoard 
          evidence={dailyCase.evidence} 
          openedCount={openedEvidenceCount}
          onOpenCard={() => setOpenedEvidenceCount(c => c + 1)} 
        />
      )}

      <div className="mb-4 text-center">
        <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
          {phase === 'investigation' ? 'STEP 1: HIGHLIGHT CONTRADICTIONS & ACCUSE A DOCUMENT' : 
           phase === 'deduction' ? 'STEP 2: LOCK FINAL DEDUCTION' : 'CASE RESOLVED'}
        </p>
      </div>

      <section className="grid gap-8 md:grid-cols-3 md:gap-6">
        {dailyCase.documents.map((doc, i) => (
          <DocumentCard
            key={i}
            doc={doc}
            index={i}
            phase={phase}
            pickedDoc={pickedDoc}
            pickedSentences={pickedSentences}
            liarDoc={dailyCase.liarDoc}
            lieSentence={dailyCase.lieSentence}
            onPickDoc={handlePickDoc}
            onPickSentence={handlePickSentence}
          />
        ))}
      </section>

      {phase === 'deduction' && (
        <DeductionForm 
          onLock={handleLockDeduction}
          isReady={suspicion[0] + suspicion[1] + suspicion[2] === 100 && pickedDoc !== null}
          disabled={false}
        />
      )}

      {phase === 'resolution' && (
        <section className="mx-auto mt-12 max-w-2xl text-center">
          <div className={`border p-8 ${isCorrect ? 'border-zinc-700 bg-zinc-900/50' : 'border-red-900/50 bg-red-900/10'}`}>
            <h2 className={`font-mono text-3xl font-bold ${isCorrect ? 'text-zinc-200' : 'text-red-500'}`}>
              {alreadyPlayed && !practice ? 'CASE ALREADY ARCHIVED' : isCorrect ? (isExact ? 'SOLVED — PERFECT DEDUCTION' : 'CASE SOLVED') : 'DECEIVED'}
            </h2>

            <div className="mt-8 space-y-4 text-sm text-zinc-300 text-left">
              <p>
                <span className="font-bold text-zinc-500 font-mono w-24 inline-block">FORGERY:</span> 
                Exhibit {String.fromCharCode(65 + dailyCase.liarDoc)}
              </p>
              <p>
                <span className="font-bold text-zinc-500 font-mono w-24 inline-block">METHOD:</span> 
                Altered <span className="text-zinc-100">{FIELD_LABEL[dailyCase.corruptedField]}</span>.
              </p>
              <p>
                <span className="font-bold text-zinc-500 font-mono w-24 inline-block">CLAIM:</span> 
                The document claimed <span className="text-red-400">"{dailyCase.falseValueText}"</span>.
              </p>
              <p>
                <span className="font-bold text-zinc-500 font-mono w-24 inline-block">TRUTH:</span> 
                In reality, <span className="text-zinc-100 underline decoration-zinc-500 decoration-2 underline-offset-4">{dailyCase.trueValueText}</span>.
              </p>
            </div>

            {!practice && (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <p className="font-mono text-sm tracking-widest text-zinc-400">PERFORMANCE SUMMARY</p>
                <div className="mt-4 flex justify-center gap-8 font-mono text-2xl text-zinc-200">
                  <div className="text-center">
                    <div className="text-[10px] text-zinc-500 mb-1">SCORE</div>
                    <span className={result?.score && result.score > 0 ? 'text-green-500' : result?.score && result.score < 0 ? 'text-red-500' : ''}>
                      {result?.score ?? 0}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-zinc-500 mb-1">STREAK</div>
                    {stats.streak}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 border border-zinc-800 bg-zinc-950 p-6 text-left">
              <h3 className="font-mono text-xs tracking-widest text-zinc-500 mb-3">GLOBAL STATS (SIMULATED)</h3>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex justify-between"><span>Solve Rate:</span> <span>{dailyCase.globalStats.solveRate}%</span></li>
                <li className="flex justify-between"><span>Avg Time:</span> <span>{dailyCase.globalStats.avgTimeStr}</span></li>
                <li className="flex justify-between"><span>Most Common Trap:</span> <span>Doc {String.fromCharCode(65 + dailyCase.globalStats.commonWrongDoc)}</span></li>
              </ul>
            </div>
            
            <div className="flex-1 border border-zinc-800 bg-zinc-950 p-6 text-left">
              <h3 className="font-mono text-xs tracking-widest text-zinc-500 mb-3">HISTORICAL REALITY</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {dailyCase.event.detail} {dailyCase.event.outcome}
              </p>
            </div>
          </div>

          <DeductionNotebook patterns={stats.archivistPatterns || {}} />

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {!practice && (
              <button
                onClick={() => downloadShareCard(dailyCase.caseNumber, isCorrect, isExact, stats)}
                className="border border-zinc-700 px-5 py-3 text-xs font-mono uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:bg-zinc-800"
                data-testid="share-button"
              >
                Download Dossier
              </button>
            )}
            {dayIndex > 0 && (
              <Link
                to={`/?day=${dayIndex - 1}`}
                className="border border-zinc-800 px-5 py-3 text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                data-testid="yesterday-button"
              >
                Previous Case File
              </Link>
            )}
            <Link
              to="/archive"
              className="border border-zinc-800 px-5 py-3 text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
            >
              Open Archive
            </Link>
          </div>

          {practice && (
            <p className="mt-8 font-mono text-xs text-zinc-600">
              Practice case — nothing was recorded.{' '}
              <Link to="/" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-4">Return to today's case.</Link>
            </p>
          )}
        </section>
      )}
    </main>
  );
}
