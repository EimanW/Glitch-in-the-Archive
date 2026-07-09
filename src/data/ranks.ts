export interface Rank { name: string; minPoints: number; }

/** points = wins*10 + exactWins*5 + bestStreak*15 */
export const RANKS: Rank[] = [
  { name: 'Police Recruit', minPoints: 0 },
  { name: 'Junior Investigator', minPoints: 40 },
  { name: 'Archive Analyst', minPoints: 100 },
  { name: 'Detective', minPoints: 200 },
  { name: 'Chief Inspector', minPoints: 350 },
  { name: 'Profiler', minPoints: 550 },
  { name: 'Successor Candidate', minPoints: 800 },
  { name: 'Master Detective', minPoints: 1200 },
];

export function pointsFor(wins: number, exactWins: number, bestStreak: number): number {
  return wins * 10 + exactWins * 5 + bestStreak * 15;
}

export function rankFor(points: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (points >= rank.minPoints) r = rank;
  return r;
}
