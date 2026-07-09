import type { CaseDocument } from '../lib/types';

export type Phase = 'investigation' | 'deduction' | 'resolution';

interface Props {
  doc: CaseDocument;
  index: number;
  phase: Phase;
  pickedDoc: number | null;
  pickedSentences: (number | null)[];
  liarDoc: number;
  lieSentence: number;
  onPickDoc: (i: number) => void;
  onPickSentence: (docIndex: number, sentenceIndex: number) => void;
}

const TILTS = ['-0.6deg', '0.5deg', '-0.3deg'];

export default function DocumentCard({
  doc, index, phase, pickedDoc, pickedSentences, liarDoc, lieSentence, onPickDoc, onPickSentence,
}: Props) {
  const isPicked = pickedDoc === index;
  const isLiar = index === liarDoc;
  const revealing = phase === 'resolution';
  
  // investigation phase allows interacting with doc
  const clickableDoc = phase === 'investigation';

  return (
    <div
      className={`relative ${revealing && isLiar ? 'shake' : ''}`}
      style={{ ['--tilt' as never]: TILTS[index], transform: `rotate(${TILTS[index]})` }}
    >
      {revealing && isLiar && (
        <div className="stamp font-mono text-3xl sm:text-4xl">FABRICATED</div>
      )}
      <article
        className={`paper relative p-6 sm:p-8 ${clickableDoc ? 'doc-hover cursor-pointer' : ''} ${isPicked && revealing ? 'doc-selected' : ''} ${revealing && !isLiar ? 'opacity-80' : ''}`}
        role={clickableDoc ? 'button' : undefined}
        tabIndex={clickableDoc ? 0 : undefined}
        aria-label={`Document ${index + 1}: ${doc.voice}`}
        onClick={() => clickableDoc && onPickDoc(index)}
        onKeyDown={(e) => clickableDoc && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPickDoc(index))}
        data-testid={`document-card-${index}`}
      >
        {/* file tab */}
        <div className="absolute -top-3 start-6 bg-[#d8cdb2] px-3 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[#4a4030] shadow-sm">
          EXHIBIT {String.fromCharCode(65 + index)}
        </div>
        {/* paperclip */}
        <div className="absolute -top-4 end-8 h-9 w-4 rounded-full border-2 border-[#8a8a92]/70 border-b-transparent" aria-hidden="true" />

        <h3 className="font-mono text-xs tracking-[0.25em] text-[#6b5d45]">{doc.voice}</h3>
        <div className="mt-3 space-y-2 font-mono text-[14px] leading-relaxed">
          {doc.sentences.map((s, si) => {
            const isLie = revealing && isLiar && si === lieSentence;
            const isHighlighted = pickedSentences[index] === si;
            const wasGuess = revealing && isHighlighted;
            
            // Allow picking sentences during investigation
            const pickable = phase === 'investigation';
            
            return (
              <p key={si}>
                <span
                  className={`${pickable ? 'sentence-pick' : ''} ${isLie ? 'ink-wrap font-bold' : ''} ${isHighlighted && !revealing ? 'bg-zinc-800/20 shadow-[0_1px_0_#4a4030]' : ''} ${wasGuess && !isLie ? 'line-through decoration-[#8a8a92]' : ''}`}
                  role={pickable ? 'button' : undefined}
                  tabIndex={pickable ? 0 : undefined}
                  onClick={(e) => {
                    if (pickable) {
                      e.stopPropagation();
                      onPickSentence(index, si);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (pickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      e.stopPropagation();
                      onPickSentence(index, si);
                    }
                  }}
                  data-testid={`sentence-${index}-${si}`}
                >
                  {s.text}
                  {isLie && (
                    <svg className="ink-svg" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <filter id="rough">
                          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="n" />
                          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
                        </filter>
                      </defs>
                      <path className="ink-path" pathLength={100} d="M8,15 C10,4 30,2 52,3 C76,4 96,7 95,15 C94,24 70,28 46,27 C22,26 6,23 8,16" />
                    </svg>
                  )}
                </span>
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
