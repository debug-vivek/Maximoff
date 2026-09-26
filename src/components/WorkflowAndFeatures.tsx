import React, { useState } from 'react';
import { Mic, Eye, Database, Brain, Zap, Cpu, ShieldCheck, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { playHoloClick } from '../utils/soundEffects';

interface WorkflowStep {
  id: number;
  phase: string;
  name: string;
  latency: string;
  icon: React.ElementType;
  description: string;
  details: string[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    phase: 'INGESTION',
    name: 'Multi-Modal Sensory Input',
    latency: '12ms',
    icon: Mic,
    description: 'Captures 48kHz audio streams, 60fps LiDAR spatial point clouds, and live keyboard/IDE telemetry concurrently.',
    details: ['Beamforming beam-steered microphone array', 'Sub-millimeter LiDAR room depth sweep', 'Active noise filtering (48dB SNR)'],
  },
  {
    id: 2,
    phase: 'PERCEPTION',
    name: 'Neural Transcription & Spatial Mesh',
    latency: '18ms',
    icon: Eye,
    description: 'Locally translates speech phonemes into intent tokens while constructing a 468-point spatial face & object mesh.',
    details: ['Zero-cloud streaming phonetic decoding', 'Sub-millimeter 3D object bounding boxes', 'Facial biometric clearance verification'],
  },
  {
    id: 3,
    phase: 'RECALL',
    name: 'Vector Graph Memory Search',
    latency: '4ms',
    icon: Database,
    description: 'HNSW semantic index queries 1.42 billion vector embeddings to pull relevant operator preferences and blueprints.',
    details: ['Episodic long-term conversation recall', 'Technical schematic contextual injection', 'Cosine similarity ranking (>0.92 cutoff)'],
  },
  {
    id: 4,
    phase: 'REASONING',
    name: 'Multi-Agent Reasoning Core',
    latency: '34ms',
    icon: Brain,
    description: 'Evaluates intent against safety policies, selects appropriate tooling enclaves, and formulates high-order plans.',
    details: ['Level 5 reflexive autonomous reasoning', 'Isolated Docker sandbox verification', 'Multi-tool function call dependency tree'],
  },
  {
    id: 5,
    phase: 'EXECUTION',
    name: 'Physical Actuation & Audio Response',
    latency: '16ms',
    icon: Zap,
    description: 'Dispatches real hardware commands (Matter, ROS2 robotics, terminal daemons) and synthesizes vocal response.',
    details: ['Zero dropped frames in audio playback', 'Local CAN-bus & WebSocket actuators fired', 'Total end-to-end response: 84ms'],
  },
];

export const WorkflowAndFeatures: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState(1);
  const activeStep = WORKFLOW_STEPS.find((s) => s.id === activeStepId) || WORKFLOW_STEPS[0];

  const handleStepSelect = (id: number) => {
    playHoloClick(1100 + id * 60, 0.03);
    setActiveStepId(id);
  };

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Real-Time Cognitive Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            The 84ms <span className="text-cyan-400 holo-glow-cyan">Neural Workflow</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Witness how Maximoff processes multi-modal perception, recalls episodic vectors, executes high-order reasoning, and actuates physical machines in less than one-tenth of a second.
          </p>
        </div>

        {/* Interactive Step Scrubber Timeline */}
        <div className="mb-12">
          {/* Step Buttons Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-cyan-500/20 mb-6">
            {WORKFLOW_STEPS.map((step) => {
              const isSelected = activeStepId === step.id;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepSelect(step.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      0{step.id}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {step.latency}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-display line-clamp-1">
                    {step.phase}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Step Card */}
          <div className="holo-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    <activeStep.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-400 tracking-wider">
                      PHASE 0{activeStep.id} // {activeStep.phase}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      {activeStep.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-body">
                  {activeStep.description}
                </p>

                <div className="space-y-2 pt-2">
                  {activeStep.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latency Visual Counter */}
              <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 border border-cyan-500/20 text-center space-y-3">
                <div className="text-xs font-mono text-slate-400">ALLOCATED LATENCY BUDGET</div>
                <div className="text-5xl font-black font-mono text-cyan-400 tabular-nums holo-glow-cyan">
                  {activeStep.latency}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% HARDWARE ACCELERATED</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${(parseInt(activeStep.latency) / 34) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Holographic Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {[
            {
              title: 'Sub-65ms Reflex',
              kicker: 'Ultra-Low Latency',
              desc: 'Trained with speculative decoding and direct kernel memory mappings to respond before human breath settles.',
              metric: '64ms Cold Start',
            },
            {
              title: 'Spatial LiDAR Mesh',
              kicker: 'Physical Awareness',
              desc: 'Full 3D depth perception tracking faces, hands, screens, and laboratory objects in real-time.',
              metric: '468 Biometric Points',
            },
            {
              title: 'Persistent Memory',
              kicker: 'Infinite Recall',
              desc: 'Never forget an instruction, blueprint, preference, or conversational nuance across years of interaction.',
              metric: '1.42B Vector Synapses',
            },
            {
              title: 'Matter & ROS2 Hub',
              kicker: 'Hardware Actuation',
              desc: 'Autonomous bridge to real physical machines: motorized deadbolts, smart circuits, drones, and robotic arms.',
              metric: '400+ Device Bridges',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="holo-card rounded-2xl p-6 border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-400/60 group transition-all"
            >
              <div>
                <div className="text-[11px] font-mono text-cyan-400 mb-1 tracking-wider uppercase">
                  {card.kicker}
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Benchmark:</span>
                <span className="text-emerald-400 font-bold">{card.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
