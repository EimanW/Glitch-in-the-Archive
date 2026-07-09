import { EVENTS } from '../data/events';
import type { DailyCase, FactField, HistoricalEvent, Sentence, CaseDocument, EvidenceCard, ReasoningType } from './types';

/** The archive opened on this UTC date. Case #1. */
export const EPOCH_ISO = '2026-07-08';

const DAY_MS = 86400000;

/* ---------------- seeded PRNG (mulberry32) ---------------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- date helpers (all UTC) ---------------- */
export function todayUTCISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dayIndexFor(dateISO: string): number {
  const epoch = Date.parse(EPOCH_ISO + 'T00:00:00Z');
  const d = Date.parse(dateISO + 'T00:00:00Z');
  return Math.floor((d - epoch) / DAY_MS);
}

export function isoForDayIndex(dayIndex: number): string {
  const epoch = Date.parse(EPOCH_ISO + 'T00:00:00Z');
  return new Date(epoch + dayIndex * DAY_MS).toISOString().slice(0, 10);
}

export function todayDayIndex(): number {
  return dayIndexFor(todayUTCISO());
}

/* ---------------- formatting ---------------- */
function fmtYear(y: number): string {
  return y < 0 ? `${-y} BCE` : `${y}`;
}

function stripParens(s: string): string {
  return s.replace(/\s*\([^)]*\)/g, '');
}

function fmtNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------------- corruption ---------------- */
// difficulty 0..6 derived from UTC weekday: Mon easiest -> Sun hardest
function difficultyFor(dateISO: string): number {
  const dow = new Date(dateISO + 'T00:00:00Z').getUTCDay(); // 0 Sun .. 6 Sat
  return dow === 0 ? 6 : dow - 1; // Mon=0 ... Sat=5, Sun=6
}

const YEAR_DELTAS = [28, 22, 16, 11, 7, 4, 2];
const NUM_FACTORS = [3.5, 3, 2.5, 2, 1.6, 1.35, 1.2];
// field pools per difficulty: easy days use loud fields, hard days use subtle swaps
const FIELD_POOLS: FactField[][] = [
  ['year', 'number', 'outcome'],
  ['year', 'number', 'outcome'],
  ['year', 'number', 'outcome', 'location'],
  ['year', 'number', 'location', 'person'],
  ['number', 'location', 'person', 'outcome'],
  ['year', 'person', 'location'],
  ['year', 'person', 'number'],
];

function corruptYear(ev: HistoricalEvent, difficulty: number, rng: () => number): { falseVal: string; trueVal: string; falseYear: number } {
  let delta = YEAR_DELTAS[difficulty];
  if (ev.year < 0) delta *= 10; // ancient dates need bigger shifts to matter
  const sign = rng() < 0.5 ? -1 : 1;
  const falseYear = ev.year + sign * delta;
  return { falseVal: fmtYear(falseYear), trueVal: fmtYear(ev.year), falseYear };
}

function niceRound(n: number): number {
  if (n >= 1000) return Math.round(n / 100) * 100;
  if (n >= 100) return Math.round(n / 10) * 10;
  return Math.max(1, Math.round(n));
}

function corruptNumber(ev: HistoricalEvent, difficulty: number, rng: () => number): { falseVal: string; trueVal: string } {
  const factor = NUM_FACTORS[difficulty];
  const up = rng() < 0.5;
  const falseNum = niceRound(up ? ev.number * factor : ev.number / factor);
  const safeFalse = falseNum === ev.number ? ev.number + Math.max(1, Math.round(ev.number * 0.5)) : falseNum;
  return { falseVal: fmtNumber(safeFalse), trueVal: fmtNumber(ev.number) };
}

/* ---------------- sentence builders ----------------
   Three archival voices. Each fact field renders differently per voice.
   The corrupted field simply receives the false value — same template,
   equally confident. That is the entire deception.                    */

type ValueBag = {
  year: string;
  person: string;
  location: string;
  number: string;
  outcome: string;
  detail: string;
};

function buildValues(ev: HistoricalEvent): ValueBag {
  return {
    year: fmtYear(ev.year),
    person: ev.person,
    location: ev.location,
    number: fmtNumber(ev.number),
    outcome: ev.outcome,
    detail: ev.detail,
  };
}

const VOICES = ['REGISTRY ENTRY', 'RECOVERED CORRESPONDENCE', "CURATOR'S NOTE"] as const;

