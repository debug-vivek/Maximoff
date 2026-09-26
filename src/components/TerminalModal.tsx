import React from 'react';
import { TerminalConsole } from './TerminalConsole';
import { X, Maximize2 } from 'lucide-react';
import { playHoloClick } from '../utils/soundEffects';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (theme: 'cyan' | 'blue' | 'purple' | 'emerald') => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onThemeChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Maximoff Interactive Terminal Console"
      >
        <button
          onClick={() => {
            playHoloClick(600, 0.03);
            onClose();
          }}
          className="absolute -top-10 right-0 text-slate-400 hover:text-white p-1 text-xs font-mono flex items-center gap-1 cursor-pointer"
        >
          <span>CLOSE [ESC]</span>
          <X className="w-4 h-4" />
        </button>

        <TerminalConsole onThemeChange={onThemeChange} className="shadow-2xl shadow-cyan-500/20" />
      </div>
    </div>
  );
};
