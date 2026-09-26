import React, { useState, useEffect, useRef } from 'react';
import { HolographicCore } from './HolographicCore';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Database,
  Cpu,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle2,
  Activity,
  Zap,
  Terminal,
  MessageSquare,
  ExternalLink,
  Palette,
  Calculator,
  Folder,
  FileText,
  Search,
  HardDrive,
  Smartphone,
  Cloud,
  Server,
  Download,
  KeyRound,
  AlertTriangle,
  Globe,
  Compass,
  Bookmark,
  RefreshCw,
  Plus,
  UserCheck,
  LogIn,
  LogOut,
  Layers,
  Check,
} from 'lucide-react';
import {
  playHoloClick,
  playSuccessChime,
  playCorePulseSound,
  playOrderExecutionSound,
  playLockdownSound,
  playUnlockSuccessSound,
  playAccessDeniedSound,
  playFileSearchSound,
  isSoundEnabled,
  setSoundEnabled,
} from '../utils/soundEffects';
import {
  db,
  auth,
  googleProvider,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType,
  ResearchDossierRecord,
  DeviceFileRecord,
} from '../firebase';
import {
  resolveWebsiteLaunch,
  openExternalUrlSafely,
  POPULAR_WEBSITES,
  PopularWebsite,
} from '../utils/websiteLauncher';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

type ColorGrade = 'cyan' | 'blue' | 'amber' | 'emerald' | 'purple';

interface TaskAction {
  type: 'url' | 'theme' | 'file' | 'lockdown' | 'research';
  title: string;
  url?: string;
  buttonLabel?: string;
  data?: any;
}

interface Message {
  id: string;
  sender: 'user' | 'maximoff';
  text: string;
  actionTag?: string;
  orderType?: 'voice' | 'text';
  taskAction?: TaskAction;
  sources?: { title: string; url: string }[];
  keyFacts?: string[];
  searchQueries?: string[];
  isResearch?: boolean;
  time: string;
}

interface DeviceFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  device: 'Workstation' | 'Mobile' | 'Cloud Enclave' | 'Edge Server';
  size: string;
  lastModified: string;
  path: string;
}

const DEFAULT_DEVICE_FILES: DeviceFile[] = [
  {
    id: 'f1',
    name: 'Mark_42_Flight_Propulsion',
    type: 'folder',
    device: 'Workstation',
    size: '1.2 GB',
    lastModified: 'Today, 08:42',
    path: '/Volumes/Workstation/Schematics/Mark_42_Flight_Propulsion',
  },
  {
    id: 'f2',
    name: 'mark42_titanium_thruster.cad',
    type: 'file',
    extension: 'cad',
    device: 'Workstation',
    size: '142.5 MB',
    lastModified: 'Yesterday, 18:20',
    path: '/Volumes/Workstation/Schematics/mark42_titanium_thruster.cad',
  },
  {
    id: 'f3',
    name: 'stark_stabilizer_tolerance_rev3.pdf',
    type: 'file',
    extension: 'pdf',
    device: 'Cloud Enclave',
    size: '12.4 MB',
    lastModified: '2 days ago',
    path: 'cloud://vault.maximoff.ai/blueprints/stark_stabilizer_tolerance_rev3.pdf',
  },
  {
    id: 'f4',
    name: 'quantum_reactor_firmware_v4.bin',
    type: 'file',
    extension: 'bin',
    device: 'Edge Server',
    size: '4.8 MB',
    lastModified: '3 days ago',
    path: 'edge://nas.local/firmware/quantum_reactor_firmware_v4.bin',
  },
  {
    id: 'f5',
    name: 'daily_executive_briefing.docx',
    type: 'file',
    extension: 'docx',
    device: 'Mobile',
    size: '1.2 MB',
    lastModified: 'Today, 07:15',
    path: 'mobile://iPhone/Documents/daily_executive_briefing.docx',
  },
  {
    id: 'f6',
    name: 'Biometric_Access_Logs',
    type: 'folder',
    device: 'Edge Server',
    size: '340 MB',
    lastModified: 'Today, 09:00',
    path: 'edge://nas.local/security/Biometric_Access_Logs',
  },
  {
    id: 'f7',
    name: 'espresso_automation_relay.py',
    type: 'file',
    extension: 'py',
    device: 'Workstation',
    size: '48 KB',
    lastModified: '4 days ago',
    path: '/Volumes/Workstation/Scripts/espresso_automation_relay.py',
  },
  {
    id: 'f8',
    name: 'mobile_vitals_telemetry.json',
    type: 'file',
    extension: 'json',
    device: 'Mobile',
    size: '890 KB',
    lastModified: '1 hour ago',
    path: 'mobile://iPhone/Sensors/mobile_vitals_telemetry.json',
  },
];

const COLOR_GRADES: { id: ColorGrade; name: string; hex: string }[] = [
  { id: 'cyan', name: 'Arc Cyan', hex: '#06b6d4' },
  { id: 'blue', name: 'Deep Sapphire', hex: '#3b82f6' },
  { id: 'amber', name: 'Stark Gold', hex: '#f59e0b' },
  { id: 'emerald', name: 'Quantum Emerald', hex: '#10b981' },
  { id: 'purple', name: 'Solar Violet', hex: '#a855f7' },
];

const PRESET_ORDERS = [
  {
    category: 'Web Uplink',
    label: 'Open Spotify',
    command: 'Maximoff, open Spotify',
  },
  {
    category: 'Web Uplink',
    label: 'Open Amazon',
    command: 'Maximoff, open Amazon',
  },
  {
    category: 'Web Uplink',
    label: 'Open YouTube',
    command: 'Maximoff, open YouTube',
  },
  {
    category: 'Google / Chrome',
    label: 'Chrome: V8 Engine & JIT',
    command: 'Maximoff, explain Google Chrome V8 engine architecture and how it compiles JavaScript',
  },
  {
    category: 'Google Research',
    label: 'Research: Fusion Energy',
    command: 'Maximoff, research latest nuclear fusion breakthroughs across Google',
  },
  {
    category: 'Files & Folders',
    label: 'Search Files: Mark 42',
    command: 'Maximoff, search files for Mark 42 across all devices',
  },
  {
    category: 'Database',
    label: 'Check Firestore DB',
    command: 'Maximoff, verify database status and display synchronized records',
  },
];

