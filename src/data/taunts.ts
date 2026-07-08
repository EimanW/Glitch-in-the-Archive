/** The Archivist's notes. Selected deterministically by day + result + streak. */

export const FAIL_TAUNTS = [
  'You circled the truth and called it a lie. Exquisite.',
  'The forgery sat in plain view. You shook its hand.',
  'History thanks you for your credulity.',
  'I barely tried with that one. Noted.',
  'Another reader who believes whatever is written neatly.',
  'Do you know what your error becomes, in a hundred years? Fact.',
  'The ink was not even dry. Still you signed for it.',
  'Confidence is my favourite disguise. You keep proving why.',
  'Wrong document. Wrong instinct. Right audience — me.',
  'I shall make tomorrow gentler. You clearly need it.',
];

export const WIN_TAUNTS = [
  'Correct. A coin lands well sometimes.',
  'You found it. I left it loud on purpose. Probably.',
  'One forgery caught. Thousands remain. Sleep well.',
  'Adequate. The next one will not be.',
  'You read closely today. How unusual for your species.',
  'Noted: this one checks the figures. Adjusting.',
  'A clean solve. It changes nothing.',
  'Even a stopped clock, detective.',
];

export const STREAK_TAUNTS = [
  'Five in a row. You are becoming... inconvenient.',
  'I have begun keeping a file on you. It is thin, but growing.',
  'Ten cases. Tell no one you are winning. They would not believe you anyway.',
  'You see the seams now, do you not? In everything you read?',
  'I forged history for centuries before you arrived. I can wait.',
  'Careful, detective. The better you get, the more personal I make it.',
];

export const EXACT_BONUS_LINES = [
  'You marked the exact sentence. Unsettling.',
  'Line-perfect. I shall write smaller.',
  'The precise forgery, circled. I felt that.',
];

export function pickTaunt(pool: string[], seed: number): string {
  return pool[Math.abs(seed) % pool.length];
}
