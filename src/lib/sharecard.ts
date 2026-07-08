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
  ctx.fillStyle = '#8a8a92';
  ctx.font = '28px Georgia, serif';
  ctx.fillText('G L I T C H   I N   T H E   A R C H I V E', 500, 140);

  ctx.fillStyle = '#e8e0cc';
  ctx.font = 'bold 88px Georgia, serif';
  ctx.fillText(`CASE #${caseNumber}`, 500, 300);

  ctx.fillStyle = solved ? '#b3001b' : '#8a8a92';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.fillText(solved ? (exact ? 'SOLVED — LINE PERFECT' : 'SOLVED') : 'UNSOLVED', 500, 410);

  // wax seal
  const g = ctx.createRadialGradient(460, 560, 10, 500, 600, 90);
  g.addColorStop(0, '#d41f3d'); g.addColorStop(0.6, '#b3001b'); g.addColorStop(1, '#7a0013');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(500, 600, 85, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8e0cc';
  ctx.font = 'bold 72px Georgia, serif';
  ctx.fillText('A', 500, 626);

  const rank = rankFor(pointsFor(stats.wins, stats.exactWins, stats.bestStreak));
  ctx.fillStyle = '#e8e0cc';
  ctx.font = '40px Georgia, serif';
  ctx.fillText(`Rank: ${rank.name}`, 500, 780);
  ctx.fillStyle = '#8a8a92';
  ctx.font = '32px Georgia, serif';
  ctx.fillText(`Streak ${stats.streak}   ·   Best ${stats.bestStreak}   ·   Solved ${stats.wins}/${stats.plays}`, 500, 840);

  ctx.font = '24px Georgia, serif';
  ctx.fillText('Can you catch The Archivist?', 500, 920);

  const a = document.createElement('a');
  a.download = `glitch-case-${caseNumber}.png`;
  a.href = c.toDataURL('image/png');
  a.click();
}