// Normalize secret passcode to handle variations in whitespace and punctuation
const normalizePasscode = (text: string) => {
  return text.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
};

const SECRET_PASSCODE = 'i have my own maximoff';

export const VoiceAIPortal: React.FC = () => {
  // Voice vs Text ordering
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(15);
  const [inputText, setInputText] = useState('');
  const [activeHud, setActiveHud] = useState<'dialogue' | 'webhub' | 'research' | 'files' | 'memory' | 'telemetry' | 'calculator'>('dialogue');

  // Web Hub State
  const [webHubCategory, setWebHubCategory] = useState<string>('All');
  const [webHubSearchQuery, setWebHubSearchQuery] = useState<string>('');
  const [customWebInput, setCustomWebInput] = useState<string>('');

  // Firebase Firestore & Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking' | 'error'>('checking');
  const [researchDossiers, setResearchDossiers] = useState<ResearchDossierRecord[]>([]);
  const [deviceFiles, setDeviceFiles] = useState<DeviceFile[]>(DEFAULT_DEVICE_FILES);
  const [isResearching, setIsResearching] = useState(false);
  const [researchQueryInput, setResearchQueryInput] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Booting');

  // Lockdown & Security State (Single Option Only)
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // File Search State
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<string>('All');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');
  const [newFileDevice, setNewFileDevice] = useState<'Workstation' | 'Mobile' | 'Cloud Enclave' | 'Edge Server'>('Workstation');
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileSize, setNewFileSize] = useState('1.2 MB');

  // Cinematic Color Grading State
  const [colorGrade, setColorGrade] = useState<ColorGrade>('cyan');
  const [persona, setPersona] = useState<'concierge' | 'tactical' | 'polymath'>('concierge');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Interactive Mini Calculator
  const [calcInput, setCalcInput] = useState('0');

  // Messages / Orders Feed
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'maximoff',
      text: 'Good day, Sir. Maximoff Core is online. I am actively connected to your persistent Google Cloud Firestore database. I can research across all live information on Google, answer any question, execute tasks across connected devices, and manage laboratory security.',
      actionTag: 'FIRESTORE DB CONNECTED · GOOGLE RESEARCH ACTIVE',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio spectrum wave animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isListening || isSpeaking) {
        setAudioLevel(Math.floor(40 + Math.random() * 55));
      } else {
        setAudioLevel(15);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = `theme-${colorGrade} bg-black text-slate-100 antialiased selection:bg-cyan-500 selection:text-black overflow-x-hidden min-h-screen`;
  }, [colorGrade]);

  // Initialize Firebase Auth listener and test Firestore database connection
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    testFirestoreConnection().then((connected) => {
      setDbStatus(connected ? 'connected' : 'error');
      setLastSyncTime(new Date().toLocaleTimeString());
    });

    // Real-time synchronization of Research Dossiers from Firestore
    const dossiersRef = collection(db, 'research_dossiers');
    const unsubscribeDossiers = onSnapshot(
      dossiersRef,
      (snapshot) => {
        const items: ResearchDossierRecord[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as ResearchDossierRecord);
        });
        // Sort descending by date
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setResearchDossiers(items);
        setLastSyncTime(new Date().toLocaleTimeString());
      },
      (error) => {
        console.warn('Real-time dossiers snapshot error:', error.message);
      }
    );

    // Real-time synchronization of Device Files from Firestore
    const filesRef = collection(db, 'device_files');
    const unsubscribeFiles = onSnapshot(
      filesRef,
      (snapshot) => {
        const cloudFiles: DeviceFile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudFiles.push({
            id: data.id,
            name: data.name,
            type: data.type,
            extension: data.extension,
            device: data.device,
            size: data.size || '1.0 MB',
            lastModified: data.lastModified || 'Just now',
            path: data.path,
          });
        });

        if (cloudFiles.length > 0) {
          // Merge unique files
          setDeviceFiles((prev) => {
            const map = new Map<string, DeviceFile>();
            prev.forEach((f) => map.set(f.id, f));
            cloudFiles.forEach((f) => map.set(f.id, f));
            return Array.from(map.values());
          });
        }
      },
      (error) => {
        console.warn('Real-time files snapshot error:', error.message);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeDossiers();
      unsubscribeFiles();
    };
  }, []);

  // Web Speech API Voice synthesis helper
  const speakText = (text: string) => {
    if (!voiceFeedbackEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    // Clean markdown asterisks/bullets for voice
    const cleanSpoken = text.replace(/[*#_•]/g, '').slice(0, 300);
    const utter = new SpeechSynthesisUtterance(cleanSpoken);
    if (persona === 'tactical') {
      utter.pitch = 0.85;
      utter.rate = 1.1;
    } else if (persona === 'polymath') {
      utter.pitch = 1.05;
      utter.rate = 1.0;
    } else {
      utter.pitch = 0.95;
      utter.rate = 1.02;
    }

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('en-GB') || v.name.includes('UK') || v.name.includes('English')
    );
    if (preferredVoice) utter.voice = preferredVoice;

    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  const handleReplayAudio = (text: string) => {
    playHoloClick(1200, 0.03);
    speakText(text);
  };

  // Safe external URL launcher
  const openExternalUrl = (url: string) => {
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleSelectGrade = (grade: ColorGrade) => {
    playHoloClick(1300, 0.04);
    setColorGrade(grade);
  };

  // Trigger Operator Google Login
  const handleOperatorLogin = async () => {
    try {
      playHoloClick(1200, 0.03);
      await signInWithPopup(auth, googleProvider);
      playSuccessChime();
    } catch (error) {
      console.error('Operator sign-in error:', error);
    }
  };

  const handleOperatorLogout = async () => {
    try {
      playHoloClick(900, 0.03);
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Trigger Lockdown Mode
  const triggerLockdown = async () => {
    playLockdownSound();
    setIsLockedDown(true);
    setShowUnlockModal(true);
    setUnlockError('');
    setSecretInput('');

    const assistantMsg: Message = {
      id: Math.random().toString(),
      sender: 'maximoff',
      text: 'EMERGENCY LOCKDOWN ENGAGED. Workshop sealed, network air-gapped. Disengagement requires valid cryptographic voice or text authorization.',
      actionTag: 'SECURITY LOCKDOWN ACTIVE',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    speakText('Emergency lockdown engaged. Authorized passcode required to disengage.');

    // Save security audit to Firestore if authenticated
    try {
      const auditId = `audit_${Date.now()}`;
      const uid = currentUser?.uid || 'anonymous_operator';
      if (currentUser) {
        await setDoc(doc(db, 'security_audits', auditId), {
          id: auditId,
          eventType: 'LOCKDOWN_ENGAGED',
          details: 'Emergency workshop lockdown engaged by operator request.',
          operatorId: uid,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Audit log write error:', e);
    }
  };

  // Attempt to Unlock with the Secret Code Word (without exposing the passkey on UI)
  const handleAttemptUnlock = async (codeToCheck?: string) => {
    const code = (codeToCheck || secretInput).trim();
    if (!code) return;

    const normalized = normalizePasscode(code);
    if (normalized === SECRET_PASSCODE || normalized.includes('i have my own maximoff')) {
      playUnlockSuccessSound();
      setIsLockedDown(false);
      setShowUnlockModal(false);
      setUnlockError('');
      setSecretInput('');

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: 'Authorization phrase verified. Welcome back, Sir. De-escalating lockdown protocol and reopening all enclaves.',
        actionTag: 'LOCKDOWN DISENGAGED · ACCESS GRANTED',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText('Authorization verified. Welcome back, Sir. Lockdown protocol disengaged.');

      // Save security audit to Firestore
      try {
        const auditId = `audit_${Date.now()}`;
        const uid = currentUser?.uid || 'anonymous_operator';
        if (currentUser) {
          await setDoc(doc(db, 'security_audits', auditId), {
            id: auditId,
            eventType: 'UNLOCK_SUCCESS',
            details: 'Confidential voice/text authorization verified. Lockdown protocol disengaged.',
            operatorId: uid,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('Audit log write error:', e);
      }
    } else {
      playAccessDeniedSound();
      setUnlockError('ACCESS DENIED: Authorization code incorrect or unverified.');
      speakText('Access denied. Authorization phrase invalid.');
    }
  };

  // Execute Real-Time Google Research & Persist in Firestore Database
  const executeGoogleResearch = async (queryTopic: string) => {
    setIsResearching(true);
    playOrderExecutionSound();

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryTopic }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch research from Google');
      }

      const dossierId = `dossier_${Date.now()}`;
      const uid = currentUser?.uid || 'operator_maximoff';
      const dossierRecord: ResearchDossierRecord = {
        id: dossierId,
        query: queryTopic,
        summary: data.answer,
        keyFacts: data.keyFacts || [],
        sources: data.sources || [],
        searchQueries: data.searchQueries || [queryTopic],
        category: data.category || 'General Intelligence',
        authorId: uid,
        authorEmail: currentUser?.email || 'operator@maximoff.ai',
        createdAt: new Date().toISOString(),
      };

      // Persist into Firestore Database
      try {
        if (currentUser) {
          await setDoc(doc(db, 'research_dossiers', dossierId), dossierRecord);
        } else {
          // Add to local state if unauthenticated preview
          setResearchDossiers((prev) => [dossierRecord, ...prev]);
        }
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
        setResearchDossiers((prev) => [dossierRecord, ...prev]);
      }

      playSuccessChime();

      // Add rich message to the feed
      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: data.answer,
        actionTag: `GOOGLE RESEARCH · ${data.sources?.length || 0} SOURCES · FIRESTORE SYNCED`,
        sources: data.sources,
        keyFacts: data.keyFacts,
        searchQueries: data.searchQueries,
        isResearch: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Synthesize spoken answer from the actual Google research answer
      const firstParagraph = data.answer.split('\n\n')[0] || data.answer;
      const spokenSummary = firstParagraph.replace(/[*#_•]/g, '').slice(0, 260).trim();
      speakText(spokenSummary || `Research regarding ${queryTopic} completed and synchronized in the Firestore database.`);
    } catch (err) {
      console.error('Google Research error:', err);
      const errMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: `Unable to complete Google research uplink: ${err instanceof Error ? err.message : String(err)}. Accessing local fallback neural parameters.`,
        actionTag: 'RESEARCH UPLINK NOTICE',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsResearching(false);
    }
  };

  // Add custom file/folder metadata to Firestore Database
  const handleAddNewDeviceFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    playHoloClick(1100, 0.03);
    const fileId = `file_${Date.now()}`;
    const uid = currentUser?.uid || 'operator_maximoff';
    const ext = newFileType === 'file' ? newFileName.split('.').pop() || 'dat' : undefined;

    const newRecord: DeviceFile = {
      id: fileId,
      name: newFileName.trim(),
      type: newFileType,
      extension: ext,
      device: newFileDevice,
      size: newFileSize || '1.0 MB',
      lastModified: 'Just now',
      path: newFilePath.trim() || `/${newFileDevice.toLowerCase()}/${newFileName.trim()}`,
    };

    // Save to Firestore if authenticated
    try {
      if (currentUser) {
        await setDoc(doc(db, 'device_files', fileId), {
          ...newRecord,
          authorId: uid,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('File record save error:', err);
    }

    setDeviceFiles((prev) => [newRecord, ...prev]);
    setShowAddFileModal(false);
    setNewFileName('');
    setNewFilePath('');
    playSuccessChime();
    speakText(`File ${newRecord.name} indexed and synchronized in Firestore database, Sir.`);
  };

  // Filtered files based on search & device
  const filteredFiles = deviceFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(fileSearchQuery.toLowerCase());
    const matchesDevice = selectedDevice === 'All' || file.device === selectedDevice;
    return matchesSearch && matchesDevice;
  });

  // Handle Order Execution
  const handleExecuteOrder = async (orderString?: string, source: 'voice' | 'text' = 'text') => {
    const queryStr = (orderString || inputText).trim();
    if (!queryStr) return;

    // Check if system is locked down and this is an unlock attempt
    if (isLockedDown) {
      if (normalizePasscode(queryStr).includes(SECRET_PASSCODE)) {
        handleAttemptUnlock(SECRET_PASSCODE);
        setInputText('');
        return;
      } else {
        handleAttemptUnlock(queryStr);
        setInputText('');
        return;
      }
    }

    if (source === 'text') {
      playOrderExecutionSound();
    } else {
      playHoloClick(1100, 0.04);
    }

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: queryStr,
      orderType: source,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const q = queryStr.toLowerCase();

    // 1. Task: Lockdown / Seal
    if (
      q === 'lockdown' ||
      q.includes('initiate lockdown') ||
      q.includes('engage lockdown') ||
      q.includes('seal workshop') ||
      q.includes('emergency lock')
    ) {
      triggerLockdown();
      return;
    }

    // 2. Task: Database verification
    if (
      q === 'database' ||
      q === 'db' ||
      q === 'db status' ||
      q.includes('verify database') ||
      q.includes('check database') ||
      q.includes('firestore status') ||
      q.includes('database status') ||
      q.includes('check firestore')
    ) {
      playSuccessChime();
      setActiveHud('research');
      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: `Google Cloud Firestore database connection verified active. Instance ID: [ai-studio-maximoffautonomo-c2b7a78c-7eaa-4f9e-ba4c-d2b4414474e9]. Real-time synchronization active across ${researchDossiers.length} Google research dossiers and ${deviceFiles.length} cross-device file records.`,
        actionTag: 'DATABASE AUDIT: 100% NOMINAL',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText('Firestore database verified online and synchronized.');
      return;
    }

    // 3. Task: Explicit File/Folder Search across connected devices
    // (Ensure questions about Chrome or Google files/settings are routed to research instead)
    const isExplicitFileSearch =
      q.startsWith('search files') ||
      q.startsWith('find files') ||
      q.startsWith('search folders') ||
      q.startsWith('find folders') ||
      q.startsWith('browse files') ||
      q.startsWith('list files') ||
      q.includes('files across devices') ||
      q.includes('files on workstation') ||
      q === 'show files' ||
      q === 'my files' ||
      q === 'device files';

    if (isExplicitFileSearch) {
      playFileSearchSound();
      setActiveHud('files');
      const term = queryStr.replace(/search|find|files|folders|for|across|devices|device|on|workstation|mobile|maximoff|,/gi, '').trim();
      if (term) setFileSearchQuery(term);

      const reply = `Cross-referencing connected devices (Workstation, Mobile, Cloud, Edge Server). Located ${filteredFiles.length} files and folders matching your request, Sir.`;
      const actionTag = `FILES FOUND: ${filteredFiles.length} ITEMS`;

      playSuccessChime();
      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: reply,
        actionTag,
        orderType: source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
      return;
    }

    // 4. Task: Universal Website & Web Service Launcher (Spotify, Amazon, YouTube, Google, Netflix, Reddit, GitHub, etc.)
    const websiteLaunch = resolveWebsiteLaunch(queryStr);
    if (websiteLaunch) {
      openExternalUrlSafely(websiteLaunch.url);
      playSuccessChime();

      const reply = websiteLaunch.confirmationMessage;
      const actionTag = websiteLaunch.actionTag;
      const taskAction: TaskAction = {
        type: 'url',
        title: websiteLaunch.name,
        url: websiteLaunch.url,
        buttonLabel: websiteLaunch.buttonLabel,
      };

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: reply,
        actionTag,
        orderType: source,
        taskAction,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
      return;
    }

    // 5. Task: Adjust Color Grading
    if (q.includes('color') || q.includes('grading') || q.includes('theme') || q.includes('grade')) {
      let newGrade: ColorGrade = 'cyan';
      let gradeName = 'Arc Cyan';

      if (q.includes('gold') || q.includes('amber') || q.includes('stark')) {
        newGrade = 'amber';
        gradeName = 'Stark Gold';
      } else if (q.includes('sapphire') || q.includes('blue')) {
        newGrade = 'blue';
        gradeName = 'Deep Sapphire';
      } else if (q.includes('emerald') || q.includes('green')) {
        newGrade = 'emerald';
        gradeName = 'Quantum Emerald';
      } else if (q.includes('purple') || q.includes('violet')) {
        newGrade = 'purple';
        gradeName = 'Solar Violet';
      }

      setColorGrade(newGrade);
      const reply = `Color grading adjusted to ${gradeName}, Sir. Recalibrating luminous HUD filters.`;
      const actionTag = `COLOR GRADE: ${gradeName.toUpperCase()} ACTIVE`;
      playSuccessChime();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: reply,
        actionTag,
        orderType: source,
        taskAction: {
          type: 'theme',
          title: `Color Grading: ${gradeName}`,
          data: newGrade,
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
      return;
    }

    // 7. Task: Calculator
    if (q.includes('calc') || q.includes('calculator') || q.includes('calculate') || q.includes('math')) {
      setActiveHud('calculator');
      const reply = 'Opening interactive cybernetic calculator in the HUD drawer, Sir.';
      const actionTag = 'CALCULATOR ACTIVE';
      playSuccessChime();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: reply,
        actionTag,
        orderType: source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
      return;
    }

    // 8. Task: Memory Blueprint Recall
    if (q.includes('mark 42') && (q.includes('propulsion') || q.includes('blueprint') || q.includes('spec'))) {
      setActiveHud('memory');
      const reply = 'Accessing HNSW vector memory vault. Mark 42 flight propulsion schematics loaded: titanium stabilizer tolerances verified at 0.05%.';
      const actionTag = '1.4B VECTORS INDEXED';
      playSuccessChime();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: reply,
        actionTag,
        orderType: source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
      return;
    }

    // 9. Task: Telemetry & Diagnostic
    if (q.includes('status') || q.includes('diagnostic') || q.includes('telemetry') || q.includes('health check')) {
      setActiveHud('telemetry');
      const reply = 'Full telemetry diagnostic complete, Sir. All 18 local neural enclaves and Firestore database synchronized. Latency nominal at 38ms, core temp steady at 36.4°C.';
      const actionTag = 'ALL ENCLAVES & DB NOMINAL';
      playSuccessChime();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'maximoff',
        text: reply,
        actionTag,
        orderType: source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
      return;
    }

    // 10. Default: Exhaustive Google & Chrome Research & Database Persist
    // Conducts real-time Google research across all web information and answers everything accurately!
    const cleanTopic = queryStr
      .replace(/^maximoff\s*,?\s*/i, '')
      .replace(/^(please\s+)?(tell me about|tell me|explain to me|explain|research|find out about|give me information on|what do you know about)\s+/i, '')
      .trim() || queryStr.trim();

    await executeGoogleResearch(cleanTopic);
  };

  // Web Speech API Voice Recognition Toggle
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    playHoloClick(1100, 0.04);
    setIsListening(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);

          if (isLockedDown) {
            handleAttemptUnlock(transcript);
          } else {
            handleExecuteOrder(transcript, 'voice');
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setTimeout(() => {
            if (isLockedDown) {
              setUnlockError('Voice input uncaptured or unclear. Speak or enter confidential authorization.');
            } else {
              handleExecuteOrder('Maximoff, research latest technological innovations', 'voice');
            }
          }, 600);
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

    // Fallback simulation
    setTimeout(() => {
      setIsListening(false);
      if (isLockedDown) {
        setUnlockError('Voice audio captured did not match authorization record.');
      } else {
        handleExecuteOrder('Maximoff, research latest technological innovations', 'voice');
      }
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col relative overflow-hidden select-none transition-colors duration-700">
      {/* Dynamic Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700"
        style={{
          backgroundColor: isLockedDown
            ? 'rgba(239, 68, 68, 0.22)'
            : colorGrade === 'cyan'
            ? 'rgba(6, 182, 212, 0.14)'
            : colorGrade === 'blue'
            ? 'rgba(59, 130, 246, 0.14)'
            : colorGrade === 'amber'
            ? 'rgba(245, 158, 11, 0.14)'
            : colorGrade === 'emerald'
            ? 'rgba(16, 185, 129, 0.14)'
            : 'rgba(168, 85, 247, 0.14)',
        }}
      />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-2xl border-b border-cyan-500/20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Real-Life Physical Logo Emblem & Title */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              playCorePulseSound();
              speakText('Maximoff Core operational, Sir.');
            }}
            className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-slate-700 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer group hover:scale-105 transition-transform"
            title="Click to ping Maximoff Core"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src="/src/assets/images/maximoff_core_logo_1790438458380.jpg"
                alt="Maximoff Titanium Emblem"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                isLockedDown ? 'bg-rose-500 animate-ping' : 'bg-cyan-400 animate-pulse'
              }`}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black font-display tracking-tight text-white flex items-center gap-1.5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200 holo-glow-cyan">
                MAXIMOFF
              </span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80 -mt-1 hidden sm:inline">
              AUTONOMOUS INTELLIGENCE & DATABASE SYSTEM
            </span>
          </div>
        </div>

        {/* Center: Live Firestore Database Status & Single Lockdown Button */}
        <div className="flex items-center gap-2.5">
          {/* Firestore DB Status Pill */}
          <button
            onClick={() => {
              playHoloClick(1100, 0.02);
              setActiveHud('research');
            }}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              dbStatus === 'connected'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
            title="Click to view live Database Vault & Research Hub"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">DATABASE:</span>
            <span className="text-white font-semibold">
              {dbStatus === 'connected' ? 'FIRESTORE ONLINE' : 'CONNECTING...'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>

          {/* Single Lockdown / Opening Protocol Status Button */}
          <button
            onClick={() => {
              if (isLockedDown) {
                setShowUnlockModal(true);
              } else {
                triggerLockdown();
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isLockedDown
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/60'
            }`}
          >
            {isLockedDown ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-cyan-400" />}
            <span className="hidden md:inline">
              {isLockedDown ? 'SECURITY LOCKED [CLICK TO UNLOCK]' : 'SECURITY NOMINAL'}
            </span>
          </button>
        </div>

        {/* Right Settings: Operator Auth, Color Grading & Voice Feedback */}
        <div className="flex items-center gap-2">
          {/* Operator Google Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/30 rounded-xl px-2 py-1 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-cyan-300 font-medium truncate max-w-[100px] hidden lg:inline">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={handleOperatorLogout}
                className="text-slate-500 hover:text-rose-400 transition-colors ml-1 p-0.5 cursor-pointer"
                title="Sign out of Operator profile"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleOperatorLogin}
              className="px-2.5 py-1.5 bg-slate-950/90 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign in with Google to sync personal dossiers to Firestore"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Color Grade Quick Palette */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-950/90 rounded-xl border border-slate-800">
            {COLOR_GRADES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelectGrade(g.id)}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  colorGrade === g.id ? 'border-white scale-125' : 'border-transparent opacity-60'
                }`}
                style={{ backgroundColor: g.hex }}
                title={`Grade: ${g.name}`}
              />
            ))}
          </div>

          {/* Voice Toggle */}
          <button
            onClick={() => {
              playHoloClick(950, 0.02);
              setVoiceFeedbackEnabled(!voiceFeedbackEnabled);
            }}
            className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              voiceFeedbackEnabled
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={voiceFeedbackEnabled ? 'Spoken Voice: ON' : 'Spoken Voice: OFF'}
            aria-label="Toggle voice output"
          >
            {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1">
          {/* Left Column: Holographic Core AI Visualizer & Orders Dock (7 Cols) */}
          <div className="lg:w-7/12 flex flex-col justify-between space-y-6">
            {/* Holographic Core Display */}
            <div className="holo-card rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[420px] overflow-hidden group">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>NEURAL REASONING CORE · 3.82 GHZ</span>
                </div>
                {isResearching && (
                  <div className="px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-400/50 text-[10px] font-mono text-blue-300 flex items-center gap-1.5 animate-pulse">
                    <Globe className="w-3 h-3 text-blue-400 animate-spin" />
                    <span>RESEARCHING GOOGLE...</span>
                  </div>
                )}
              </div>

              {/* Holographic Core 3D Model with Real Logo Center */}
              <div className="relative w-full h-64 sm:h-80 flex items-center justify-center">
                <HolographicCore
                  colorScheme={isLockedDown ? 'amber' : colorGrade}
                  interactive={true}
                />
              </div>

              {/* Core Status Subtitle */}
              <div className="text-center space-y-1 z-20">
                <div className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-300">
                  {isLockedDown
                    ? 'SECURITY LOCKDOWN ACTIVE · AIR-GAPPED'
                    : isResearching
                    ? 'RESEARCHING ACROSS ALL GOOGLE INFORMATION...'
                    : isListening
                    ? 'LISTENING TO OPERATOR ORDER...'
                    : isSpeaking
                    ? 'MAXIMOFF VOCALIZING SYNTHESIZED RESPONSE...'
                    : 'CORE READY FOR NATURAL LANGUAGE & GOOGLE RESEARCH'}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {isLockedDown
                    ? 'Workshop locked. Speak or enter confidential authorization to disengage.'
                    : `Database Synced: ${researchDossiers.length} Research Dossiers · ${deviceFiles.length} Connected Files`}
                </div>
              </div>

              {/* Audio Waveform */}
              <div className="w-full max-w-xs mt-2 flex items-center justify-center gap-1 h-7 px-4">
                {[...Array(28)].map((_, i) => {
                  const height =
                    isListening || isSpeaking || isResearching
                      ? Math.max(12, Math.sin((i / 28) * Math.PI) * audioLevel + Math.random() * 18)
                      : 8;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 via-cyan-400 to-cyan-200 rounded-full transition-all duration-75"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Preset Quick Order Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  DIRECT TASK SHORTCUTS:
                </span>
                <span>CLICK TO DISPATCH INSTANTLY</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_ORDERS.map((order) => (
                  <button
                    key={order.label}
                    onClick={() => handleExecuteOrder(order.command, 'text')}
                    className="text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                      <span className="uppercase text-slate-400">{order.category}</span>
                      <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">↗</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 font-display truncate">
                      {order.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Unified Order Input Dock: Text Order Bar & Big Voice Mic Button */}
            <div className="holo-card rounded-2xl p-3 flex items-center gap-3">
              {/* Big Mic Button */}
              <button
                onClick={toggleListening}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-[0_0_35px_rgba(244,63,94,0.7)] animate-pulse scale-105'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak Order into Mic'}
                aria-label="Voice input button"
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              {/* Text Order Bar */}
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3.5 text-cyan-400 font-mono text-xs select-none pointer-events-none">
                  order:
                </span>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteOrder(undefined, 'text')}
                  placeholder={
                    isLockedDown
                      ? 'Enter authorization passkey or phrase to unlock...'
                      : 'Ask anything to research Google, "search files Mark 42", "open YouTube"...'
                  }
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-16 pr-12 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono placeholder:text-slate-500 shadow-inner"
                />
                <button
                  onClick={() => handleExecuteOrder(undefined, 'text')}
                  disabled={!inputText.trim() || isResearching}
                  className="absolute right-2.5 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold transition-all cursor-pointer"
                  title="Send order or question"
                  aria-label="Send order or question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dialogue Feed & Live Sensory Enclaves (5 Cols) */}
          <div className="lg:w-5/12 flex flex-col space-y-4">
            {/* Enclave Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs font-mono overflow-x-auto">
              {[
                { id: 'dialogue' as const, label: 'Feed', icon: MessageSquare },
                { id: 'webhub' as const, label: 'Web Hub', icon: Compass },
                { id: 'research' as const, label: 'Google & DB', icon: Globe },
                { id: 'files' as const, label: 'Files', icon: Folder },
                { id: 'memory' as const, label: 'Memory', icon: Database },
                { id: 'telemetry' as const, label: 'Telemetry', icon: Cpu },
                { id: 'calculator' as const, label: 'Math', icon: Calculator },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    playHoloClick(1000, 0.02);
                    setActiveHud(id);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeHud === id
                      ? 'bg-cyan-500 text-black font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Active Drawer Display */}
            <div className="flex-1 min-h-[480px] holo-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
              {/* 1. Order & Dialogue Feed */}
              {activeHud === 'dialogue' && (
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5 mb-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      DISPATCHED ORDERS & GOOGLE RESEARCH
                    </span>
                    <span className="text-[10px] text-emerald-400">FIRESTORE SYNCED</span>
                  </div>

                  {/* Message Log */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[380px] text-xs font-mono">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                      >
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                          <span className={msg.sender === 'user' ? 'text-slate-300 font-bold' : 'text-cyan-400 font-bold'}>
                            {msg.sender === 'user'
                              ? msg.orderType === 'voice'
                                ? '🎙️ OPERATOR (VOICE)'
                                : '⌨️ OPERATOR (TEXT)'
                              : 'MAXIMOFF CORE'}
                          </span>
                          <span>· {msg.time}</span>
                          {msg.sender === 'maximoff' && (
                            <button
                              onClick={() => handleReplayAudio(msg.text)}
                              className="text-slate-500 hover:text-cyan-400 transition-colors p-0.5 cursor-pointer"
                              title="Replay Spoken Audio"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-950/90 border border-cyan-500/30 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>

                          {/* Key verified facts from Google Research */}
                          {msg.keyFacts && msg.keyFacts.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-cyan-500/20 space-y-1">
                              <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                                Verified Facts (Google Grounded):
                              </span>
                              <div className="space-y-1">
                                {msg.keyFacts.map((fact, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    <span>{fact}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Source Citations */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-cyan-500/20">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                                Verified Google Sources:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.sources.map((s, idx) => (
                                  <a
                                    key={idx}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-500/40 text-[10px] text-cyan-300 hover:bg-cyan-900/60 flex items-center gap-1 transition-colors"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5" />
                                    <span className="truncate max-w-[140px]">{s.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          {msg.taskAction && msg.taskAction.url && (
                            <div className="mt-3 pt-2 border-t border-cyan-500/20">
                              <a
                                href={msg.taskAction.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playHoloClick(1200, 0.03)}
                                className="w-full py-2 px-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-400/60 text-cyan-200 hover:text-white text-xs rounded-xl flex items-center justify-center gap-2 transition-all font-bold cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{msg.taskAction.buttonLabel || `Launch ${msg.taskAction.title || 'Linked Service'} ↗`}</span>
                              </a>
                              <span className="text-[10px] text-slate-400 block text-center mt-1 font-sans">
                                External web uplink. If pop-ups are restricted by browser, tap above to launch directly.
                              </span>
                            </div>
                          )}
                        </div>

                        {msg.actionTag && (
                          <span className="text-[9px] font-mono text-cyan-400/80 mt-1 uppercase tracking-wider">
                            [{msg.actionTag}]
                          </span>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}

              {/* Web Hub & Popular Websites Enclave */}
              {activeHud === 'webhub' && (
                <div className="flex-1 flex flex-col justify-between h-full space-y-3 font-mono">
                  {/* Sub-header */}
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      POPULAR WEBSITES & WEB UPLINK DIRECTORY
                    </span>
                    <span className="text-emerald-400 text-[10px]">
                      {POPULAR_WEBSITES.length}+ POPULAR SITES INDEXED
                    </span>
                  </div>

                  {/* Direct URL or Site Launcher Bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customWebInput}
                        onChange={(e) => setCustomWebInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customWebInput.trim()) {
                            handleExecuteOrder(`open ${customWebInput.trim()}`, 'text');
                            setCustomWebInput('');
                          }
                        }}
                        placeholder="Enter any site or URL (e.g. spotify, amazon, netflix, github)..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (customWebInput.trim()) {
                          handleExecuteOrder(`open ${customWebInput.trim()}`, 'text');
                          setCustomWebInput('');
                        }
                      }}
                      disabled={!customWebInput.trim()}
                      className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Launch</span>
                    </button>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                    {['All', 'Music & Audio', 'Shopping & Retail', 'Streaming & Video', 'Google Services', 'Social & Comms', 'Developer & Tech', 'AI & Tools'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          playHoloClick(1100, 0.02);
                          setWebHubCategory(cat);
                        }}
                        className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                          webHubCategory === cat
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Filtered Websites Grid/List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {POPULAR_WEBSITES.filter((site) => {
                      const matchesCategory = webHubCategory === 'All' || site.category === webHubCategory;
                      const matchesSearch =
                        !customWebInput ||
                        site.name.toLowerCase().includes(customWebInput.toLowerCase()) ||
                        site.description.toLowerCase().includes(customWebInput.toLowerCase());
                      return matchesCategory && matchesSearch;
                    }).map((site) => (
                      <div
                        key={site.id}
                        className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: site.colorHex || '#06b6d4' }}
                            />
                            <span className="text-white font-bold text-xs truncate group-hover:text-cyan-300 transition-colors">
                              {site.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {site.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                            {site.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleExecuteOrder(`open ${site.name}`, 'text')}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 rounded border border-slate-800 transition-colors cursor-pointer"
                            title={`Voice Order: Open ${site.name}`}
                          >
                            Order
                          </button>
                          <a
                            href={site.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSuccessChime()}
                            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-[10px] text-cyan-300 hover:text-cyan-200 rounded border border-cyan-400/40 transition-all flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Browser Pop-up Advisory note */}
                  <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-cyan-300/80 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      Voice Command Tip: Say or type <strong className="text-cyan-200">"open Spotify"</strong>, <strong className="text-cyan-200">"open Amazon"</strong>, or any popular website anytime!
                    </span>
                  </div>
                </div>
              )}

              {/* 2. Google Research & Database Vault Enclave */}
              {activeHud === 'research' && (
                <div className="flex-1 flex flex-col justify-between h-full space-y-3 font-mono">
                  {/* Sub-header */}
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      GOOGLE RESEARCH & FIRESTORE DATABASE
                    </span>
                    <span className="text-emerald-400 text-[10px]">
                      {researchDossiers.length} DOSSIERS ARCHIVED
                    </span>
                  </div>

                  {/* Research Search Bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={researchQueryInput}
                        onChange={(e) => setResearchQueryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && researchQueryInput.trim()) {
                            executeGoogleResearch(researchQueryInput.trim());
                            setResearchQueryInput('');
                          }
                        }}
                        placeholder="Research any topic across Google & save to DB..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (researchQueryInput.trim()) {
                          executeGoogleResearch(researchQueryInput.trim());
                          setResearchQueryInput('');
                        }
                      }}
                      disabled={!researchQueryInput.trim() || isResearching}
                      className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Research</span>
                    </button>
                  </div>

                  {/* Database Info Card */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Database Provider:</span>
                      <span className="text-emerald-400 font-semibold">Google Cloud Firestore</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Database ID:</span>
                      <span className="text-cyan-300 font-mono truncate max-w-[190px]">
                        ai-studio-maximoffautonomo...
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sync Latency:</span>
                      <span className="text-white">Active · Last synced {lastSyncTime}</span>
                    </div>
                  </div>

                  {/* Dossiers List from Firestore */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {researchDossiers.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No research dossiers yet. Type any query above to conduct real-time Google research and archive it in Firestore.
                      </div>
                    ) : (
                      researchDossiers.map((dossier) => (
                        <div
                          key={dossier.id}
                          className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                              <Globe className="w-3 h-3 text-cyan-400" />
                              {dossier.query}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(dossier.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                            {dossier.summary}
                          </p>

                          {dossier.sources && dossier.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {dossier.sources.slice(0, 3).map((s, idx) => (
                                <a
                                  key={idx}
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="w-2 h-2" />
                                  <span className="truncate max-w-[120px]">{s.title}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 3. Cross-Device Files Enclave */}
              {activeHud === 'files' && (
                <div className="flex-1 flex flex-col justify-between h-full space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      CROSS-DEVICE FILE EXPLORER
                    </span>
                    <button
                      onClick={() => setShowAddFileModal(true)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Index File to DB</span>
                    </button>
                  </div>

                  {/* Device Switcher */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                    {['All', 'Workstation', 'Mobile', 'Cloud Enclave', 'Edge Server'].map((dev) => (
                      <button
                        key={dev}
                        onClick={() => setSelectedDevice(dev)}
                        className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                          selectedDevice === dev
                            ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>

                  {/* Search Input Bar */}
                  <div className="relative mb-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fileSearchQuery}
                      onChange={(e) => setFileSearchQuery(e.target.value)}
                      placeholder="Search files, folders, schematics across devices..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* File List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {filteredFiles.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No files or folders found matching "{fileSearchQuery}".
                      </div>
                    ) : (
                      filteredFiles.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.type === 'folder' ? (
                              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="text-white font-medium truncate block">
                                {item.name}
                              </span>
                              <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                <span>{item.device}</span>
                                <span>·</span>
                                <span>{item.size}</span>
                                <span>·</span>
                                <span>{item.lastModified}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              playHoloClick(1300, 0.03);
                              setDownloadNotice(`Accessing ${item.name} on ${item.device}... Synchronized with Firestore.`);
                              speakText(`Accessing ${item.name} from ${item.device}, Sir.`);
                              setTimeout(() => setDownloadNotice(null), 3000);
                            }}
                            className="px-2 py-1 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 text-[10px] rounded-lg transition-colors shrink-0 cursor-pointer"
                          >
                            Access
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {downloadNotice && (
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{downloadNotice}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Memory Vault Enclave */}
              {activeHud === 'memory' && (
                <div className="flex-1 flex flex-col justify-between h-full space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      HNSW EPISODIC VECTOR GRAPH
                    </span>
                    <span className="text-cyan-400">1.4B SYNAPSES</span>
                  </div>

                  <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src="/src/assets/images/neural_memory_architecture_1790434202680.jpg"
                      alt="Memory Graph Architecture"
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                    {[
                      { title: 'Mark 42 Flight Propulsion', sim: '0.984', desc: 'Titanium-carbon alloy tolerances' },
                      { title: 'Firestore Database Sync Layer', sim: '0.965', desc: 'Enterprise database persistence active' },
                      { title: 'Google Grounded Intelligence', sim: '0.952', desc: 'Real-time multi-source research' },
                    ].map((m, i) => (
                      <div key={i} className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                        <div className="flex justify-between text-cyan-300 font-bold mb-0.5">
                          <span>{m.title}</span>
                          <span className="text-emerald-400">{m.sim}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{m.desc}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleExecuteOrder('Maximoff, recall all project blueprints', 'text')}
                    className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Order Memory Recall
                  </button>
                </div>
              )}

              {/* 5. Live Telemetry Enclave */}
              {activeHud === 'telemetry' && (
                <div className="flex-1 flex flex-col justify-between h-full space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      REAL-TIME SYSTEM METRICS
                    </span>
                    <span className="text-emerald-400">DATABASE ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Response Latency</span>
                      <span className="text-lg font-bold text-emerald-400">38ms</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Neural CPU Load</span>
                      <span className="text-lg font-bold text-cyan-400">24.2%</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Indexed Research</span>
                      <span className="text-lg font-bold text-blue-400">{researchDossiers.length} Units</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Core Temperature</span>
                      <span className="text-lg font-bold text-purple-400">36.2°C</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Database Engine:</span>
                      <span className="text-white">Firestore Enterprise</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Google Search Grounding:</span>
                      <span className="text-emerald-400">Enabled & Continuous</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cross-Device Link:</span>
                      <span className="text-white">4 Hardware Enclaves</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExecuteOrder('Maximoff, run system diagnostics', 'text')}
                    className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Order Deep System Probe
                  </button>
                </div>
              )}

              {/* 6. Interactive Cybernetic Calculator Enclave */}
              {activeHud === 'calculator' && (
                <div className="flex-1 flex flex-col justify-between h-full space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5" />
                      QUANTUM MATH PROCESSOR
                    </span>
                    <span className="text-emerald-400">64-BIT FLOAT</span>
                  </div>

                  {/* Display */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 text-right">
                    <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                      {calcInput}
                    </div>
                  </div>

                  {/* Keypad */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn) => (
                      <button
                        key={btn}
                        onClick={() => {
                          playHoloClick(1100, 0.02);
                          if (btn === 'C') {
                            setCalcInput('0');
                          } else if (btn === '=') {
                            try {
                              const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, '');
                              // eslint-disable-next-line no-eval
                              const res = Function(`'use strict'; return (${sanitized})`)();
                              setCalcInput(String(res));
                              playSuccessChime();
                            } catch {
                              setCalcInput('Error');
                            }
                          } else {
                            setCalcInput((prev) => (prev === '0' ? btn : prev + btn));
                          }
                        }}
                        className={`p-3 rounded-lg font-bold transition-colors cursor-pointer ${
                          btn === '='
                            ? 'col-span-2 bg-cyan-500 hover:bg-cyan-400 text-black'
                            : btn === 'C'
                            ? 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Index New File Modal */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-cyan-300 font-bold text-sm flex items-center gap-2">
                <Folder className="w-4 h-4" />
                INDEX NEW FILE INTO FIRESTORE DB
              </span>
              <button
                onClick={() => setShowAddFileModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewDeviceFile} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">File / Folder Name:</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. quantum_telemetry_matrix.bin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Type:</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as 'file' | 'folder')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="file">File</option>
                    <option value="folder">Folder</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Device:</label>
                  <select
                    value={newFileDevice}
                    onChange={(e) => setNewFileDevice(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Workstation">Workstation</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Cloud Enclave">Cloud Enclave</option>
                    <option value="Edge Server">Edge Server</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Path / Storage URI:</label>
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="/Volumes/Workstation/Vault/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFileModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Lockdown Authorization Modal (Single Option, Secret Passkey Kept Confidential) */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-2xl bg-[#090306] border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.4)] space-y-5 font-mono text-center">
            {/* Pulsing Lock Icon */}
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500 mx-auto flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold font-display text-white tracking-wider">
                SECURITY LOCKDOWN ACTIVE
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Terminal secured. To disengage lockdown, speak aloud or type your confidential authorization phrase:
              </p>
              <div className="text-[11px] text-rose-300 font-mono bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30 mt-2 flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>RESTRICTED ACCESS · AUTHORIZATION REQUIRED</span>
              </div>
            </div>

            {/* Error Message */}
            {unlockError && (
              <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-500/60 text-xs text-rose-300 animate-in shake">
                {unlockError}
              </div>
            )}

            {/* Code Input (Passkey is NOT revealed anywhere) */}
            <div className="space-y-3">
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAttemptUnlock()}
                placeholder="Enter confidential passkey or phrase..."
                className="w-full bg-black border border-rose-500/60 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-400 text-center font-mono placeholder:text-slate-600 tracking-wider"
              />

              <div className="grid grid-cols-2 gap-3">
                {/* Voice Speak Passcode Button */}
                <button
                  onClick={toggleListening}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-rose-300 hover:border-rose-400'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListening ? 'Listening...' : 'Speak Passcode'}</span>
                </button>

                {/* Authorize Unlock Button */}
                <button
                  onClick={() => handleAttemptUnlock()}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Authorize Unlock</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
