import React, { useState } from 'react';
import { Check, ChevronDown, Sparkles, Shield, Cpu, Zap, Star } from 'lucide-react';
import { playHoloClick } from '../utils/soundEffects';

interface PricingTier {
  id: string;
  name: string;
  target: string;
  priceMonthly: number;
  priceAnnual: number;
  highlighted?: boolean;
  features: string[];
  specs: {
    latency: string;
    memoryVectors: string;
    concurrency: string;
    hardwareBridges: string;
  };
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Personal Core',
    target: 'For individual developers and tinkerers',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '100% on-device local neural inference',
      'Standard wake-word detection ("Hey Maximoff")',
      'Basic voice synthesis & terminal CLI',
      'Community plugin marketplace access',
      'Local HNSW vector memory (up to 100K nodes)',
    ],
    specs: {
      latency: '85ms',
      memoryVectors: '100K',
      concurrency: '1 Stream',
      hardwareBridges: '5 Devices',
    },
  },
  {
    id: 'pro',
    name: 'Cybernetic Architect',
    target: 'For power users, robotics labs, and smart home pros',
    priceMonthly: 49,
    priceAnnual: 39,
    highlighted: true,
    features: [
      'Sub-45ms multi-modal tensor acceleration',
      'Full 468-point spatial LiDAR vision & face tracking',
      'Custom wake-words and voice clone modeling',
      'Infinite episodic vector memory vault (10M+ nodes)',
      'ROS2 robotics & Matter physical actuators',
      'Proactive autonomous intervention daemon',
    ],
    specs: {
      latency: '42ms',
      memoryVectors: '10M+',
      concurrency: '4 Streams',
      hardwareBridges: 'Unlimited',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cluster',
    target: 'For aerospace facilities, defense research & institutions',
    priceMonthly: 299,
    priceAnnual: 239,
    features: [
      'Air-gapped on-premise hardware appliances',
      'Multi-operator biometric role-based clearance',
      'Sub-20ms ultra-deterministic RPC latency',
      'Custom CAN-bus & industrial PLC drivers',
      'Dedicated cybernetic security audit and 24/7 hotline',
      'Custom hardware design consult for bespoke rigs',
    ],
    specs: {
      latency: '18ms',
      memoryVectors: '1.4B+',
      concurrency: 'Unlimited',
      hardwareBridges: 'Air-Gapped Bus',
    },
  },
];

const FAQS = [
  {
    q: 'How does Maximoff differ from legacy assistants like Siri or Alexa?',
    a: 'Legacy cloud assistants are limited to brittle keyword lookups and upload your voice audio to corporate servers. Maximoff is a complete autonomous cybernetic platform: it processes voice, spatial LiDAR vision, and reasoning entirely on your local machine, features persistent episodic memory, and actuates physical robotics and smart hardware with sub-65ms latency.',
  },
  {
    q: 'Can Maximoff operate 100% offline without an internet connection?',
    a: 'Yes. The core neural models for voice synthesis, transcription, facial biometric tracking, and local reasoning are compiled to execute bare-metal on modern GPUs (NVIDIA RTX, Apple Silicon M-series, and AMD ROCm). Your data never leaves your local enclaves.',
  },
  {
    q: 'Can I train custom wake-words or clone my own voice tone?',
    a: 'Absolutely. The Voice Studio includes a few-shot wake-word trainer allowing you to establish custom phonetic call-signs (e.g. "Jarvis", "Aegis", "Maximoff") with 99.8% rejection of false positives, along with voice timbre modulation.',
  },
  {
    q: 'What hardware bridges and protocols are natively supported?',
    a: 'Maximoff supports Matter, Apple HomeKit, Zigbee, Z-Wave, ROS2 (Robot Operating System), CAN-bus microcontrollers, Philips Hue, and local Docker/Kubernetes container sockets.',
  },
  {
    q: 'Is this affiliated with Marvel, Iron Man, or Disney?',
    a: 'No. Maximoff is a 100% original, independent AI architecture inspired by futuristic holographic science-fiction aesthetics. It contains zero copyrighted Marvel code, logos, or assets.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Maximoff gave our autonomous aerospace laboratory a true real-time voice and vision brain. Our engineers control robotic actuators and review propulsion telemetry purely hands-free.',
    author: 'Dr. Elena Rostova',
    role: 'Lead Flight Systems Architect',
    org: 'Vanguard Aerospace Labs',
    avatar: '/src/assets/images/avatar_systems_architect_1790434215736.jpg',
  },
  {
    quote: 'The sub-45ms latency and offline episodic memory vault make standard cloud assistants feel prehistoric. It genuinely feels like living inside a futuristic sci-fi workshop.',
    author: 'Marcus Vance',
    role: 'Principal Robotics Engineer',
    org: 'Kinematic Dynamics',
    avatar: null,
  },
];

export const PricingAndFAQ: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleToggleFaq = (index: number) => {
    playHoloClick(1000, 0.02);
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Holographic Testimonials Section */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
              Field Deployments & Telemetry
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight mb-4">
              Tested by <span className="text-cyan-400 holo-glow-cyan">Pioneers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="holo-card rounded-2xl p-6 sm:p-8 border border-cyan-500/25 flex flex-col justify-between"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-1 text-cyan-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-cyan-400" />
                    ))}
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-850">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-12 h-12 rounded-full object-cover border border-cyan-400/60"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 font-bold font-display">
                      MV
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white font-display">
                      {t.author}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {t.role} · <span className="text-cyan-400">{t.org}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
            Transparent Cybernetic Tiers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Deployment <span className="text-cyan-400 holo-glow-cyan">Licensing</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            Choose your core configuration. Every tier includes local neural inference, zero telemetry selling, and full hardware bridge access.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs font-mono">
            <button
              onClick={() => {
                playHoloClick(900, 0.02);
                setAnnualBilling(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !annualBilling ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => {
                playHoloClick(900, 0.02);
                setAnnualBilling(true);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                annualBilling ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Core</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {TIERS.map((tier) => {
            const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;

            return (
              <div
                key={tier.id}
                className={`holo-card rounded-2xl p-8 border flex flex-col justify-between relative transition-all ${
                  tier.highlighted
                    ? 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.25)] bg-cyan-950/20 scale-100 lg:-translate-y-2'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-black tracking-wider uppercase">
                    RECOMMENDED FOR BUILDERS
                  </div>
                )}

                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    {tier.name}
                  </div>
                  <p className="text-xs text-slate-400 mb-6 min-h-[36px]">
                    {tier.target}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold font-display text-white">
                      ${price}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      / month {annualBilling && tier.priceMonthly > 0 ? '(billed annually)' : ''}
                    </span>
                  </div>

                  {/* Benchmark Specs Strip */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono mb-6">
                    <div>
                      <span className="text-slate-500 block">Latency:</span>
                      <span className="text-cyan-400 font-bold">{tier.specs.latency}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Memory:</span>
                      <span className="text-white font-bold">{tier.specs.memoryVectors}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  onClick={() => playHoloClick(1200, 0.03)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-center transition-all block cursor-pointer ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                  }`}
                >
                  {tier.id === 'free' ? 'Download Local Binary' : tier.id === 'pro' ? 'Deploy Cybernetic Core' : 'Request Enterprise Provisioning'}
                </a>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-2">
              Architecture Answers
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="holo-card rounded-xl border border-cyan-500/20 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => handleToggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold font-display text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 font-body leading-relaxed border-t border-slate-850 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
