'use client';

import { useState, ReactNode, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, FolderKanban, Wallet, UserCheck,
  FileBarChart, Bot, ChevronRight, Search, Bell,
  Settings, LogOut, Menu, X, Shield, Send, Mic, Loader2, Network,
  CreditCard, Ticket, CheckCircle, Smartphone, CalendarDays
} from 'lucide-react';
import { signOut } from '@/lib/auth/supabase';
import { useAuth } from '@/lib/hooks';
import { queryCureVendAI } from '@/lib/ai-agent';

const NAV_ITEMS = [
  { name: 'Dashboard',  href: '/user/dashboard', icon: LayoutDashboard },
  { name: 'Vendors',    href: '/user/vendors',   icon: Building2 },
  { name: 'Projects',   href: '/user/projects',  icon: FolderKanban },
  { name: 'Finance',    href: '/user/finance',    icon: Wallet },
  { name: 'Onboarding', href: '/user/onboarding', icon: UserCheck },
  { name: 'Reports',    href: '/user/reports',    icon: FileBarChart, sub: 'Org Chart' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hi! I\'m your CureVendAI assistant. I can help you check vendor details, project budgets, payment status, and more. Just ask me anything!' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeVoiceStatus, setActiveVoiceStatus] = useState<string | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (pathname?.includes('/login') || pathname?.includes('/register')) return <>{children}</>;

  const userFullName = profile?.full_name || 'Rohit Ghosh Chowdhury';

  // ── Voice Command Logic (Agentic Actions) ──────────────────────────────────
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice protocols not supported in this terminal. Please use text commands.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setActiveVoiceStatus('Listening...');
    recognition.start();

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript;
      setIsListening(false);
      handleAgenticCommand(command);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleAgenticCommand = async (text: string) => {
    if (!text.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setChatMessage('');
    setIsProcessing(true);

    const playVoice = async (speechText: string) => {
       try {
          const res = await fetch('/api/tts', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ text: speechText })
          });
          if (res.ok) {
             const blob = await res.blob();
             const url = URL.createObjectURL(blob);
             const audio = new Audio(url);
             audio.play();
          }
       } catch(e) { console.error('Voice sync failed', e); }
    };

    try {
      const t = text.toLowerCase();
      
      // 1. RE-ROUTING LOGIC (The "Agent" part)
      if (t.includes('pay') || t.includes('settle') || t.includes('invoice')) {
          const resText = "Sure! Taking you to the Finance page now.";
          setChatHistory(prev => [...prev, { role: 'bot', text: resText }]);
          playVoice(resText);
          setTimeout(() => {
            router.push('/user/finance');
            setIsChatOpen(false);
          }, 2000);
      } else if (t.includes('ticket') || t.includes('problem') || t.includes('issue')) {
          const resText = "Opening your Projects page to check on that.";
          setChatHistory(prev => [...prev, { role: 'bot', text: resText }]);
          playVoice(resText);
          setTimeout(() => {
            router.push('/user/projects'); 
            setIsChatOpen(false);
          }, 2000);
      } else if (t.includes('report') || t.includes('org') || t.includes('team')) {
          const resText = "Here's the Reports section for you.";
          setChatHistory(prev => [...prev, { role: 'bot', text: resText }]);
          playVoice(resText);
          setTimeout(() => {
            router.push('/user/reports');
            setIsChatOpen(false);
          }, 2000);
      } else {
          // Default: Query DB through the AI Agent Brain
          const response = await queryCureVendAI(text);
          setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
          playVoice(response);
      }
    } catch (err) {
      const errText = "Sorry, I couldn't connect to the database right now. Please try again.";
      setChatHistory(prev => [...prev, { role: 'bot', text: errText }]);
      playVoice(errText);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface-soft text-brand-black overflow-hidden font-sans">
      
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside initial={isMobile ? { x: -300 } : false} animate={{ x: 0 }} exit={{ x: -300 }}
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-black/[0.03] shadow-premium-lg flex flex-col lg:static lg:block
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-all`}
          >
            <div className="h-20 flex items-center gap-4 px-6 border-b border-black/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-white shadow-premium-md flex items-center justify-center p-1.5 border border-black/[0.03] hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="CureVendAI" width={32} height={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-brand-black tracking-tighter">CureVendAI</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-blue">Workspace</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5 custom-scrollbar">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span className={`flex flex-col px-4 py-3.5 rounded-2xl transition-all group relative ${isActive ? 'bg-brand-black text-white shadow-premium-md' : 'text-gray-400 hover:text-brand-black'}`}>
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive ? 'text-brand-blue' : 'group-hover:text-brand-pink transition-colors'} />
                        <span className="text-xs font-black uppercase tracking-widest flex-1">{item.name}</span>
                        {isActive && <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-brand-pink" />}
                      </div>
                      {item.sub && <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ml-7 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{item.sub}</span>}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-black/[0.02]">
              <Link href="/user/settings" className="p-4 rounded-3xl bg-surface-soft border border-black/[0.03] flex items-center gap-3 group hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-pink p-[1px]">
                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userFullName)}&background=random`} alt="Profile" width={40} height={40} />
                   </div>
                </div>
                <p className="text-xs font-black text-brand-black truncate flex-1">{userFullName}</p>
                <Settings size={14} className="text-gray-300 group-hover:text-brand-black" />
              </Link>
              <button onClick={async () => { await signOut(); router.push('/user/login'); }} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-pink hover:bg-red-50/50 transition-all">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Dashboard Content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-black/[0.03] flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 shadow-premium-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2.5 rounded-2xl bg-surface-soft text-brand-black hover:bg-white transition shadow-sm">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <Shield size={16} className="text-brand-blue" />
              <span className="text-xs font-black text-brand-black uppercase tracking-[0.3em]">Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-2xl bg-surface-soft text-brand-black hover:bg-white transition shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-pink ring-2 ring-white animate-pulse" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }} className="max-w-[1600px] mx-auto">
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── AI Voice Co-Pilot Chat (THE AGENT) ───────────────────────── */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="absolute bottom-24 right-0 w-[440px] bg-white rounded-[3rem] shadow-premium-xl border border-black/[0.05] flex flex-col overflow-hidden mb-4"
            >
              <div className="p-8 bg-brand-black text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Network size={100} /></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue shadow-premium-sm border border-brand-blue/30">
                    <Bot size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue">CureVendAI Assistant</p>
                    <p className="text-sm font-black text-white/90">Ask me anything about your data</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition"><X size={20} /></button>
              </div>

              <div className="flex-1 p-8 h-[450px] overflow-y-auto custom-scrollbar bg-surface-soft/50 space-y-8">
                {chatHistory.map((chat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[2.2rem] shadow-premium-md border border-black/[0.02] ${chat.role === 'user' ? 'bg-brand-black text-white rounded-tr-none' : 'bg-white text-brand-black rounded-tl-none'}`}>
                      <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="p-6 bg-white rounded-[2.2rem] rounded-tl-none shadow-premium-md border border-black/[0.02]">
                       <div className="flex gap-1.5">
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                       </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-8 bg-white border-t border-black/[0.03]">
                {isListening && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-[2rem] flex items-center justify-center gap-4">
                    <div className="flex gap-1.5 items-center h-4">
                      {[1,2,3,4,5,6,7].map(i => (
                        <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }} className="w-1 bg-brand-pink rounded-full" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{activeVoiceStatus || 'Listening...'}</span>
                  </motion.div>
                )}
                <div className="flex items-center gap-4">
                  <button onClick={startListening} className={`p-5 rounded-[1.8rem] transition-all shadow-premium-md hover:scale-105 active:scale-95 ${isListening ? 'bg-brand-pink text-white animate-pulse' : 'bg-surface-soft text-brand-blue shadow-inner'}`}>
                    <Mic size={24} />
                  </button>
                  <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAgenticCommand(chatMessage)}
                    placeholder="Ask about vendors, projects, payments..." className="flex-1 bg-surface-soft px-6 py-5 rounded-[1.8rem] text-[12px] font-bold border border-transparent focus:bg-white focus:border-brand-blue/20 outline-none transition"
                  />
                  <button onClick={() => handleAgenticCommand(chatMessage)} className="p-5 bg-brand-black text-white rounded-[1.8rem] hover:shadow-glow transition-all active:scale-95">
                    <Send size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button onClick={() => setIsChatOpen(!isChatOpen)} whileHover={{ scale: 1.1, rotate: 12 }} whileTap={{ scale: 0.9 }}
          className={`w-24 h-24 rounded-[3.5rem] shadow-premium-xl flex items-center justify-center border-4 border-white ring-2 ring-black/[0.05] transition-all
            ${isChatOpen ? 'bg-brand-pink text-white rotate-90' : 'bg-brand-black text-white shadow-glow-blue/20'}`}
        >
          {isChatOpen ? <X size={40} /> : <Bot size={40} className="text-brand-blue" />}
        </motion.button>
      </div>
    </div>
  );
}
