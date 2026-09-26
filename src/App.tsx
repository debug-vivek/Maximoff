/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BootSequence } from './components/BootSequence';
import { VoiceAIPortal } from './components/VoiceAIPortal';
import { TerminalModal } from './components/TerminalModal';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [coreTheme, setCoreTheme] = useState<'cyan' | 'blue' | 'purple' | 'emerald'>('cyan');

  // Shortcut: Cmd+K / Ctrl+K opens Terminal CLI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 1. Cinematic Starting Animation with Deep & High-Pitched Sound */}
      {booting ? (
        <BootSequence onComplete={() => setBooting(false)} />
      ) : (
        /* 2. Direct Voice-AI Assistant Portal */
        <VoiceAIPortal />
      )}

      {/* Interactive Terminal Modal [Cmd+K] */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onThemeChange={setCoreTheme}
      />
    </div>
  );
}
