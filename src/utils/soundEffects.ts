/**
 * Futuristic Web Audio API sound synthesizer for authentic Jarvis / Maximoff interaction cues.
 * Generates deep bass startup sweep, high-pitched resonance, vocal beeps, and telemetry chimes.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true; // Default enabled for direct portal experience

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (enabled && !audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    } catch {
      // AudioContext not supported
    }
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function getAudioContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    } catch {
      // not supported
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Typical iconic cinematic sci-fi AI intro sound effect:
 * 1. Deep sub-bass reactor drop (35Hz -> 85Hz)
 * 2. High-pitched magnetic charging sweep (300Hz -> 3200Hz)
 * 3. Double biometric authorization chirp (1800Hz & 2400Hz)
 * 4. Resonant ethereal synth chord resolving the boot sequence
 */
export function playIntroSignatureSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Reactor Boom
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(38, now);
    subOsc.frequency.exponentialRampToValueAtTime(75, now + 1.2);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.0);

    // 2. High-Pitched Plasma Whine / Charge
    const plasmaOsc = ctx.createOscillator();
    const plasmaFilter = ctx.createBiquadFilter();
    const plasmaGain = ctx.createGain();

    plasmaOsc.type = 'sawtooth';
    plasmaFilter.type = 'bandpass';
    plasmaFilter.Q.setValueAtTime(10, now);

    plasmaOsc.frequency.setValueAtTime(250, now + 0.1);
    plasmaOsc.frequency.exponentialRampToValueAtTime(3400, now + 1.3);

    plasmaFilter.frequency.setValueAtTime(320, now + 0.1);
    plasmaFilter.frequency.exponentialRampToValueAtTime(3800, now + 1.3);

    plasmaGain.gain.setValueAtTime(0.001, now);
    plasmaGain.gain.linearRampToValueAtTime(0.14, now + 0.35);
    plasmaGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    plasmaOsc.connect(plasmaFilter);
    plasmaFilter.connect(plasmaGain);
    plasmaGain.connect(ctx.destination);
    plasmaOsc.start(now + 0.1);
    plasmaOsc.stop(now + 1.5);

    // 3. Biometric Chirp (Distinct high-pitch double pulse)
    [0.9, 1.05].forEach((t, i) => {
      const beepOsc = ctx.createOscillator();
      const beepGain = ctx.createGain();
      beepOsc.type = 'sine';
      beepOsc.frequency.setValueAtTime(i === 0 ? 1960 : 2620, now + t);
      beepGain.gain.setValueAtTime(0.1, now + t);
      beepGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);

      beepOsc.connect(beepGain);
      beepGain.connect(ctx.destination);
      beepOsc.start(now + t);
      beepOsc.stop(now + t + 0.08);
    });

    // 4. Harmonic Holographic Chime (A5, C#6, E6, A6)
    const chord = [880, 1108.7, 1318.5, 1760];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 1.2 + idx * 0.06);

      gain.gain.setValueAtTime(0.08, now + 1.2 + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 1.2 + idx * 0.06);
      osc.stop(now + 2.3);
    });
  } catch {
    // Graceful fallback
  }
}

export function playLockdownSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Heavy hydraulic latch slam
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // Warning alert chime
    const alertOsc = ctx.createOscillator();
    const alertGain = ctx.createGain();
    alertOsc.type = 'sine';
    alertOsc.frequency.setValueAtTime(440, now + 0.15);
    alertOsc.frequency.setValueAtTime(370, now + 0.35);
    alertGain.gain.setValueAtTime(0.12, now + 0.15);
    alertGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    alertOsc.connect(alertGain);
    alertGain.connect(ctx.destination);
    alertOsc.start(now + 0.15);
    alertOsc.stop(now + 0.55);
  } catch {
    // Graceful fallback
  }
}

export function playUnlockSuccessSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Positive authorization sequence: 3-note ascending biometric confirmation
    const freqs = [659.25, 880, 1318.5]; // E5, A5, E6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.1, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.18);
    });
  } catch {
    // Graceful fallback
  }
}

export function playAccessDeniedSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual low buzzer
    [0, 0.15].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now + t);

      gain.gain.setValueAtTime(0.15, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.12);
    });
  } catch {
    // Graceful fallback
  }
}

export function playFileSearchSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Rapid data search blips
    [0, 0.05, 0.1].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 + i * 280, now + t);

      gain.gain.setValueAtTime(0.06, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.04);
    });
  } catch {
    // Graceful fallback
  }
}

export function playOrderExecutionSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(1480, now + 0.09);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Graceful silence
  }
}




export function playHoloClick(frequency = 1200, duration = 0.04) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Graceful silence
  }
}

export function playCorePulseSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Graceful silence
  }
}

export function playSuccessChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.04);

      gain.gain.setValueAtTime(0.05, ctx.currentTime + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.04 + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.04);
      osc.stop(ctx.currentTime + index * 0.04 + 0.1);
    });
  } catch {
    // Graceful silence
  }
}
