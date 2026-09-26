import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, AlertTriangle, ArrowRight, Home, Shield, Code, Sparkles, Clock } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

interface AutomationRoutine {
  id: string;
  title: string;
  category: 'smart-home' | 'desktop' | 'robotics' | 'security';
  trigger: string;
  steps: string[];
  lastExecuted: string;
  status: 'active' | 'standby';
}

const INITIAL_ROUTINES: AutomationRoutine[] = [
  {
    id: '1',
    title: 'Lab Lockdown & Environmental Seal',
    category: 'security',
    trigger: 'Voice: "Maximoff, initiate lab lockdown"',
    steps: [
      'Dim ambient Philips Hue fixtures to 15% Cyan',
      'Engage motorized smart door deadbolts',
      'Isolate local dev network into air-gapped enclaves',
      'Synthesize audio confirmation: "Workshop secured."',
    ],
    lastExecuted: '42m ago',
    status: 'active',
  },
  {
    id: '2',
    title: 'Morning Executive Briefing & Hardware Pre-heat',
    category: 'smart-home',
    trigger: 'Time: 08:30 AM or Operator Face Detected',
    steps: [
      'Activate espresso smart-plug relay',
      'Generate oral digest of top aerospace papers & GitHub PRs',
      'Run diagnostic on robotic actuator servo motors',
      'Display daily calendar holographic overlay on desk HUD',
    ],
    lastExecuted: 'Yesterday 08:30',
    status: 'active',
  },
  {
    id: '3',
    title: 'Developer Deep-Focus Matrix',
    category: 'desktop',
    trigger: 'Process launch: VS Code or Terminal TTY',
    steps: [
      'Route all incoming communications to silent priority queue',
      'Spin up local Kubernetes clusters & Ollama vector store',
      'Apply high-contrast dark theme across all connected displays',
    ],
    lastExecuted: '3h ago',
    status: 'active',
  },
  {
    id: '4',
    title: 'Autonomous Thermal & Actuator Fail-Safe',
    category: 'robotics',
    trigger: 'Telemetry sensor: GPU temp > 78°C or servo strain',
    steps: [
      'Spin cooling fans to 100% duty cycle',
      'Throttle background batch inferences',
      'Dispatch safety telemetry alert to operator terminal',
    ],
    lastExecuted: 'Never (Safe)',
    status: 'standby',
  },
];

export const AutomationHub: React.FC = () => {
  const [routines, setRoutines] = useState<AutomationRoutine[]>(INITIAL_ROUTINES);
  const [activeRoutine, setActiveRoutine] = useState<AutomationRoutine>(INITIAL_ROUTINES[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedStepIndex, setExecutedStepIndex] = useState(-1);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const handleRunRoutine = (routine: AutomationRoutine) => {
    playHoloClick(1300, 0.05);
    setActiveRoutine(routine);
    setIsExecuting(true);
    setExecutedStepIndex(-1);
    setExecutionLog([`Initializing execution sequence for "${routine.title}"...`]);

    routine.steps.forEach((step, index) => {
      setTimeout(() => {
        setExecutedStepIndex(index);
        playHoloClick(900 + index * 100, 0.03);
        setExecutionLog((prev) => [...prev, `[✔ Step ${index + 1}] Executed: ${step}`]);

        if (index === routine.steps.length - 1) {
          setTimeout(() => {
            setIsExecuting(false);
            playSuccessChime();
            setExecutionLog((prev) => [...prev, `ROUTINE COMPLETED WITH ZERO ERRORS IN 1.84S.`]);

            // Speech synthesis feedback if available
            if ('speechSynthesis' in window) {
              const utter = new SpeechSynthesisUtterance(`${routine.title} has completed successfully.`);
              utter.rate = 1.05;
              window.speechSynthesis.speak(utter);
            }
          }, 400);
        }
      }, (index + 1) * 450);
    });
  };

  return (
    <section id="automation" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Hardware Actuation & IoT Hub
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Automation <span className="text-cyan-400 holo-glow-cyan">Control Center</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Bridge digital intelligence with real physical actuators. Control Matter smart-home devices, ROS2 robotics, desktop scripts, and laboratory security with autonomous rule triggers.
          </p>
        </div>

        {/* Automation Hub Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Routine Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                <h3 className="text-base font-semibold text-white font-display flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Configured Autonomous Chains
                </h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {routines.length} ACTIVE
                </span>
              </div>

              <div className="space-y-3">
                {routines.map((routine) => {
                  const isSelected = activeRoutine.id === routine.id;
                  return (
                    <div
                      key={routine.id}
                      onClick={() => {
                        playHoloClick(1000, 0.03);
                        setActiveRoutine(routine);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-white font-display">
                          {routine.title}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 shrink-0">
                          {routine.category.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span className="truncate">{routine.trigger}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-850">
                        <span>{routine.steps.length} Actions in chain</span>
                        <span className="text-cyan-400">Last: {routine.lastExecuted}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Pipeline Runner (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/30">
              {/* Routine Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Selected Workflow
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {activeRoutine.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Trigger Condition: <span className="text-slate-200">{activeRoutine.trigger}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRunRoutine(activeRoutine)}
                  disabled={isExecuting}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isExecuting ? 'EXECUTING PIPELINE...' : 'SIMULATE EXECUTION'}</span>
                </button>
              </div>

              {/* Execution Step Flow */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-mono text-slate-400 font-semibold">
                  Action Chain Sequence:
                </div>
                {activeRoutine.steps.map((step, idx) => {
                  const isDone = executedStepIndex >= idx;
                  const isCurrent = executedStepIndex === idx && isExecuting;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                        isDone
                          ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isDone
                            ? 'bg-cyan-400 text-slate-950'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="flex-1 text-xs font-mono">
                        <span className={isDone ? 'text-slate-100 font-medium' : 'text-slate-400'}>
                          {step}
                        </span>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                          FIRING...
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Real-Time Execution Console Log */}
              {executionLog.length > 0 && (
                <div className="p-4 bg-slate-950/90 rounded-xl border border-cyan-500/20 font-mono text-[11px] space-y-1.5 max-h-36 overflow-y-auto">
                  <div className="text-slate-500 text-[10px] border-b border-slate-800 pb-1 flex justify-between">
                    <span>DAEMON AUDIT LOG</span>
                    <span className="text-cyan-400">STATUS: OK</span>
                  </div>
                  {executionLog.map((log, i) => (
                    <div key={i} className="text-cyan-300">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
