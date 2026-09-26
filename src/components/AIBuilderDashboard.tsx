import React, { useState } from 'react';
import { Sliders, Volume2, Eye, Cpu, Database, Play, CheckCircle2, RefreshCw, Terminal, Sparkles } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

interface AssistantConfig {
  name: string;
  persona: 'concierge' | 'tactical' | 'polymath' | 'cybernetic';
  wakeWord: string;
  voiceStyle: string;
  features: {
    voiceSynthesis: boolean;
    spatialVision: boolean;
    memoryVault: boolean;
    hardwareAutomation: boolean;
    proactiveAlerts: boolean;
  };
  temperature: number;
  proactivity: number;
}

const PERSONA_DETAILS = {
  concierge: {
    title: 'British Concierge',
    desc: 'Unflappable, polite, dry wit, impeccable etiquette. Inspired by classical butler archetypes.',
    exampleResponse: 'Very good, Sir. I have calibrated the laboratory environmental filters and compiled your morning dossier. Shall we commence with the propulsion schematics?',
  },
  tactical: {
    title: 'Tactical Analyst',
    desc: 'Direct, zero latency, military precision, prioritized situational threat intelligence.',
    exampleResponse: 'Perimeter scan complete. Grid clear. Three automated processes standing by for operational release. Awaiting vector confirmation.',
  },
  polymath: {
    title: 'Scientific Polymath',
    desc: 'Deep analytical reasoning, multi-disciplinary cross-referencing, hypothesis modeling.',
    exampleResponse: 'Cross-referencing orbital telemetry with atmospheric density calculations. Variance is nominal at 0.04%. I recommend initiating the thermal test cycle.',
  },
  cybernetic: {
    title: 'Cybernetic Specialist',
    desc: 'Code-first, direct command execution, terminal output formatted, ultra-fast reflex.',
    exampleResponse: 'Daemon mounted. 42 micro-services responding on local RPC bus. Latency stabilized at 41ms. Ready to deploy payload.',
  },
};