function sentenceFor(voiceIdx: number, field: FactField, ev: HistoricalEvent, v: ValueBag): string {
  const yearEvent = stripParens(ev.year_event);
  const numUnit = ev.number_unit ? ` ${ev.number_unit}` : '';
  switch (voiceIdx) {
    case 0: // registry / encyclopedia
      switch (field) {
        case 'year': return `The registry places the moment in ${v.year}, when ${yearEvent}.`;
        case 'person': return `The record credits ${v.person}, ${ev.person_role}, as the central figure of the affair.`;
        case 'location': return `The events unfolded at ${v.location}.`;
        case 'number': return `Filed measurements state that ${ev.number_desc} ${v.number}${numUnit}.`;
        case 'outcome': return `In consequence, ${v.outcome}.`;
        case 'detail': return `A marginal note adds that ${v.detail}.`;
      }
      break;
    case 1: // correspondence / letter
      switch (field) {
        case 'year': return `You will recall that it was in ${v.year} that ${yearEvent} — I was assured of the date by those who kept the ledgers.`;
        case 'person': return `All accounts I have gathered name ${v.person}, the ${ev.person_role}, at the heart of it.`;
        case 'location': return `My correspondent writes from ${v.location}, where it all took place.`;
        case 'number': return `They insist, and I have no cause to doubt them, that ${ev.number_desc} ${v.number}${numUnit}.`;
        case 'outcome': return `And so it came to pass that ${v.outcome} — or so every witness swears.`;
        case 'detail': return `One further curiosity: ${v.detail}.`;
      }
      break;
    default: // curator's note
      switch (field) {
        case 'year': return `Dating of the artefacts is settled: ${yearEvent} in ${v.year}.`;
        case 'person': return `Attribution is uncontested — ${v.person}, ${ev.person_role}.`;
        case 'location': return `Provenance traces cleanly to ${v.location}.`;
        case 'number': return `Our catalogue records that ${ev.number_desc} ${v.number}${numUnit}.`;
        case 'outcome': return `The exhibit label reads: ${cap(v.outcome)}.`;
        case 'detail': return `Visitors are often surprised to learn that ${v.detail}.`;
      }
  }
  return '';
}

function introFor(voiceIdx: number, ev: HistoricalEvent): string {
  switch (voiceIdx) {
    case 0: return `File under ${ev.era}, ${ev.region} — concerning ${ev.title.toLowerCase().startsWith('the ') ? ev.title.charAt(0).toLowerCase() + ev.title.slice(1) : ev.title}.`;
    case 1: return `My dear colleague — you asked what I know of ${ev.title.toLowerCase().startsWith('the ') ? ev.title.charAt(0).toLowerCase() + ev.title.slice(1) : ev.title}. Here is the whole of it.`;
    default: return `From the permanent collection: ${ev.title}.`;
  }
}

function outroFor(voiceIdx: number): string {
  switch (voiceIdx) {
    case 0: return 'The file is considered closed.';
    case 1: return 'I set it down here exactly as it was told to me.';
    default: return 'The accompanying documents are held in the archive.';
  }
}

/* ---------------- case assembly ---------------- */
const ALL_FIELDS: FactField[] = ['year', 'person', 'location', 'number', 'outcome', 'detail'];

