import React, { useState } from 'react';
import { Send, CheckCircle2, Shield, Fingerprint, MessageSquare, Github, Disc as Discord, Twitter, Sparkles, Mail } from 'lucide-react';
import { playHoloClick, playSuccessChime } from '../utils/soundEffects';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Robotics Engineer',
    hardwareTarget: 'Apple Silicon / NVIDIA RTX',
    message: '',
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Please specify both your call-sign name and valid communications email.');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    playHoloClick(1400, 0.05);

    setTimeout(() => {
      setIsVerifying(false);
      setSubmitted(true);
      playSuccessChime();
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Community & Direct Transmission (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
              Secure Uplink & Community Hub
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Request <span className="text-cyan-400 holo-glow-cyan">Core Access</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Connect with our cybernetics systems team to provision bespoke hardware bridges, deploy air-gapped clusters, or collaborate on open-source neural modules.
            </p>

            {/* Community Links */}
            <div id="community" className="space-y-3 pt-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Join Developer Enclaves:
              </div>

              {[
                { name: 'Maximoff Neural Discord', count: '14,200 Architects Online', icon: Discord },
                { name: 'GitHub Open Architecture', count: '38.4K Stars · 2.1K Forks', icon: Github },
                { name: 'Dispatches on X / Twitter', count: '@MaximoffCore Telemetry', icon: Twitter },
              ].map(({ name, count, icon: Icon }) => (
                <div
                  key={name}
                  onClick={() => playHoloClick(1000, 0.02)}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white font-display block">
                        {name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{count}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Futuristic Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="holo-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 relative">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Transmission Encrypted & Dispatched
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-md mx-auto leading-relaxed">
                    Identity verified for {formData.name}. Our cybernetics systems architect will transmit your local SDK activation bundle within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        role: 'Robotics Engineer',
                        hardwareTarget: 'Apple Silicon / NVIDIA RTX',
                        message: '',
                      });
                    }}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 rounded-xl transition-all cursor-pointer"
                  >
                    Transmit Another Signal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-2">
                    <span className="text-xs font-mono text-cyan-400 tracking-wider flex items-center gap-1.5">
                      <Fingerprint className="w-4 h-4" />
                      OPERATOR IDENTITY VERIFICATION
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">AES-256 GCM SECURED</span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Call-Sign / Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tony Stark"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Communications Channel (Email)
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="operator@laboratory.io"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Primary Engineering Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="Robotics Engineer">Robotics & Autonomous Systems</option>
                        <option value="Smart Home Architect">Smart Home & IoT Architect</option>
                        <option value="AI Researcher">Applied AI / Neuro-Symbolic</option>
                        <option value="Defense Contractor">Aerospace / Defense Contractor</option>
                        <option value="Independent Developer">Independent Developer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Deployment Hardware Rig
                      </label>
                      <input
                        type="text"
                        value={formData.hardwareTarget}
                        onChange={(e) => setFormData({ ...formData, hardwareTarget: e.target.value })}
                        placeholder="e.g. Dual NVIDIA RTX 4090 / ROS2"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Intended Assistant Capabilities & Mission Scope
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your lab, autonomous hardware ambitions, or custom tool requirements..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <Fingerprint className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Verifying Biometric Hash & Dispatched...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Signal & Request Access Bundle</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
