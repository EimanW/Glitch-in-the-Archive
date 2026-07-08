import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Atmosphere from './components/Atmosphere';
import Play from './pages/Play';
import Archive from './pages/Archive';
import HowItWorks from './pages/HowItWorks';

export default function App() {
  return (
    <div className="grain min-h-screen">
      <Atmosphere />
      <Nav />
      <Routes>
        <Route path="/" element={<Play />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
      <footer className="border-t border-silver/15 py-6 text-center text-[10px] tracking-[0.2em] text-silver/50">
        AN ORIGINAL DAILY DECEPTION GAME · BUILT BY EIMAN WASIM · NO ACCOUNTS, NO TRACKING
      </footer>
    </div>
  );
}
