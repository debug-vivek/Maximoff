import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { playHoloClick } from '../utils/soundEffects';

const CODE_EXAMPLES = {
  python: `from maximoff import MaximoffCore, Persona, VoiceEngine, VisionHUD

# 1. Initialize Autonomous Core
assistant = MaximoffCore(
    name="Maximoff Prime",
    persona=Persona.BRITISH_CONCIERGE,
    wake_word="Hey Maximoff",
    local_inference=True
)

# 2. Register Hardware Actuator Tool
@assistant.tool("seal_laboratory")
def seal_laboratory(lockdown_level: int = 2) -> dict:
    """Closes all motorized smart deadbolts and dims ambient lighting."""
    return assistant.hardware.dispatch("lockdown", level=lockdown_level)

# 3. Mount Spatial Vision & Listen
assistant.mount_vision(fps=60, lidar_enabled=True)
assistant.listen()`,

  typescript: `import { MaximoffCore, Persona } from '@maximoff/sdk';

// 1. Initialize Maximoff Holographic Core
const assistant = new MaximoffCore({
  name: 'Maximoff Prime',
  persona: Persona.Concierge,
  wakeWord: 'Hey Maximoff',
  telemetryStream: true,
  offlineOnly: true,
});

// 2. Register Custom Tool & Actuation
assistant.registerTool({
  name: 'activate_propulsion_telemetry',
  description: 'Streams live gimbal motor sensor metrics to HUD',
  execute: async ({ thrustLevel }) => {
    return await assistant.hardware.actuate('gimbal', { thrust: thrustLevel });
  },
});

// 3. Start Event Loop
await assistant.boot();
console.log('Maximoff Core online and listening on local RPC socket.');`,

  rust: `use maximoff_core::{MaximoffBuilder, Persona, ActuatorBridge};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Zero-cost memory mapped neural core
    let mut core = MaximoffBuilder::new("Maximoff-Rust")
        .persona(Persona::TacticalAnalyst)
        .wake_word("Aegis")
        .build_local_tensor()
        .await?;

    // 2. Hardware relay initialization
    core.connect_actuator(ActuatorBridge::Ros2CanBus("can0")).await?;

    // 3. Enter real-time async sensory loop (sub-40ms)
    core.run_sensory_daemon().await?;
    Ok(())
}`,

  curl: `# Query Maximoff Local RPC Daemon
curl -X POST http://127.0.0.1:4092/v1/intent \\
  -H "Authorization: Bearer LOCAL_ENCLAVE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "modality": "audio_stream",
    "prompt": "Verify laboratory atmospheric pressures and arm perimeter",
    "persona": "concierge",
    "execute_hardware": true
  }'`,
};

export const DeveloperDocs: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'python' | 'typescript' | 'rust' | 'curl'>('python');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playHoloClick(1400, 0.04);
    navigator.clipboard.writeText(CODE_EXAMPLES[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="documentation" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Open SDK & Local Daemon API
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Developer <span className="text-cyan-400 holo-glow-cyan">Documentation</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Integrate Maximoff into your local workstation, robotics rig, or smart-home controller. Native SDKs with zero-latency local IPC sockets and deterministic tool calling.
          </p>
        </div>

        {/* Documentation Viewer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Code Snippet Card (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="holo-card rounded-2xl overflow-hidden border border-cyan-500/25">
              {/* Tabs Bar */}
              <div className="bg-slate-950 px-4 py-3 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {(['python', 'typescript', 'rust', 'curl'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        playHoloClick(950, 0.02);
                        setSelectedLang(lang);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        selectedLang === lang
                          ? 'bg-cyan-950/60 border border-cyan-400 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {lang === 'typescript' ? 'TypeScript' : lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 text-xs font-mono transition-all cursor-pointer"
                  aria-label="Copy code snippet to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SDK Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Editor Box */}
              <div className="p-6 bg-slate-950/95 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed scanlines">
                <pre>
                  <code>{CODE_EXAMPLES[selectedLang]}</code>
                </pre>
              </div>

              {/* Terminal Install Helper */}
              <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {selectedLang === 'python' && 'pip install maximoff-core'}
                    {selectedLang === 'typescript' && 'npm install @maximoff/sdk'}
                    {selectedLang === 'rust' && 'cargo add maximoff-core'}
                    {selectedLang === 'curl' && 'brew install maximoff-daemon'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400">v3.8.0 NOMINAL</span>
              </div>
            </div>
          </div>

          {/* Right: API Reference & Core Guarantees (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25">
              <h3 className="text-base font-semibold text-white font-display mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Architecture Guarantees
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Engineered for bare-metal performance, predictable real-time execution, and zero telemetry leakage.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">IPC Protocol</span>
                  <span className="text-white font-semibold">Unix Domain Sockets & Shared Memory</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Cold Boot Overhead</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">&lt; 38 Milliseconds</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Hardware Compatibility</span>
                  <span className="text-cyan-300 font-semibold">Apple Silicon, NVIDIA RTX, Linux ARM64</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
