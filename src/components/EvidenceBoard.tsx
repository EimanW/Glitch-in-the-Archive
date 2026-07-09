import { useState } from 'react';
import type { EvidenceCard } from '../lib/types';

interface Props {
  evidence: EvidenceCard[];
  onOpenCard: () => void;
  openedCount: number;
}

export default function EvidenceBoard({ evidence, onOpenCard, openedCount }: Props) {
  const [opened, setOpened] = useState<Set<string>>(new Set());

  function handleOpen(id: string) {
    if (!opened.has(id)) {
      const next = new Set(opened);
      next.add(id);
      setOpened(next);
      onOpenCard();
    }
  }

  return (
    <section className="my-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-sm tracking-[0.2em] text-zinc-400">EVIDENCE BOARD</h2>
        <span className="text-xs text-zinc-500">
          ({openedCount} / {evidence.length} opened — penalty applied per card)
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {evidence.map((card) => {
          const isOpen = opened.has(card.id);
          return (
            <div
              key={card.id}
              className={`relative border p-4 transition-colors ${isOpen ? 'border-zinc-700 bg-zinc-900' : 'cursor-pointer border-zinc-800 bg-zinc-950 hover:border-zinc-600'}`}
              onClick={() => handleOpen(card.id)}
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">{card.label}</h3>
              {isOpen ? (
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{card.content}</p>
              ) : (
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-[10px] tracking-widest text-zinc-600">[ CLASSIFIED ]</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
