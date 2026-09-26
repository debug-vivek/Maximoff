import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Radio, Play, Pause, Waves, Sliders, Check } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

interface VoiceProfile {
  id: string;
  name: string;
  accent: string;
  pitch: number;
  rate: number;
  sampleText: string;
  description: string;
}

const VOICES: VoiceProfile[] = [
  {
    id: 'british-classic',
    name: 'Lord Regent (Classic Jarvis)',
    accent: 'British Received Pronunciation',
    pitch: 0.95,
    rate: 1.02,
    sampleText: 'Good evening. All diagnostic sub-routines are nominal, and the holographic telemetry array is standing by.',
    description: 'Crisp, measured, highly distinguished British butler cadence with effortless refinement.',
  },
  {
    id: 'tactical-prime',
    name: 'Aegis Tactical',
    accent: 'Neutral Transatlantic',
    pitch: 0.85,
    rate: 1.15,
    sampleText: 'Target acquired. Sensor lock verified across primary thermal spectrums. Ready for orbital vectoring.',
    description: 'Fast, authoritative, military command voice engineered for high-stress operational execution.',
  },
  {
    id: 'friday-warm',
    name: 'Friday Cyber-Femme',
    accent: 'Irish Modern',
    pitch: 1.1,
    rate: 1.05,
    sampleText: 'Right then! Power conduits are synced and the workshop atmospheric scrubbers are dialed in at 100%.',
    description: 'Warm, adaptive, conversational warmth inspired by modern personal flight assistants.',
  },
  {
    id: 'quantum-synth',
    name: 'Quantum Core Horizon',
    accent: 'Pure Synthesized Clean',
    pitch: 1.0,
    rate: 1.0,
    sampleText: 'Analyzing 400 terabytes of multi-spectral telemetry. Zero anomalies detected in quadrant four.',
    description: 'Ultra-pure neutral cadence engineered for zero cognitive fatigue during long research sessions.',
  },
];

