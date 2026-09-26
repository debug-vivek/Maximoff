import React from 'react';
import { playHoloClick } from '../utils/soundEffects';
import maximoffLogo from '../assets/images/realistic_core_logo_1790443734970.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cyan-500/15 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={() => playHoloClick(1000, 0.02)}
            className="text-base font-bold font-display text-white tracking-wider hover:text-cyan-400 transition-colors flex items-center gap-2"
          >
            <img
              src={maximoffLogo}
              alt="Maximoff AI Logo"
              className="w-5 h-5 rounded object-cover border border-cyan-500/40"
              referrerPolicy="no-referrer"
            />
            MAXIMOFF
          </a>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-slate-400">Autonomous Cybernetic Platform</span>
        </div>

        {/* Quiet Navigation Links */}
        <nav className="flex flex-wrap items-center gap-6">
          <a
            href="#ai-builder"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            AI Builder
          </a>
          <a
            href="#voice-studio"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            Voice Studio
          </a>
          <a
            href="#vision"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            Vision
          </a>
          <a
            href="#automation"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            Automation
          </a>
          <a
            href="#documentation"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            Documentation
          </a>
          <a
            href="#pricing"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            onClick={() => playHoloClick(900, 0.02)}
            className="hover:text-cyan-300 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Copyright notice */}
        <div className="text-slate-600 text-center md:text-right">
          © {new Date().getFullYear()} Maximoff Systems Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