function shuffled<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function caseForDay(dayIndex: number): DailyCase {
  const dateISO = isoForDayIndex(dayIndex);
  const difficulty = difficultyFor(dateISO);
  const event = EVENTS[((dayIndex % EVENTS.length) * 37 + Math.floor(dayIndex / EVENTS.length) * 13) % EVENTS.length];
  const rng = mulberry32((dayIndex + 1) * 2654435761 + 97);

  // choose the corrupted field from the difficulty pool (never 'detail' — details are the humanizing truths)
  const pool = FIELD_POOLS[difficulty];
  const corruptedField = pool[Math.floor(rng() * pool.length)];

  // compute false + true display values
  let falseValueText = '';
  let trueValueText = '';
  const values = buildValues(event);
  const falseValues = { ...values };
  if (corruptedField === 'year') {
    const c = corruptYear(event, difficulty, rng);
    falseValues.year = c.falseVal; falseValueText = c.falseVal; trueValueText = c.trueVal;
  } else if (corruptedField === 'number') {
    const c = corruptNumber(event, difficulty, rng);
    falseValues.number = c.falseVal; falseValueText = `${c.falseVal}${event.number_unit ? ' ' + event.number_unit : ''}`; trueValueText = `${c.trueVal}${event.number_unit ? ' ' + event.number_unit : ''}`;
  } else if (corruptedField === 'person') {
    falseValues.person = event.false_person; falseValueText = event.false_person; trueValueText = event.person;
  } else if (corruptedField === 'location') {
    falseValues.location = event.false_location; falseValueText = event.false_location; trueValueText = event.location;
  } else {
    falseValues.outcome = event.false_outcome; falseValueText = event.false_outcome; trueValueText = event.outcome;
  }

  // split the six facts across three documents, two each, no overlap.
  const liarDoc = Math.floor(rng() * 3);
  const rest = shuffled(ALL_FIELDS.filter((f) => f !== corruptedField), rng);
  const liarPartner = rest[0];
  const remaining = rest.slice(1); // 4 fields
  const docFields: FactField[][] = [[], [], []];
  docFields[liarDoc] = shuffled([corruptedField, liarPartner], rng);
  const others = [0, 1, 2].filter((i) => i !== liarDoc);
  docFields[others[0]] = [remaining[0], remaining[1]];
  docFields[others[1]] = [remaining[2], remaining[3]];

  // voices are shuffled per day so the liar isn't always the same voice
  const voiceOrder = shuffled([0, 1, 2], rng);

  let lieSentence = -1;
  const documents: CaseDocument[] = [0, 1, 2].map((docIdx) => {
    const vIdx = voiceOrder[docIdx];
    const bag = docIdx === liarDoc ? falseValues : values;
    const sentences: Sentence[] = [{ text: introFor(vIdx, event), field: 'flavor' }];
    docFields[docIdx].forEach((f) => {
      sentences.push({ text: sentenceFor(vIdx, f, event, bag), field: f });
    });
    sentences.push({ text: outroFor(vIdx), field: 'flavor' });
    if (docIdx === liarDoc) {
      lieSentence = sentences.findIndex((s) => s.field === corruptedField);
    }
    return { voice: VOICES[vIdx], sentences };
  });

  // reasoning mapping
  let correctReasoning: ReasoningType = 'other_inconsistency';
  if (corruptedField === 'year') correctReasoning = 'timeline_mismatch';
  if (corruptedField === 'person') correctReasoning = 'wrong_historical_figure';
  if (corruptedField === 'location') correctReasoning = 'wrong_location';
  if (corruptedField === 'number') correctReasoning = 'suspicious_number';
  if (corruptedField === 'outcome') correctReasoning = 'motive_does_not_fit';

  // generate 3 evidence cards deterministically
  const evidenceTypes = shuffled(['timeline', 'witness', 'location', 'context', 'primary_source', 'contradiction'] as const, rng).slice(0, 3);
  
  const evidence: EvidenceCard[] = evidenceTypes.map((type, i) => {
    let label = '';
    let content = '';
    
    switch (type) {
      case 'timeline':
        label = 'Timeline Analysis';
        content = `Archival carbon dating places the core materials firmly in ${event.era}.`;
        break;
      case 'witness':
        label = 'Witness Testimony';
        content = `A recovered journal entry mentions the primary figure was associated with ${event.region}.`;
        break;
      case 'location':
        label = 'Geographic Survey';
        content = `Soil samples and routing maps confirm the general region is ${event.region}.`;
        break;
      case 'context':
        label = 'Historical Context';
        content = `Background research indicates: ${event.detail}.`;
        break;
      case 'primary_source':
        label = 'Primary Source Fragment';
        content = `A fragmented telegram reads: "...${event.outcome.slice(0, 15)}..."`;
        break;
      case 'contradiction':
        label = 'Archivist Pattern Warning';
        content = `Recent discrepancies detected in records concerning ${FIELD_LABEL[corruptedField]}.`;
        break;
    }

    return { id: `ev-${dayIndex}-${i}`, type, label, content };
  });

  // generate deterministic global stats
  const solveRate = Math.floor(12 + rng() * 60); // 12% to 72%
  const avgMins = Math.floor(2 + rng() * 6);
  const avgSecs = Math.floor(rng() * 60);
  const avgTimeStr = `${avgMins}m ${avgSecs}s`;
  const commonWrongDoc = others[Math.floor(rng() * others.length)];

  return {
    dayIndex,
    caseNumber: dayIndex + 1,
    dateISO,
    event,
    documents,
    liarDoc,
    lieSentence,
    corruptedField,
    falseValueText,
    trueValueText,
    difficulty,
    evidence,
    correctReasoning,
    globalStats: {
      solveRate,
      avgTimeStr,
      commonWrongDoc
    }
  };
}

export const FIELD_LABEL: Record<FactField, string> = {
  year: 'the date',
  person: 'the name',
  location: 'the place',
  number: 'the figure',
  outcome: 'the outcome',
  detail: 'the detail',
};