export const VoiceStudio: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(VOICES[0]);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState(85);
  const [wakeWord, setWakeWord] = useState('Hey Maximoff');
  const [transcribedText, setTranscribedText] = useState('Awaiting wake word activation or manual mic input...');
  const [audioBars, setAudioBars] = useState<number[]>(new Array(24).fill(10));

  // Audio Spectrum Simulation
  useEffect(() => {
    let animId: number;
    const updateSpectrum = () => {
      if (isListening || isPlayingPreview) {
        setAudioBars((prev) =>
          prev.map(() => Math.floor(15 + Math.random() * 80))
        );
      } else {
        setAudioBars((prev) =>
          prev.map((val) => Math.max(8, val * 0.9))
        );
      }
      animId = requestAnimationFrame(updateSpectrum);
    };

    const interval = setInterval(updateSpectrum, 80);
    return () => clearInterval(interval);
  }, [isListening, isPlayingPreview]);

  const handlePlayVoicePreview = (voice: VoiceProfile) => {
    playHoloClick(1200, 0.04);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingPreview(voice.id);

      const utter = new SpeechSynthesisUtterance(voice.sampleText);
      utter.pitch = voice.pitch;
      utter.rate = voice.rate;

      // Try selecting a matching voice from system voices if available
      const systemVoices = window.speechSynthesis.getVoices();
      if (voice.id === 'british-classic') {
        const ukVoice = systemVoices.find((v) => v.lang.includes('en-GB') || v.name.includes('UK') || v.name.includes('British'));
        if (ukVoice) utter.voice = ukVoice;
      }

      utter.onend = () => setIsPlayingPreview(null);
      utter.onerror = () => setIsPlayingPreview(null);

      window.speechSynthesis.speak(utter);
    } else {
      setIsPlayingPreview(voice.id);
      setTimeout(() => setIsPlayingPreview(null), 2500);
    }
  };

  const handleToggleMic = () => {
    playHoloClick(isListening ? 700 : 1300, 0.05);
    if (!isListening) {
      setIsListening(true);
      setTranscribedText('Listening for audio input... (Speak now)');

      // Try Web Speech Recognition
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join('');
            setTranscribedText(`Detected: "${transcript}"`);
          };
          recognition.onerror = () => {
            // Fallback simulation
            setTimeout(() => {
              setTranscribedText(`Simulated: "Hey Maximoff, verify laboratory atmospheric levels."`);
              setIsListening(false);
              playSuccessChime();
            }, 2500);
          };
          recognition.onend = () => {
            setIsListening(false);
          };
          recognition.start();
          return;
        } catch {
          // Fallback simulation below
        }
      }

      // Simulated speech recognition fallback
      setTimeout(() => {
        setTranscribedText(`Simulated Voice: "Hey Maximoff, initiate flight telemetry diagnostic."`);
        setIsListening(false);
        playSuccessChime();
      }, 3000);
    } else {
      setIsListening(false);
      setTranscribedText('Mic session terminated. Core on standby.');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <section id="voice-studio" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Acoustic & Neural Audio Synthesis
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Voice Assistant <span className="text-cyan-400 holo-glow-cyan">Studio</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Configure sub-50ms acoustic wake-words, multi-spectral noise cancellation, and high-fidelity vocal synthesizers designed for instant hands-free conversation.
          </p>
        </div>

        {/* Studio Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Waveform & Live Mic Console (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
                      ACOUSTIC DSP SPECTRUM
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800">
                    48KHZ · 24-BIT
                  </span>
                </div>

                {/* Animated Spectrum Waveform */}
                <div className="h-32 bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex items-end justify-center gap-1.5 mb-6 overflow-hidden">
                  {audioBars.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 via-cyan-400 to-cyan-200 rounded-t transition-all duration-75"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                {/* Microphone Activation Button */}
                <div className="flex flex-col items-center justify-center space-y-4 mb-6">
                  <button
                    onClick={handleToggleMic}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white shadow-[0_0_35px_rgba(244,63,94,0.6)] animate-pulse'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 hover:bg-cyan-500/30 hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                    }`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  >
                    {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                  </button>
                  <div className="text-center">
                    <span className="text-xs font-mono font-semibold text-white block">
                      {isListening ? 'LISTENING LIVE...' : 'CLICK TO INITIALIZE MIC TEST'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isListening ? 'Speak your command aloud' : 'Simulates local wake-word trigger'}
                    </span>
                  </div>
                </div>

                {/* Live Transcription Box */}
                <div className="p-3.5 bg-slate-950/90 rounded-xl border border-cyan-500/20 font-mono text-xs text-slate-300">
                  <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-between">
                    <span>SPEECH-TO-TEXT BUFFER</span>
                    <span className="text-cyan-400">LATENCY: 24MS</span>
                  </div>
                  <div className="text-cyan-200 italic">{transcribedText}</div>
                </div>
              </div>

              {/* Wake Word & Sensitivity Sliders */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Wake Word Designation
                  </label>
                  <input
                    type="text"
                    value={wakeWord}
                    onChange={(e) => setWakeWord(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Mic Sensitivity Threshold</span>
                    <span className="text-cyan-400 font-bold tabular-nums">{sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Voice Synthesis Library (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="holo-card rounded-2xl p-6 border border-cyan-500/25">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 font-display">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  Neural Vocal Synthesizer Library
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  4 CONFIGURED ARCHETYPES
                </span>
              </div>

              <div className="space-y-3.5">
                {VOICES.map((voice) => {
                  const isSelected = selectedVoice.id === voice.id;
                  const isPlaying = isPlayingPreview === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => {
                        playHoloClick(1000, 0.03);
                        setSelectedVoice(voice);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-display text-white">
                              {voice.name}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                              {voice.accent}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {voice.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVoicePreview(voice);
                          }}
                          className={`p-2.5 rounded-lg border flex items-center gap-1.5 transition-all text-xs font-mono font-medium shrink-0 ${
                            isPlaying
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                              : 'bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-500 hover:text-white'
                          }`}
                          aria-label={`Preview sample for ${voice.name}`}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Speaking</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Sample quote */}
                      <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 italic">
                        "{voice.sampleText}"
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Acoustic Capabilities Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800 font-mono text-[11px]">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block">Echo Suppression</span>
                  <span className="text-emerald-400 font-semibold font-mono">48 dB Active Cancellation</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block">Cold Wake Latency</span>
                  <span className="text-cyan-400 font-semibold font-mono">38 Milliseconds</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-850">
                  <span className="text-slate-500 block">Offline Mode</span>
                  <span className="text-white font-semibold font-mono">100% On-Device Neural</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
