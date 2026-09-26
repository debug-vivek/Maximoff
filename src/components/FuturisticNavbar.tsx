import React, { useState } from 'react';
import { Volume2, VolumeX, Terminal, Menu, X } from 'lucide-react';
import { playHoloClick, setSoundEnabled, isSoundEnabled } from '../utils/soundEffects';
import maximoffLogo from '../assets/images/realistic_core_logo_1790443734970.jpg';

interface FuturisticNavbarProps {
  onOpenTerminal: () => void;
}

export const FuturisticNavbar: React.FC<FuturisticNavbarProps> = ({ onOpenTerminal }) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      playHoloClick(1400, 0.05);
    }
  };

  const navLinks = [
    { name: 'Core', href: '#hero' },
    { name: 'AI Builder', href: '#ai-builder' },
    { name: 'Voice Studio', href: '#voice-studio' },
    { name: 'Vision', href: '#vision' },
    { name: 'Automation', href: '#automation' },
    { name: 'Extensions', href: '#extensions' },
    { name: 'Documentation', href: '#documentation' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Community', href: '#community' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#030712]/80 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand logo and wordmark */}
        <a
          href="#hero"
          onClick={() => playHoloClick(1200, 0.03)}
          className="text-xl sm:text-2xl font-black font-display tracking-tight text-white flex items-center gap-2.5 group"
        >
          <img
            src={maximoffLogo}
            alt="Maximoff AI Logo"
            className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:scale-105 group-hover:border-cyan-300 transition-all"
            referrerPolicy="no-referrer"
          />
          <span className="text-cyan-400 holo-glow-cyan">MAXIMOFF</span>
        </a>

        {/* Zone 2: 4-6 primary nav links (clean text with hover effect, excess hidden or behind drawer) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium text-slate-300">
          <a
            href="#ai-builder"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            AI Builder
          </a>
          <a
            href="#voice-studio"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Voice Studio
          </a>
          <a
            href="#vision"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Vision
          </a>
          <a
            href="#automation"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Automation
          </a>
          <a
            href="#extensions"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Extensions
          </a>
          <a
            href="#pricing"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Pricing
          </a>
          <a
            href="#contact"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions (Sound FX toggle + Terminal / Launch button) */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              soundOn
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundOn ? 'Mute Holographic Audio FX' : 'Enable Holographic Audio FX'}
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Terminal Launcher Button */}
          <button
            onClick={() => {
              playHoloClick(1400, 0.04);
              onOpenTerminal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
            aria-label="Open Interactive Terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal CLI</span>
          </button>

          {/* Primary CTA */}
          <a
            href="#ai-builder"
            onClick={() => playHoloClick(1300, 0.03)}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] whitespace-nowrap cursor-pointer"
          >
            Initialize Core
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-cyan-500/20 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                playHoloClick(900, 0.02);
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-xs font-mono text-slate-300 hover:text-cyan-400"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 py-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch Terminal CLI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