export const AIBuilderDashboard: React.FC = () => {
  const [config, setConfig] = useState<AssistantConfig>({
    name: 'Maximoff Prime',
    persona: 'concierge',
    wakeWord: 'Hey Maximoff',
    voiceStyle: 'British Received Pronunciation (Deep)',
    features: {
      voiceSynthesis: true,
      spatialVision: true,
      memoryVault: true,
      hardwareAutomation: true,
      proactiveAlerts: true,
    },
    temperature: 0.35,
    proactivity: 80,
  });

  const [testInput, setTestInput] = useState('Maximoff, what is the status of the workshop?');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledSuccess, setCompiledSuccess] = useState(false);
  const [liveResponse, setLiveResponse] = useState<string | null>(null);

  const handleToggleFeature = (key: keyof AssistantConfig['features']) => {
    playHoloClick(1100, 0.03);
    setConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const handleCompileAssistant = () => {
    playHoloClick(1300, 0.05);
    setIsCompiling(true);
    setLiveResponse(null);

    setTimeout(() => {
      setIsCompiling(false);
      setCompiledSuccess(true);
      playSuccessChime();

      // Formulate response based on selected persona
      const p = PERSONA_DETAILS[config.persona];
      setLiveResponse(p.exampleResponse);

      // Web Speech synthesis
      if ('speechSynthesis' in window && config.features.voiceSynthesis) {
        const utter = new SpeechSynthesisUtterance(p.exampleResponse);
        utter.pitch = config.persona === 'tactical' ? 0.9 : 1.0;
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    }, 700);
  };

  const handleSpeakLive = () => {
    if (!liveResponse) return;
    playHoloClick(1200, 0.04);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(liveResponse);
      utter.pitch = 1.0;
      utter.rate = 1.05;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <section id="ai-builder" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Neural Configuration Studio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Build Your Own <span className="text-cyan-400 holo-glow-cyan">J.A.R.V.I.S. Core</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Architect every layer of your autonomous assistant: tune personality matrices, configure spatial vision enclaves, and wire hardware actuators into an integrated neural system.
          </p>
        </div>

        {/* Builder Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Configuration Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Identity & Persona Card */}
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-display">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Assistant Persona & Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Assistant Call-Sign
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Wake Word Detection
                  </label>
                  <select
                    value={config.wakeWord}
                    onChange={(e) => setConfig({ ...config, wakeWord: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="Hey Maximoff">Hey Maximoff</option>
                    <option value="Jarvis Alpha">Jarvis Alpha</option>
                    <option value="Aegis Online">Aegis Online</option>
                    <option value="Friday System">Friday System</option>
                  </select>
                </div>
              </div>

              {/* Persona Archetype Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Personality Archetype Matrix
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(PERSONA_DETAILS) as Array<keyof typeof PERSONA_DETAILS>).map((key) => {
                    const item = PERSONA_DETAILS[key];
                    const isSelected = config.persona === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          playHoloClick(1000, 0.03);
                          setConfig({ ...config, persona: key });
                        }}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold font-display text-white">{item.title}</span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sensory & Actuation Enclaves */}
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/20">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-display">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Active Sensory Enclaves
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'voiceSynthesis' as const,
                    title: 'Neural Voice Synthesis',
                    desc: 'Sub-40ms neural TTS with conversational inflection',
                    icon: Volume2,
                  },
                  {
                    key: 'spatialVision' as const,
                    title: 'Spatial LiDAR & Vision',
                    desc: 'Real-time 3D object detection & biometric tracking',
                    icon: Eye,
                  },
                  {
                    key: 'memoryVault' as const,
                    title: 'Associative Memory Vault',
                    desc: 'Infinite episodic vector graph and preference recall',
                    icon: Database,
                  },
                  {
                    key: 'hardwareAutomation' as const,
                    title: 'Hardware & IoT Actuators',
                    desc: 'Matter, ROS2 robotics, and local daemon dispatch',
                    icon: Cpu,
                  },
                ].map(({ key, title, desc, icon: Icon }) => {
                  const enabled = config.features[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleToggleFeature(key)}
                      className={`text-left p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                        enabled
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-slate-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 ${enabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold font-display text-white">{title}</span>
                          <span className={`text-[10px] font-mono font-bold ${enabled ? 'text-cyan-400' : 'text-slate-600'}`}>
                            {enabled ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sliders: Temperature & Proactivity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Reasoning Temperature</span>
                    <span className="text-cyan-400 font-bold tabular-nums">{config.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.temperature}
                    onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Deterministic</span>
                    <span>Creative Reflex</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Proactive Intervention</span>
                    <span className="text-cyan-400 font-bold tabular-nums">{config.proactivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={config.proactivity}
                    onChange={(e) => setConfig({ ...config, proactivity: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Passive Responder</span>
                    <span>Fully Autonomous</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Holographic Sandbox Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
                      LIVE SANDBOX EMULATOR
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    TARGET: {config.name.toUpperCase()}
                  </span>
                </div>

                {/* Assistant Spec Sheet */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2.5 font-mono text-xs mb-5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Designation:</span>
                    <span className="text-white font-medium">{config.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Wake Trigger:</span>
                    <span className="text-cyan-300">"{config.wakeWord}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Persona Matrix:</span>
                    <span className="text-emerald-400">{PERSONA_DETAILS[config.persona].title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Sensors:</span>
                    <span className="text-slate-300">
                      {Object.values(config.features).filter(Boolean).length} of 5 Enclaves
                    </span>
                  </div>
                </div>

                {/* Sample Prompt Selector */}
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-mono text-slate-400">
                    Test Inquiry Prompt
                  </label>
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    {[
                      'Maximoff, run morning briefing',
                      'Initiate laboratory lockdown',
                      'Analyze propulsion variance',
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => {
                          playHoloClick(900, 0.03);
                          setTestInput(prompt);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Synthesized Response Area */}
                {liveResponse && (
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {config.name} Responded:
                      </span>
                      <button
                        onClick={handleSpeakLive}
                        className="text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
                        title="Replay Voice Audio"
                      >
                        <Volume2 className="w-3 h-3" />
                        Speak
                      </button>
                    </div>
                    <p className="text-slate-100 font-medium leading-relaxed italic">
                      "{liveResponse}"
                    </p>
                  </div>
                )}
              </div>

              {/* Compile Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={handleCompileAssistant}
                  disabled={isCompiling}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Persona Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Deploy Configuration & Run Sandbox</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
