import { useState } from 'react';
import type { ConfidenceLevel, ReasoningType } from '../lib/types';

interface Props {
  onLock: (reasoning: ReasoningType, confidence: ConfidenceLevel) => void;
  isReady: boolean;
  disabled: boolean;
}

const REASONS: { val: ReasoningType; label: string }[] = [
  { val: 'timeline_mismatch', label: 'Timeline mismatch (Dates do not align)' },
  { val: 'wrong_historical_figure', label: 'Wrong historical figure (Identity incorrect)' },
  { val: 'wrong_location', label: 'Wrong location (Geographic impossibility)' },
  { val: 'suspicious_number', label: 'Suspicious number (Statistics exaggerated/minimized)' },
  { val: 'motive_does_not_fit', label: 'Motive does not fit (Stated outcome contradicts history)' },
  { val: 'other_inconsistency', label: 'Other archival inconsistency' },
];

const CONFIDENCE: ConfidenceLevel[] = [40, 60, 75, 90, 100];

export default function DeductionForm({ onLock, isReady, disabled }: Props) {
  const [reasoning, setReasoning] = useState<ReasoningType>('timeline_mismatch');
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (confidence) onLock(reasoning, confidence);
  }

  return (
    <form onSubmit={handleSubmit} className="my-8 rounded-sm border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="mb-6 font-mono text-sm tracking-[0.2em] text-zinc-400">FINAL DEDUCTION</h2>
      
      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">Method of Forgery</label>
          <select
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value as ReasoningType)}
            disabled={disabled}
            className="w-full rounded-sm border border-zinc-800 bg-zinc-900 p-3 font-mono text-sm text-zinc-300 focus:border-zinc-500 focus:outline-none"
          >
            {REASONS.map((r) => (
              <option key={r.val} value={r.val}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-zinc-500">Confidence Lock</label>
          <div className="flex flex-wrap gap-3">
            {CONFIDENCE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setConfidence(c)}
                disabled={disabled}
                className={`flex-1 border px-4 py-3 font-mono text-sm transition-colors ${
                  confidence === c 
                    ? 'border-zinc-300 bg-zinc-300 text-zinc-900' 
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {c}%
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || !isReady || !confidence}
          className="w-full border p-4 font-mono text-sm uppercase tracking-widest transition-colors disabled:opacity-50 disabled:bg-transparent disabled:border-zinc-800 border-red-900/50 bg-red-900/20 text-red-500 hover:bg-red-900/40"
        >
          {disabled ? 'LOCKED' : 'SUBMIT ACCUSATION'}
        </button>
      </div>
    </form>
  );
}
