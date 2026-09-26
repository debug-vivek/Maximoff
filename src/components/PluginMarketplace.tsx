import React, { useState } from 'react';
import { Package, Search, Download, Check, ExternalLink, Cpu, Terminal, Shield, Sparkles } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

interface PluginItem {
  id: string;
  name: string;
  category: 'iot' | 'dev' | 'finance' | 'spatial' | 'productivity';
  version: string;
  author: string;
  description: string;
  downloads: string;
  installed: boolean;
  permissions: string[];
}

const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'matter-iot',
    name: 'Matter & HomeKit Smart Hub',
    category: 'iot',
    version: '2.4.1',
    author: 'Maximoff Core Team',
    description: 'Autonomous control bridge for 500+ local smart lights, locks, HVAC thermostats, and motion sensors.',
    downloads: '142K',
    installed: true,
    permissions: ['Local Network', 'Hardware Actuation'],
  },
  {
    id: 'ros2-robotics',
    name: 'ROS2 Robotics Kinematics Bridge',
    category: 'iot',
    version: '1.9.0',
    author: 'Stark Cybernetics Lab',
    description: 'Sub-millimeter robotic arm trajectory calculation, SLAM navigation, and CAN-bus actuator control.',
    downloads: '88K',
    installed: true,
    permissions: ['CAN Bus', 'Serial Ports', 'LiDAR Feed'],
  },
  {
    id: 'shell-daemon',
    name: 'Terminal Sandbox Daemon',
    category: 'dev',
    version: '3.1.0',
    author: 'Maximoff Systems',
    description: 'Autonomous Linux/macOS shell execution inside isolated Docker containers with automated rollback.',
    downloads: '210K',
    installed: true,
    permissions: ['Process Spawning', 'Container Socket'],
  },
  {
    id: 'obsidian-vault',
    name: 'Obsidian Second Brain Neural Link',
    category: 'productivity',
    version: '2.0.4',
    author: 'Neural Synapse Community',
    description: 'Bi-directional markdown sync, automatic concept linking, and daily holographic journaling.',
    downloads: '95K',
    installed: false,
    permissions: ['File System (Vault Read/Write)'],
  },
  {
    id: 'finance-stream',
    name: 'Alpha Quant Financial Telemetry',
    category: 'finance',
    version: '4.2.0',
    author: 'Apex Capital AI',
    description: 'Tick-by-tick market monitoring, SEC 10-K parsing, portfolio risk simulation, and anomaly alerts.',
    downloads: '64K',
    installed: false,
    permissions: ['Financial API', 'WebSocket Feeds'],
  },
  {
    id: 'blender-spatial',
    name: 'Blender 3D Spatial Mesh Rig',
    category: 'spatial',
    version: '1.5.2',
    author: 'Spatial Lab 9',
    description: 'Direct holographic viewport link to Blender 4.x. Sculpt and rotate 3D geometries via voice and gestures.',
    downloads: '73K',
    installed: false,
    permissions: ['IPC Socket', 'GPU Texture Sharing'],
  },
  {
    id: 'bio-sensors',
    name: 'Biometric Vitals & Sleep Matrix',
    category: 'iot',
    version: '2.1.8',
    author: 'Biotech Systems',
    description: 'Aggregates real-time HRV, body temp, and cognitive strain to modulate assistant pacing and lighting.',
    downloads: '51K',
    installed: false,
    permissions: ['HealthKit / BLE Sensors'],
  },
  {
    id: 'github-agent',
    name: 'GitHub Autonomous Code Enclave',
    category: 'dev',
    version: '3.0.1',
    author: 'Maximoff DevRel',
    description: 'Reviews pull requests, creates automated test suites, and fixes production regression stack traces.',
    downloads: '180K',
    installed: true,
    permissions: ['GitHub OAuth', 'Repo Read/Write'],
  },
];

export const PluginMarketplace: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginItem[]>(INITIAL_PLUGINS);
  const [filterCategory, setFilterCategory] = useState<'all' | 'iot' | 'dev' | 'finance' | 'spatial' | 'productivity'>('all');
  const [search, setSearch] = useState('');

  const filteredPlugins = plugins.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleInstall = (id: string) => {
    playHoloClick(1200, 0.04);
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.installed;
          if (nextState) playSuccessChime();
          return { ...p, installed: nextState };
        }
        return p;
      })
    );
  };

  return (
    <section id="extensions" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Modular Ecosystem & Enclaves
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Plugin & Skill <span className="text-cyan-400 holo-glow-cyan">Marketplace</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Expand your assistant's capabilities with over 400 community and verified modules. Install local smart-home bridges, robotics kinematics, financial feeds, and dev containers with a single command.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            {[
              { id: 'all' as const, label: 'All Modules' },
              { id: 'iot' as const, label: 'Hardware & IoT' },
              { id: 'dev' as const, label: 'Developer Tools' },
              { id: 'productivity' as const, label: 'Productivity' },
              { id: 'finance' as const, label: 'Finance' },
              { id: 'spatial' as const, label: 'Spatial 3D' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  playHoloClick(900, 0.02);
                  setFilterCategory(id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  filterCategory === id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plugins & skills..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className={`holo-card rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                plugin.installed
                  ? 'border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-sm font-bold text-white font-display line-clamp-1">
                    {plugin.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 shrink-0">
                    v{plugin.version}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500 mb-2">
                  By {plugin.author} · {plugin.downloads} installs
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {plugin.description}
                </p>

                {/* Permissions tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {plugin.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Install Button */}
              <div className="pt-3 border-t border-slate-850">
                <button
                  onClick={() => handleToggleInstall(plugin.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    plugin.installed
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/40'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {plugin.installed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Installed in Core</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Mount to Assistant</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
