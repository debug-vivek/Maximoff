import React, { useState, useEffect } from 'react';
import { playIntroSignatureSound } from '../utils/soundEffects';
import { Power, Sparkles, Shield, Cpu, Zap, Activity } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'standby' | 'initializing' | 'complete'>('standby');
  const [statusText, setStatusText] = useState('TOUCH EMBLEM TO ENGAGE CORE');
  const [progress, setProgress] = useState(0);

  const startIntroSequence = () => {
    if (phase !== 'standby') return;
    setPhase('initializing');

    // Trigger the iconic typical sci-fi intro sound effect
    playIntroSignatureSound();

    const sequence = [
      { text: 'ALIGNING SUB-QUANTUM CORE HARMONICS...', pct: 25, delay: 250 },
      { text: 'SCANNING TITANIUM LOGO EMBLEM & BIOMETRICS...', pct: 55, delay: 750 },
      { text: 'CALIBRATING TWO-WAY VOICE & TEXT ORDER DAEMON...', pct: 85, delay: 1300 },
      { text: 'MAXIMOFF CORE ONLINE. PORTAL GRANTED.', pct: 100, delay: 1850 },
    ];

    sequence.forEach(({ text, pct, delay }) => {
      setTimeout(() => {
        setStatusText(text);
        setProgress(pct);
      }, delay);
    });

    setTimeout(() => {
      setPhase('complete');
      setTimeout(onComplete, 400);
    }, 2400);
  };

  // Keyboard shortcut: Space or Enter triggers the intro
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        startIntroSequence();
      } else if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Background Cyber Grid & Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-35 pointer-events-none" />

      {/* Intro Centerpiece Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full space-y-7">
        {/* Real-Life Physical Core Logo Emblem with Laser Scan Animation */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Kinetic Rings */}
          <div
            className={`absolute w-56 h-56 rounded-full border border-cyan-500/25 transition-all duration-1000 ${
              phase === 'initializing' ? 'animate-ping [animation-duration:1.5s] scale-110 border-cyan-400' : 'opacity-40 animate-pulse'
            }`}
          />
          <div
            className={`absolute w-48 h-48 rounded-full border border-cyan-400/40 border-dashed animate-spin [animation-duration:20s]`}
          />

          {/* Real-Life Logo Container */}
          <div
            onClick={startIntroSequence}
            className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-b from-cyan-400/80 via-slate-800 to-cyan-900/60 shadow-[0_0_40px_rgba(6,182,212,0.45)] transition-all duration-500 cursor-pointer group ${
              phase === 'initializing' ? 'scale-105 shadow-[0_0_65px_rgba(6,182,212,0.8)]' : 'hover:scale-105'
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-black flex items-center justify-center">
              <img
                src="/src/assets/images/maximoff_core_logo_1790438458380.jpg"
                alt="Maximoff Physical Core Emblem"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />

              {/* Laser Scanline that sweeps vertically across the logo emblem */}
              {phase === 'initializing' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#22d3ee] animate-[bounce_1.4s_infinite]" />
              )}

              {/* Interactive Hover Glow Overlay */}
              <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/0 transition-colors pointer-events-none" />
            </div>

            {/* Glowing Touch Trigger Badge */}
            {phase === 'standby' && (
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.7)] flex items-center gap-1">
                <Power className="w-3 h-3" />
                <span>START INTRO</span>
              </div>
            )}
          </div>
        </div>

        {/* Brand Typographic Reveal */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-400 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>NEURAL AUDIO & TEXT OPERATING SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 holo-glow-cyan">
              MAXIMOFF
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide max-w-sm mx-auto">
            Speak aloud or type orders directly to command your personal cybernetic intelligence.
          </p>
        </div>

        {/* Status & Progress Bar */}
        <div className="w-full max-w-sm space-y-3 font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-cyan-500/20 pb-1.5">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              STATUS
            </span>
            <span className="text-white tabular-nums">{progress}%</span>
          </div>

          <div className="text-xs text-cyan-200 tracking-wider h-5 flex items-center justify-center font-medium">
            {statusText}
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-slate-900/90 h-1 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="bg-cyan-400 h-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 text-xs font-mono">
          {phase === 'standby' ? (
            <button
              onClick={startIntroSequence}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Initialize System [Spacebar]</span>
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="text-slate-500 hover:text-cyan-300 text-[11px] underline underline-offset-4 cursor-pointer transition-colors"
            >
              Skip Intro to Portal [ESC]
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
