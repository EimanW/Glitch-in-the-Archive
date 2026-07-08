import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: "Today's Case" },
  { to: '/archive', label: 'Archive' },
  { to: '/how-it-works', label: 'How It Works' },
];

export default function Nav() {
  return (
    <header className="border-b border-silver/15">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-5 sm:flex-row sm:justify-between">
        <NavLink to="/" className="text-center sm:text-start">
          <span className="font-heading text-2xl font-bold tracking-tight text-ivory">
            <span className="flicker text-blood">GLITCH</span> in the Archive
          </span>
          <span className="mt-0.5 block font-blackletter text-sm tracking-wider text-blood/80">versus THE ARCHIVIST</span>
        </NavLink>
        <nav className="flex gap-5 text-xs tracking-[0.15em]" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `uppercase transition-colors hover:text-ivory ${isActive ? 'text-blood' : 'text-silver'}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
