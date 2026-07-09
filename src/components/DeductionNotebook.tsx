import { FIELD_LABEL } from '../lib/engine';

interface Props {
  patterns: Record<string, number>;
}

export default function DeductionNotebook({ patterns }: Props) {
  const entries = Object.entries(patterns).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [_, count]) => sum + count, 0);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-zinc-800 pt-8">
      <h3 className="font-mono text-sm tracking-[0.2em] text-zinc-400">THE ARCHIVIST'S PATTERNS</h3>
      <p className="mt-2 text-xs text-zinc-500">Based on your past deductions, the Archivist favors altering:</p>
      
      <ul className="mt-4 space-y-2">
        {entries.map(([field, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <li key={field} className="flex items-center gap-4 text-sm text-zinc-300">
              <span className="w-12 text-right font-mono text-zinc-500">{pct}%</span>
              <div className="h-1 flex-1 bg-zinc-900">
                <div className="h-full bg-zinc-600" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-32 truncate text-xs uppercase tracking-wider">{FIELD_LABEL[field as keyof typeof FIELD_LABEL] || field}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
