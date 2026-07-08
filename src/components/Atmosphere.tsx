/** Dust motes drifting through the lamplight. Pure CSS, GPU-cheap. */
const MOTES = [
  { left: '12%', delay: '0s', dur: '18s' },
  { left: '28%', delay: '4s', dur: '15s' },
  { left: '47%', delay: '9s', dur: '20s' },
  { left: '63%', delay: '2s', dur: '14s' },
  { left: '78%', delay: '6s', dur: '17s' },
  { left: '90%', delay: '11s', dur: '19s' },
];

export default function Atmosphere() {
  return (
    <>
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={{ left: m.left, bottom: '-2vh', animationDelay: m.delay, animationDuration: m.dur }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
