import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, ShieldCheck, Activity, Cpu, Sparkles, Volume2, Globe, ExternalLink } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';
import { resolveWebsiteLaunch, openExternalUrlSafely } from '../utils/websiteLauncher';

interface TerminalConsoleProps {
  onThemeChange?: (theme: 'cyan' | 'blue' | 'purple' | 'emerald') => void;
  className?: string;
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
  time: string;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  onThemeChange,
  className = '',
}) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: '1',
      type: 'system',
      text: 'MAXIMOFF OS v3.8.0-NEURAL // KERNEL LINK ESTABLISHED',
      time: '00:00:01',
    },
    {
      id: '2',
      type: 'output',
      text: 'Holographic display drivers mounted. All 18 sub-systems operational.\nType "help" to view executable commands, or try "diagnose" / "status".',
      time: '00:00:02',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTimeString = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const handleExecute = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    playHoloClick(950, 0.04);
    const newLogs: CommandLog[] = [
      ...logs,
      {
        id: Math.random().toString(),
        type: 'input',
        text: `maximoff@core:~$ ${trimmed}`,
        time: getTimeString(),
      },
    ];

    const [cmd, ...args] = trimmed.split(' ');
    const lowerCmd = cmd.toLowerCase();

    setIsProcessing(true);

    // Asynchronous Google & Chrome Research handler
    const handleGoogleResearchQuery = async (topic: string) => {
      try {
        const res = await fetch('/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: topic }),
        });
        const data = await res.json();
        
        let outputText = '';
        if (data.success && data.answer) {
          outputText = `[GOOGLE SEARCH GROUNDING UPLINK ACTIVE]\nTOPIC: "${topic}"\n\n${data.answer}\n\n`;
          if (data.keyFacts && data.keyFacts.length > 0) {
            outputText += `VERIFIED FACTS:\n${data.keyFacts.map((f: string) => `  • ${f}`).join('\n')}\n\n`;
          }
          if (data.sources && data.sources.length > 0) {
            outputText += `SOURCES:\n${data.sources.slice(0, 4).map((s: any) => `  [↗] ${s.title}: ${s.url}`).join('\n')}\n\n`;
          }
          outputText += `[STATUS: VERIFIED & SYNCED TO FIRESTORE DATABASE]`;
        } else {
          outputText = `Research synthesis note: ${data.error || 'No response returned from Google Grounding daemon.'}`;
        }

        playSuccessChime();
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            type: 'output',
            text: outputText,
            time: getTimeString(),
          },
        ]);
      } catch (err) {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            type: 'error',
            text: `Uplink failure: ${err instanceof Error ? err.message : String(err)}`,
            time: getTimeString(),
          },
        ]);
      } finally {
        setIsProcessing(false);
      }
    };

    if (lowerCmd === 'research' || lowerCmd === 'chrome' || lowerCmd === 'google' || lowerCmd === 'ai') {
      const topic = args.join(' ').trim();
      if (!topic) {
        setTimeout(() => {
          setLogs((prev) => [
            ...newLogs,
            {
              id: Math.random().toString(),
              type: 'error',
              text: `Usage: ${lowerCmd} <topic or question>\nExample: ${lowerCmd} What is Google Chrome V8 engine?`,
              time: getTimeString(),
            },
          ]);
          setIsProcessing(false);
        }, 150);
        setInput('');
        return;
      }

      setLogs(newLogs);
      setInput('');
      handleGoogleResearchQuery(topic);
      return;
    }

    // Direct Website Launch Check (e.g., "open spotify", "open amazon", "spotify", "amazon", "open youtube", etc.)
    const siteLaunch = resolveWebsiteLaunch(trimmed);
    if (siteLaunch) {
      openExternalUrlSafely(siteLaunch.url);
      playSuccessChime();
      setTimeout(() => {
        setLogs((prev) => [
          ...newLogs,
          {
            id: Math.random().toString(),
            type: 'output',
            text: `[WEB UPLINK DISPATCHED]
TARGET: ${siteLaunch.name}
CATEGORY: ${siteLaunch.category || 'Popular Web Application'}
URL: ${siteLaunch.url}
STATUS: External portal launched.
NOTE: If blocked by browser popup protection, access directly via: ${siteLaunch.url}`,
            time: getTimeString(),
          },
        ]);
        setIsProcessing(false);
      }, 150);
      setInput('');
      return;
    }

    setTimeout(() => {
      let responseText = '';
      let logType: CommandLog['type'] = 'output';

      switch (lowerCmd) {
        case 'open':
        case 'web':
        case 'launch':
        case 'goto': {
          const target = args.join(' ').trim();
          if (!target) {
            responseText = `Usage: open <website or URL>\nExamples: open spotify, open amazon, open netflix, open youtube, open github`;
            logType = 'error';
            break;
          }
          const resolved = resolveWebsiteLaunch(`open ${target}`) || resolveWebsiteLaunch(target);
          const finalUrl = resolved ? resolved.url : (target.startsWith('http') ? target : `https://${target}`);
          const siteName = resolved ? resolved.name : target;
          openExternalUrlSafely(finalUrl);
          playSuccessChime();
          responseText = `[WEB UPLINK ESTABLISHED]\nTarget: ${siteName}\nURL: ${finalUrl}\nStatus: Launched in new window.`;
          break;
        }

        case 'help':
          responseText = `AVAILABLE COMMANDS:
  open <site|url>   - Open Spotify, Amazon, YouTube, Netflix, GitHub or any URL
  web <site|url>    - Access any popular website available across Google
  status            - Query real-time neural CPU, memory, and quantum telemetry
  research <topic>  - Conduct exhaustive Google Search research & save to database
  chrome <question> - Ask anything regarding Google Chrome, V8, flags, shortcuts
  google <question> - Ask anything regarding Google products, services, research
  ai <question>     - Direct question reasoning uplink via Google Grounding
  database / db     - Inspect live Firestore Database status & synchronized records
  diagnose          - Run full multi-modal diagnostic on Voice, Vision & IO
  build --core      - Compile and verify custom assistant persona configuration
  voice --test      - Trigger neural speech synthesis pipeline test
  vision --scan     - Trigger spatial camera and neural perception probe
  memory --dump     - Display top 5 active vector memory embeddings
  theme <color>     - Switch core hue: 'cyan', 'blue', 'purple', 'emerald'
  clear             - Flush console log buffer`;
          break;

        case 'database':
        case 'db':
          responseText = `FIRESTORE DATABASE STATUS:
  Provider: Google Cloud Firestore (Enterprise Edition)
  Database ID: ai-studio-maximoffautonomo-c2b7a78c-7eaa-4f9e-ba4c-d2b4414474e9
  Project ID: sunlit-cogency-vf6jr
  Active Collections: /research_dossiers, /device_files, /security_audits
  Security Status: Hardened Rules Active (8-Pillars ABAC)
  Connection Integrity: VERIFIED ONLINE`;
          playSuccessChime();
          break;

        case 'status':
          responseText = `CORE STATUS: NOMINAL
  Neural Clock: 3.82 GHz Quantum Flux
  Latency: 38ms (Sub-100ms Target: MET)
  Database Link: Google Cloud Firestore (CONNECTED)
  Active Threads: 128 Dedicated Sensory Enclaves
  Memory Synapses: 1.42B Long-Term Vectors Loaded
  Spatial Mesh: 60 FPS Optical Neural Tracking Ready
  Perception Grid: 100% Hardware Online`;
          playSuccessChime();
          break;

        case 'diagnose':
          responseText = `INITIATING SYSTEM DIAGNOSTICS:
  [✔] Neural Voice DSP ........ OPTIMAL (0.02ms jitter)
  [✔] Spatial Camera Feed ...... 4K 60FPS SYNCHRONIZED
  [✔] Long-Term Memory Vault ... INTEGRITY 100%
  [✔] Local Hardware Relay .... 42 SMART NODES RESPONDING
  DIAGNOSTIC COMPLETE: ALL SYSTEMS RUNNING AT MAXIMUM EFFICIENCY.`;
          playSuccessChime();
          break;

        case 'build':
        case 'build --core':
          responseText = `SYNTHESIZING ASSISTANT ARCHITECTURE:
  - Persona Matrix: British Concierge / Tactical Advisory
  - Reasoning Depth: Level 5 Deep Reflex
  - Execution Sandbox: Isolated Containerized Daemon
  BUILD SUCCESSFUL. Assistant instance "Maximoff-Alpha" is primed and standing by.`;
          break;

        case 'voice':
        case 'voice --test':
          responseText = `VOICE ENGINE TEST:
  Sampling frequency 48kHz, 24-bit floating point.
  Acoustic cancellation: Active.
  Audio synthesizer responded with 0 dropped frames.`;
          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance("Maximoff core online. Systems at your disposal, Sir.");
            utter.rate = 1.05;
            utter.pitch = 0.95;
            window.speechSynthesis.speak(utter);
          }
          break;

        case 'vision':
        case 'vision --scan':
          responseText = `SPATIAL OPTICAL & PERCEPTION PROBE:
  Scanning environment...
  Detected 1 Operator (Face Mesh: 468 vertices, ID: Verified)
  Detected 1 Laptop Workstation (Pos: [0.0, -0.2, 0.6]m)
  Ambient Lux: 340 Lumens · Zero Blind Spots`;
          break;

        case 'memory':
        case 'memory --dump':
          responseText = `TOP VECTOR MEMORY NODES:
  1. [0.984] "User daily schedule: High-priority neural dev session at 09:00"
  2. [0.942] "Home automation: Ambient lighting preference = Cyber Cyan (35%)"
  3. [0.915] "Engineering Blueprint: Autonomous robotics actuator schema rev 4"
  4. [0.892] "Emergency Protocol: Kill-switch isolated on local hardware bus"`;
          break;

        case 'theme': {
          const color = (args[0] || '').toLowerCase() as 'cyan' | 'blue' | 'purple' | 'emerald';
          if (['cyan', 'blue', 'purple', 'emerald'].includes(color)) {
            if (onThemeChange) onThemeChange(color);
            responseText = `CORE THEME UPDATED TO: [${color.toUpperCase()}]`;
          } else {
            responseText = `Invalid hue. Choose from: cyan, blue, purple, emerald.`;
            logType = 'error';
          }
          break;
        }

        case 'clear':
          setLogs([]);
          setIsProcessing(false);
          return;

        default:
          // If not a recognized local CLI command, query Google Research engine!
          setLogs(newLogs);
          setInput('');
          handleGoogleResearchQuery(trimmed);
          return;
      }

      setLogs((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: logType,
          text: responseText,
          time: getTimeString(),
        },
      ]);
      setIsProcessing(false);
    }, 280);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute(input);
    }
  };

  return (
    <div className={`holo-card rounded-xl overflow-hidden border border-cyan-500/30 flex flex-col font-mono text-xs ${className}`}>
      {/* Terminal Title Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-cyan-400 font-semibold tracking-wider text-[11px] ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            MAXIMOFF-SHELL // INTERACTIVE_CORE_CLI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] hidden sm:inline">LIVE TTY1</span>
          <button
            onClick={() => {
              playHoloClick(600, 0.03);
              setLogs([]);
            }}
            className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
            title="Clear buffer"
            aria-label="Clear terminal buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body with Scanline effect */}
      <div
        ref={scrollRef}
        className="p-4 overflow-y-auto space-y-2.5 h-64 sm:h-72 bg-slate-950/90 scanlines"
      >
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            {log.type === 'input' && (
              <div className="text-cyan-300 font-medium">{log.text}</div>
            )}
            {log.type === 'system' && (
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>[{log.time}]</span>
                <span>{log.text}</span>
              </div>
            )}
            {log.type === 'output' && (
              <pre className="text-slate-200 whitespace-pre-wrap font-mono text-[11px] pl-2 border-l border-cyan-500/30">
                {log.text}
              </pre>
            )}
            {log.type === 'error' && (
              <div className="text-rose-400 pl-2 border-l border-rose-500/40">
                {log.text}
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="text-cyan-400 flex items-center gap-2 animate-pulse text-[11px]">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>Processing neural command matrix...</span>
          </div>
        )}
      </div>

      {/* Quick Command Suggestions */}
      <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-slate-500 shrink-0">Quick Cmds:</span>
        {['status', 'diagnose', 'voice --test', 'vision --scan', 'memory --dump'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleExecute(cmd)}
            className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/50 hover:border-cyan-500/50 transition-colors whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Command Input Bar */}
      <div className="p-2.5 bg-slate-950 border-t border-cyan-500/20 flex items-center gap-2">
        <span className="text-cyan-400 font-bold select-none pl-1">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help', 'status', or 'ai <prompt>'..."
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none text-xs font-mono"
        />
        <button
          onClick={() => handleExecute(input)}
          disabled={!input.trim()}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center gap-1"
          aria-label="Send terminal command"
        >
          <span>RUN</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
