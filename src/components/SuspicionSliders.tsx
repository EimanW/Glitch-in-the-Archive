import type { SuspicionState } from '../lib/types';

interface Props {
  suspicion: SuspicionState;
  onChange: (s: SuspicionState) => void;
  disabled: boolean;
}

export default function SuspicionSliders({ suspicion, onChange, disabled }: Props) {
  const total = suspicion[0] + suspicion[1] + suspicion[2];
  const is100 = total === 100;

  function update(index: number, val: number) {
    const next = [...suspicion] as SuspicionState;
    next[index] = val;
    onChange(next);
  }

  return (
    <section className="my-8 rounded-sm border border-zinc-800 p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-mono text-sm tracking-[0.2em] text-zinc-400">PROBABILITY ASSESSMENT</h2>
        <span className={`font-mono text-sm ${is100 ? 'text-zinc-300' : 'text-red-500'}`}>
          TOTAL: {total}% {is100 ? '✓' : '(Must equal 100%)'}
        </span>
      </div>

      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-24 font-mono text-xs tracking-widest text-zinc-500">DOC {String.fromCharCode(65 + i)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={suspicion[i]}
              disabled={disabled}
              onChange={(e) => update(i, parseInt(e.target.value, 10))}
              className="flex-1 accent-zinc-500"
            />
            <span className="w-12 text-right font-mono text-sm text-zinc-300">{suspicion[i]}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
