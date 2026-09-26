import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, HardDrive, ShieldCheck, Thermometer } from 'lucide-react';

export const StatusTelemetry: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState({
    cpu: 28.4,
    vram: 14.8,
    latency: 58,
    activeModules: 18,
    temperature: 36.4,
    health: 99.98,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpu: +(26 + Math.sin(Date.now() / 2000) * 6 + Math.random() * 2).toFixed(1),
        vram: +(14.6 + Math.cos(Date.now() / 3500) * 0.4).toFixed(1),
        latency: Math.floor(52 + Math.random() * 12),
        activeModules: 18,
        temperature: +(36.2 + Math.random() * 0.5).toFixed(1),
        health: 99.98,
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`holo-card rounded-xl p-4 border border-cyan-500/25 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
            SYSTEM TELEMETRY HUD // REAL-TIME METRICS
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
          <span>SAMPLING: 1000HZ</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 font-semibold">ALL 18 ENCLAVES NOMINAL</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: CPU Load */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono">CPU Core</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
            {metrics.cpu}%
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${metrics.cpu * 2}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Neural VRAM */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono">Neural VRAM</span>
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
            {metrics.vram} <span className="text-xs text-slate-400">/ 32GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${(metrics.vram / 32) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Response Speed */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono">Latency</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
            {metrics.latency} <span className="text-xs text-emerald-300">ms</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (metrics.latency / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Active Modules */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono">Modules</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
            {metrics.activeModules} <span className="text-xs text-slate-400">/ 18 Live</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-400 h-full w-full" />
          </div>
        </div>

        {/* Metric 5: Quantum Temp */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono">Core Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
            {metrics.temperature}°C
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-purple-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${(metrics.temperature / 80) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 6: System Integrity */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-mono">Integrity</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
            {metrics.health}%
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
