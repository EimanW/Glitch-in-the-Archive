import { rankFor, pointsFor } from '../data/ranks';
import type { Stats } from './stats';

export function downloadShareCard(caseNumber: number, solved: boolean, exact: boolean, stats: Stats) {
  const c = document.createElement('canvas');
  c.width = 1000; c.height = 1000;
  const ctx = c.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, 1000, 1000);

  // frame
  ctx.strokeStyle = 'rgba(138,138,146,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 920, 920);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#a1a1aa'; // zinc-400
  ctx.font = '28px monospace';
  ctx.fillText('G L I T C H   I N   T H E   A R C H I V E', 500, 140);

  ctx.fillStyle = '#f4f4f5'; // zinc-100
  ctx.font = 'bold 88px monospace';
  ctx.fillText(`CASE #${caseNumber}`, 500, 300);

  ctx.fillStyle = solved ? (exact ? '#4ade80' : '#e4e4e7') : '#ef4444'; // green-400 : zinc-200 : red-500
  ctx.font = 'bold 64px monospace';
  ctx.fillText(solved ? (exact ? 'PERFECT DEDUCTION' : 'SOLVED') : 'DECEIVED', 500, 420);

  // Divider
  ctx.strokeStyle = '#27272a'; // zinc-800
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 500);
  ctx.lineTo(700, 500);
  ctx.stroke();

  const rank = rankFor(pointsFor(stats.wins, stats.exactWins, stats.bestStreak));
  ctx.fillStyle = '#f4f4f5';
  ctx.font = '40px monospace';
  ctx.fillText(`Rank: ${rank.name}`, 500, 620);
  
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '32px monospace';
  ctx.fillText(`Streak: ${stats.streak}  |  Solve Rate: ${Math.round((stats.wins / Math.max(1, stats.plays)) * 100)}%`, 500, 720);

  ctx.fillStyle = '#52525b'; // zinc-600
  ctx.font = '24px monospace';
  ctx.fillText('[ CLASSIFIED DOSSIER ]', 500, 900);

  const a = document.createElement('a');
  a.download = `glitch-case-${caseNumber}.png`;
  a.href = c.toDataURL('image/png');
  a.click();
}
