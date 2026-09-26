import React, { useState } from 'react';
import { Eye, Scan, Target, FileText, Hand, Shield, ZoomIn, Square, Layers, Sparkles } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

type VisionMode = 'face' | 'objects' | 'ocr' | 'gestures';

export const VisionSection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<VisionMode>('face');
  const [showOverlays, setShowOverlays] = useState(true);
  const [showDepthMesh, setShowDepthMesh] = useState(false);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleModeSwitch = (mode: VisionMode) => {
    playHoloClick(1100, 0.03);
    setActiveMode(mode);
  };

  const handleSimulateGesture = (gestureName: string) => {
    playHoloClick(1400, 0.05);
    setActiveGesture(gestureName);

    if (gestureName === 'Pinch to Zoom') {
      setZoomLevel((prev) => (prev === 1 ? 1.3 : 1));
    }

    setTimeout(() => {
      setActiveGesture(null);
      playSuccessChime();
    }, 1800);
  };

  return (
    <section id="vision" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Spatial Perception & Holographic Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Computer Vision <span className="text-cyan-400 holo-glow-cyan">& Spatial HUD</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Endow your assistant with human-grade spatial awareness. Track 468 facial biometric landmarks, segment environmental objects with sub-millimeter depth, and execute touchless holographic gesture controls.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'face' as const, label: 'Face Recognition', icon: Scan },
            { id: 'objects' as const, label: '3D Object Tracking', icon: Target },
            { id: 'ocr' as const, label: 'Real-Time OCR Text', icon: FileText },
            { id: 'gestures' as const, label: 'Holographic Gestures', icon: Hand },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleModeSwitch(id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
                activeMode === id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Main Interactive Hologram Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Display Port (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="holo-card rounded-2xl overflow-hidden border border-cyan-500/30 relative group">
              {/* Top Viewport Header */}
              <div className="bg-slate-950/80 px-4 py-2.5 border-b border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-300 font-semibold tracking-wider">
                    OPTICAL ENCLAVE 01 // 4K 60FPS LIDAR
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>FPS: 60.0</span>
                  <span className="text-emerald-400">DEPTH: 0.12M - 48.0M</span>
                </div>
              </div>

              {/* Feed Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src="/src/assets/images/holographic_vision_feed_1790434175597.jpg"
                  alt="Maximoff Computer Vision Spatial Telemetry Feed"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    zoomLevel > 1 ? 'scale-125' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to high tech CSS grid
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Scanlines & Holographic Grid Overlay */}
                <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />
                <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30" />

                {/* Overlays conditioned on mode */}
                {showOverlays && (
                  <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    {/* Mode: Face Recognition Overlay */}
                    {activeMode === 'face' && (
                      <>
                        <div className="absolute top-1/4 left-1/3 w-48 h-48 border-2 border-cyan-400/80 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex flex-col justify-between p-2">
                          <div className="flex justify-between items-start text-[10px] font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded">
                            <span>OPERATOR IDENTIFIED</span>
                            <span className="text-emerald-400">99.8%</span>
                          </div>
                          <div className="w-full flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border border-cyan-400/40 border-dashed animate-spin [animation-duration:8s]" />
                          </div>
                          <div className="text-[9px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded flex justify-between">
                            <span>PULSE: 72 BPM</span>
                            <span>DIST: 0.84M</span>
                          </div>
                        </div>

                        <div className="self-end bg-black/70 border border-cyan-500/40 p-2.5 rounded-lg text-[10px] font-mono text-cyan-300 space-y-1">
                          <div>468 BIOMETRIC MESH POINTS</div>
                          <div className="text-slate-400">ATTENTION: FOCUSED ON HUD</div>
                          <div className="text-emerald-400">ACCESS LEVEL: STARK CLEARANCE</div>
                        </div>
                      </>
                    )}

                    {/* Mode: 3D Object Detection Overlay */}
                    {activeMode === 'objects' && (
                      <>
                        {/* Box 1 */}
                        <div className="absolute top-16 left-12 w-44 h-36 border border-emerald-400/80 bg-emerald-500/5 p-1.5">
                          <span className="text-[10px] font-mono text-emerald-300 bg-black/70 px-1 py-0.5 rounded block w-fit">
                            WORKSTATION RIG [98.4%]
                          </span>
                        </div>
                        {/* Box 2 */}
                        <div className="absolute bottom-16 right-20 w-52 h-40 border border-blue-400/80 bg-blue-500/5 p-1.5">
                          <span className="text-[10px] font-mono text-blue-300 bg-black/70 px-1 py-0.5 rounded block w-fit">
                            ROBOTIC ACTUATOR [99.1%]
                          </span>
                        </div>
                        <div className="self-start bg-black/70 border border-emerald-500/40 p-2 rounded text-[10px] font-mono text-emerald-300">
                          DETECTED: 6 HARDWARE ANCHORS
                        </div>
                      </>
                    )}

                    {/* Mode: Real-Time OCR Text Scanner Overlay */}
                    {activeMode === 'ocr' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/80 border border-cyan-400/80 p-4 rounded-xl max-w-sm text-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                          <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                            OPTICAL TEXT RECOGNITION (OCR)
                          </div>
                          <div className="text-xs text-slate-200 font-mono bg-slate-900 p-2 rounded border border-slate-700 mb-2">
                            "MAXIMOFF PROTOCOL: REASONING LEVEL 5 AUTHORIZED"
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">
                            TRANSLATED & INDEXED TO VECTOR MEMORY IN 12MS
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mode: Gesture Control Simulator Overlay */}
                    {activeMode === 'gestures' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {activeGesture ? (
                          <div className="bg-cyan-950/90 border border-cyan-400 p-4 rounded-xl text-center animate-in zoom-in-95 duration-200">
                            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
                            <div className="text-sm font-bold text-white font-display mb-1">
                              GESTURE EXECUTED: {activeGesture}
                            </div>
                            <div className="text-xs font-mono text-cyan-300">
                              Hologram display adjusted instantaneously.
                            </div>
                          </div>
                        ) : (
                          <div className="bg-black/70 border border-slate-700 p-3 rounded-xl text-center text-xs font-mono text-slate-300">
                            Perform or click a gesture on the right to test spatial interaction.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Viewport Control Bar */}
              <div className="bg-slate-950/90 p-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      playHoloClick(900, 0.03);
                      setShowOverlays(!showOverlays);
                    }}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      showOverlays ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    Holo Overlays: {showOverlays ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => {
                      playHoloClick(900, 0.03);
                      setZoomLevel((prev) => (prev === 1 ? 1.25 : 1));
                    }}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      zoomLevel > 1 ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Zoom: {zoomLevel}x
                  </button>
                </div>

                <div className="text-slate-400 text-[11px]">
                  LATENCY: <span className="text-cyan-400 font-bold">14MS</span> · ZERO CLOUD UPLOAD
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Control & Details Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25">
              <h3 className="text-base font-semibold text-white mb-2 font-display flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Vision Pipeline Specifications
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Powered by Maximoff's local edge tensor pipeline. Every frame is processed on your local GPU with strict zero-knowledge encryption.
              </p>

              {/* Gesture Controls Interactive Grid */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-mono text-cyan-400 font-semibold mb-2">
                  Interactive Gesture Triggers:
                </div>
                {[
                  { name: 'Pinch to Zoom', desc: 'Scales holographic viewport 1.25x' },
                  { name: 'Palm Stop', desc: 'Halts autonomous hardware actuation' },
                  { name: 'Swipe Switch', desc: 'Cycles workspace monitor enclaves' },
                ].map(({ name, desc }) => (
                  <button
                    key={name}
                    onClick={() => handleSimulateGesture(name)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 font-display block">
                        {name}
                      </span>
                      <span className="text-[11px] text-slate-400">{desc}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                      TEST
                    </span>
                  </button>
                ))}
              </div>

              {/* Security & Architecture Trust Matrix */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Data Privacy:
                  </span>
                  <span className="text-emerald-400 font-bold">100% On-Device</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>LiDAR Resolution:</span>
                  <span className="text-white">Sub-1mm Point Cloud</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Max Tracked Targets:</span>
                  <span className="text-white">64 Entities at 60Hz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
