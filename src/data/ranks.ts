export interface Rank { name: string; minPoints: number; }

/** points = wins*10 + exactWins*5 + bestStreak*15 */
export const RANKS: Rank[] = [
  { name: 'Clerk', minPoints: 0 },
  { name: "Archivist's Fool", minPoints: 20 },
  { name: 'Apprentice Examiner', minPoints: 50 },
  { name: 'Records Analyst', minPoints: 100 },
  { name: 'Junior Investigator', minPoints: 170 },
  { name: 'Forgery Examiner', minPoints: 260 },
  { name: 'Senior Investigator', minPoints: 380 },
  { name: 'Master Detective', minPoints: 540 },
  { name: 'Keeper of the Record', minPoints: 750 },
  { name: 'THE ADVERSARY', minPoints: 1000 },
];

export function pointsFor(wins: number, exactWins: number, bestStreak: number): number {
  return wins * 10 + exactWins * 5 + bestStreak * 15;
}

export function rankFor(points: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (points >= rank.minPoints) r = rank;
  return r;
}
