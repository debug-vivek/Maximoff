import React from 'react';
import { HolographicCore } from './HolographicCore';
import { Play, Terminal, ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import { playHoloClick } from '../utils/soundEffects';

interface HeroSectionProps {
  coreTheme: 'cyan' | 'blue' | 'purple' | 'emerald';
  onCoreThemeChange: (theme: 'cyan' | 'blue' | 'purple' | 'emerald') => void;
  onOpenTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  coreTheme,
  onCoreThemeChange,
  onOpenTerminal,
}) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Radial Gradient Glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Hero Typography & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Unboxed Metadata Header Tag */}
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-widest uppercase">AUTONOMOUS ASSISTANT OPERATING SYSTEM</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">v3.8 QUANTUM</span>
          </div>

          {/* Cinematic Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 holo-glow-cyan">
                MAXIMOFF
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold font-display text-slate-100 tracking-tight">
              Build the Intelligence of Tomorrow.
            </p>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-body">
            The premier platform for architecting a real-life J.A.R.V.I.S.-grade assistant. Engineered with sub-45ms neural voice synthesis, 468-point spatial LiDAR computer vision, 1.4B episodic vector memory, and bare-metal robotics actuation.
          </p>

          {/* Core Hue Customizer Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-mono text-slate-400">
            <span>Reactor Core Hue:</span>
            {(['cyan', 'blue', 'purple', 'emerald'] as const).map((color) => (
              <button
                key={color}
                onClick={() => {
                  playHoloClick(1100, 0.03);
                  onCoreThemeChange(color);
                }}
                className={`px-2.5 py-1 rounded-md border text-[11px] uppercase transition-all cursor-pointer ${
                  coreTheme === color
                    ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#ai-builder"
              onClick={() => playHoloClick(1400, 0.04)}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch AI Studio</span>
            </a>

            <button
              onClick={() => {
                playHoloClick(1200, 0.03);
                onOpenTerminal();
              }}
              className="px-5 py-3.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-semibold rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Interactive CLI</span>
            </button>

            <a
              href="#features"
              onClick={() => playHoloClick(950, 0.02)}
              className="px-5 py-3.5 text-slate-400 hover:text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <span>Explore Blueprints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Social Proof & Quantitative Proof adjacent to Hero claims */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-mono text-slate-400">
            <div>
              <span className="text-white font-bold block text-sm tabular-nums">Sub-45ms</span>
              <span className="text-slate-500 text-[11px]">End-to-End Latency</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-white font-bold block text-sm tabular-nums">1.42 Billion</span>
              <span className="text-slate-500 text-[11px]">Vector Memory Synapses</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-emerald-400 font-bold block text-sm tabular-nums">100% Local</span>
              <span className="text-slate-500 text-[11px]">Zero Cloud Leakage</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Holographic AI Core (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="w-full max-w-[500px] aspect-square relative flex items-center justify-center">
            {/* The 3D Three.js Holographic Core */}
            <HolographicCore
              colorScheme={coreTheme}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
