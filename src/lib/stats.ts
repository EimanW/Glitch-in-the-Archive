export interface CaseResult {
  picked: number;
  correct: boolean;
  exact: boolean;
  score: number;
  confidence: number;
  reasoningCorrect: boolean;
  openedEvidenceCount: number;
}

export interface Stats {
  plays: number;
  wins: number;
  exactWins: number;
  streak: number;
  bestStreak: number;
  lastPlayedDay: number; // -999 = never
  results: Record<number, CaseResult>;
  archivistPatterns: Record<string, number>;
}

const KEY = 'gita_stats_v2';
const LEGACY_KEY = 'gita_stats_v1';

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { archivistPatterns: {}, results: {}, ...JSON.parse(raw) };
    
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      // Migrate legacy stats but ensure we have the new fields
      return { 
        plays: parsed.plays || 0,
        wins: parsed.wins || 0,
        exactWins: parsed.exactWins || 0,
        streak: parsed.streak || 0,
        bestStreak: parsed.bestStreak || 0,
        lastPlayedDay: parsed.lastPlayedDay ?? -999,
        results: {}, // Clear past results as the shape changed significantly
        archivistPatterns: {}
      };
    }
  } catch { /* ignore */ }
  return { plays: 0, wins: 0, exactWins: 0, streak: 0, bestStreak: 0, lastPlayedDay: -999, results: {}, archivistPatterns: {} };
}

export function recordResult(dayIndex: number, result: CaseResult, corruptedField?: string): Stats {
  const s = loadStats();
  if (s.results[dayIndex]) return s; // already played this day
  s.results[dayIndex] = result;
  s.plays += 1;
  
  if (corruptedField) {
    s.archivistPatterns[corruptedField] = (s.archivistPatterns[corruptedField] || 0) + 1;
  }

  if (result.correct) {
    s.wins += 1;
    if (result.exact) s.exactWins += 1;
    s.streak = s.lastPlayedDay === dayIndex - 1 || s.streak === 0 ? s.streak + 1 : 1;
    if (s.lastPlayedDay !== dayIndex - 1 && s.lastPlayedDay !== -999) s.streak = 1;
    if (s.streak > s.bestStreak) s.bestStreak = s.streak;
  } else {
    s.streak = 0;
  }
  s.lastPlayedDay = dayIndex;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  return s;
}

export function solveRate(s: Stats): number {
  return s.plays === 0 ? 0 : Math.round((s.wins / s.plays) * 100);
}
