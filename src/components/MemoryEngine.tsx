import React, { useState } from 'react';
import { Database, Search, Plus, Network, Cpu, Clock, Check, Sparkles, Filter } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

interface MemoryNode {
  id: string;
  category: 'preference' | 'project' | 'security' | 'schedule';
  content: string;
  vectorSimilarity: number;
  timestamp: string;
  associations: string[];
}

const INITIAL_MEMORIES: MemoryNode[] = [
  {
    id: '1',
    category: 'project',
    content: 'Propulsion schematic Mark 42: Flight stabilizer requires titanium alloy with 0.05% carbon tolerance.',
    vectorSimilarity: 0.984,
    timestamp: '2 hours ago',
    associations: ['Aerospace', 'Propulsion', 'Titanium'],
  },
  {
    id: '2',
    category: 'preference',
    content: 'Operator coffee preference: Double-shot espresso at 72°C brewed upon morning lab entry.',
    vectorSimilarity: 0.952,
    timestamp: 'Yesterday 08:15',
    associations: ['Morning Routine', 'Espresso', 'Biometrics'],
  },
  {
    id: '3',
    category: 'security',
    content: 'Air-gapped lab enclave emergency passphrase initialized on hardware YubiKey serial #4092.',
    vectorSimilarity: 0.938,
    timestamp: '3 days ago',
    associations: ['Security', 'Encryption', 'Hardware'],
  },
  {
    id: '4',
    category: 'schedule',
    content: 'Annual Defense Contract Technical Review scheduled for next Thursday at 14:00 UTC.',
    vectorSimilarity: 0.912,
    timestamp: '5 days ago',
    associations: ['Calendar', 'Executive', 'Briefing'],
  },
];

export const MemoryEngine: React.FC = () => {
  const [memories, setMemories] = useState<MemoryNode[]>(INITIAL_MEMORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<MemoryNode['category']>('project');
  const [isInjecting, setIsInjecting] = useState(false);

  const filteredMemories = memories.filter(
    (m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.associations.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInjectMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    playHoloClick(1400, 0.04);
    setIsInjecting(true);

    setTimeout(() => {
      const newNode: MemoryNode = {
        id: Math.random().toString(),
        category: newMemoryCategory,
        content: newMemoryText.trim(),
        vectorSimilarity: +(0.92 + Math.random() * 0.07).toFixed(3),
        timestamp: 'Just now',
        associations: ['User Injection', newMemoryCategory.toUpperCase()],
      };

      setMemories([newNode, ...memories]);
      setNewMemoryText('');
      setIsInjecting(false);
      playSuccessChime();
    }, 600);
  };

  return (
    <section id="memory" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Associative Neural Vector Store
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Long-Term <span className="text-cyan-400 holo-glow-cyan">Memory Engine</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Standard chatbots suffer from amnesia. Maximoff indexes episodic interactions, engineering schematics, and personal operator quirks into an on-device HNSW vector graph with infinite context retention.
          </p>
        </div>

        {/* Visual Architecture Banner */}
        <div className="holo-card rounded-2xl overflow-hidden border border-cyan-500/25 mb-10 relative">
          <div className="relative aspect-[21/9] sm:aspect-[24/8] max-h-72 w-full bg-slate-950 overflow-hidden">
            <img
              src="/src/assets/images/neural_memory_architecture_1790434202680.jpg"
              alt="Maximoff Neural Memory Graph Architecture"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />

            {/* Floating Telemetry Box over image */}
            <div className="absolute bottom-4 left-4 sm:left-8 right-4 sm:right-8 flex flex-wrap items-center justify-between gap-4">
              <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/40 text-xs font-mono text-cyan-300">
                <span className="text-white font-bold">HNSW VECTOR GRAPH:</span> 1.42B EMBEDDINGS ACTIVE
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-300 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/40">
                <span>SIMILARITY METRIC: COSINE</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">RETRIEVAL LATENCY: 3.4MS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Memory Vault */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search & Memory Nodes (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white font-display">
                    Episodic Knowledge Index
                  </h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {filteredMemories.length} VECTORS MATCHED
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative mb-5">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Semantic query vector (e.g. 'propulsion', 'espresso', 'security')..."
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Memory Cards */}
              <div className="space-y-3">
                {filteredMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold uppercase tracking-wider">
                        {mem.category}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>SIMILARITY:</span>
                        <span className="text-emerald-400 font-bold tabular-nums">
                          {mem.vectorSimilarity}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-mono">
                      {mem.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        {mem.associations.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mem.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inject New Knowledge (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25">
              <h3 className="text-base font-semibold text-white mb-2 font-display flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Inject Custom Knowledge Vector
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Teach your Maximoff assistant new permanent facts, operator preferences, or hardware specifications.
              </p>

              <form onSubmit={handleInjectMemory} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Memory Classification
                  </label>
                  <select
                    value={newMemoryCategory}
                    onChange={(e) => setNewMemoryCategory(e.target.value as MemoryNode['category'])}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="project">Project / Engineering Specs</option>
                    <option value="preference">Operator Personal Preference</option>
                    <option value="security">Security & Enclave Rules</option>
                    <option value="schedule">Schedule & Briefing Routines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Knowledge Content Statement
                  </label>
                  <textarea
                    rows={4}
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    placeholder="e.g. Always generate code examples with TypeScript strict mode enabled and provide asymptotic complexity analysis."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isInjecting || !newMemoryText.trim()}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isInjecting ? (
                    <span>Vectorizing & Embedding to Graph...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Commit to Persistent Memory</span>
                    </>
                  )}
                </button>
              </form>

              {/* Memory Security Guarantee */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>AES-256 GCM encrypted at rest</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Zero-knowledge client-side encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
