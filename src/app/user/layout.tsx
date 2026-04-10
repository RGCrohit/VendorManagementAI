'use client';

import { useState, ReactNode, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, FolderKanban, Wallet, UserCheck,
  FileBarChart, Bot, ChevronRight, Search, Bell,
  Settings, LogOut, Menu, X, Shield, Send, Mic, Loader2, Trash2, Volume2, Sparkles, CalendarDays
} from 'lucide-react';
import { signOut, supabase } from '@/lib/auth/supabase';
import { useAuth } from '@/lib/hooks';
import { queryCureVendAI } from '@/lib/ai-agent';
import { sendEmail } from '@/app/actions/email';
import { scheduleMeetingAction } from '@/app/actions/meetings';

const NAV_ITEMS = [
  { name: 'Dashboard',  href: '/user/dashboard', icon: LayoutDashboard },
  { name: 'Vendors',    href: '/user/vendors',   icon: Building2 },
  { name: 'Projects',   href: '/user/projects',  icon: FolderKanban },
  { name: 'Finance',    href: '/user/finance',    icon: Wallet },
  { name: 'Onboarding', href: '/user/onboarding', icon: UserCheck },
  { name: 'ORG View',    href: '/user/reports',    icon: FileBarChart, sub: 'Governance' },
];

const INITIAL_MESSAGE = { role: 'bot', text: "Hi! I'm your CureVendAI Executive Assistant. You can ask me to summarize data, send emails, or schedule meetings via voice." };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([INITIAL_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isChatOpen) {
       chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isProcessing, isChatOpen]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/user/login';
    } catch (err) {
      window.location.href = '/user/login';
    }
  };

  const clearChat = () => setChatHistory([INITIAL_MESSAGE]);

  const playVoice = async (text: string) => {
    try {
       setIsSpeaking(true);
       const response = await fetch('/api/tts', { method: 'POST', body: JSON.stringify({ text }) });
       if (!response.ok) throw new Error('TTS failed');
       const audioData = await response.arrayBuffer();
       if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
       const buffer = await audioContextRef.current.decodeAudioData(audioData);
       const source = audioContextRef.current.createBufferSource();
       source.buffer = buffer;
       source.connect(audioContextRef.current.destination);
       source.onended = () => setIsSpeaking(false);
       source.start(0);
    } catch (err) {
       console.error("Playback error:", err);
       setIsSpeaking(false);
    }
  };

  const handleAgenticCommand = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setChatMessage('');
    setIsProcessing(true);

    try {
      const responseText = await queryCureVendAI(text);
      
      // Robust Regex for JSON Extraction
      const jsonMatch = responseText.match(/\{.*\}/s);
      
      if (jsonMatch) {
         try {
            const actionData = JSON.parse(jsonMatch[0]);
            
            if (actionData.action === 'SEND_EMAIL') {
               const { data: { session } } = await supabase.auth.getSession();
               const res = await sendEmail({ to: actionData.to, subject: actionData.subject, message: actionData.body, googleToken: session?.provider_token });
               const confirmation = res.success ? `✅ Email sent to ${actionData.to}.` : `❌ Failed to send email: ${res.error}`;
               setChatHistory(prev => [...prev, { role: 'bot', text: confirmation }]);
               setIsProcessing(false);
               await playVoice(confirmation);
               return;
            } 
            else if (actionData.action === 'SCHEDULE_MEETING') {
               const res = await scheduleMeetingAction({ title: actionData.title, date: actionData.date, time: actionData.time });
               const confirmation = res.success ? `🗓️ Meeting "${actionData.title}" scheduled for ${actionData.date} at ${actionData.time}.` : `❌ Failed to schedule: ${res.error}`;
               setChatHistory(prev => [...prev, { role: 'bot', text: confirmation }]);
               setIsProcessing(false);
               await playVoice(confirmation);
               return;
            }
         } catch (e) {
            console.error("JSON Parse Error:", e);
         }
      }

      setChatHistory(prev => [...prev, { role: 'bot', text: responseText }]);
      setIsProcessing(false);
      await playVoice(responseText);

    } catch (error) {
      console.error("Agent Error:", error);
      setChatHistory(prev => [...prev, { role: 'bot', text: "I encountered an error processing that command." }]);
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) {
       alert("Speech recognition not supported locally.");
       return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript;
      setIsListening(false);
      handleAgenticCommand(command);
    };
    recognition.onerror = () => setIsListening(false);
  };

  if (pathname?.includes('/login') || pathname?.includes('/register')) return <>{children}</>;

  return (
    <div className="flex h-screen bg-surface-soft text-brand-black overflow-hidden font-sans">
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-black/[0.03] shadow-premium-lg flex flex-col lg:static lg:block transition-all`}
          >
            <div className="h-20 flex items-center gap-4 px-6 border-b border-black/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-white shadow-premium-md flex items-center justify-center p-1.5 border border-black/[0.03]">
                <Image src="/logo.png" alt="CureVendAI" width={32} height={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-brand-black tracking-tighter">CureVendAI</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-blue">Admin Control</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5 custom-scrollbar">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                   <Link key={item.name} href={item.href}>
                    <span className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative
                      ${isActive ? 'bg-brand-black text-white shadow-premium-md' : 'text-gray-400 hover:text-brand-black'}`}>
                      <item.icon size={18} className={isActive ? 'text-brand-blue' : 'group-hover:text-brand-pink transition-colors'} />
                      <span className="text-xs font-black uppercase tracking-widest flex-1">{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-black/[0.02]">
               <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-pink transition-all active:scale-95 shadow-sm">
                  <LogOut size={14} /> Sign Out
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-black/[0.03] flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 shadow-premium-sm">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2.5 rounded-2xl bg-surface-soft text-brand-black transition shadow-sm">
               {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="hidden lg:flex items-center gap-3">
                 <Shield size={16} className="text-brand-blue" />
                 <span className="text-xs font-black text-brand-black uppercase tracking-[0.3em]">System Admin Dashboard</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-surface-soft rounded-full border border-black/[0.01]">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Live System</span>
              </div>
              <button className="relative p-2.5 rounded-2xl bg-surface-soft text-brand-black hover:bg-white transition shadow-sm"><Bell size={20} /><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-pink ring-2 ring-white animate-pulse" /></button>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-pink flex items-center justify-center text-white font-black text-xs shadow-premium-md transition-transform cursor-pointer">
                 {profile?.full_name?.[0] || 'U'}
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
           <AnimatePresence mode="wait">
              <motion.div key={pathname} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }} className="max-w-[1600px] mx-auto">
                 {children}
              </motion.div>
           </AnimatePresence>
        </main>

        {/* CHATBOT */}
        <div className="fixed bottom-10 right-10 z-[1000]">
           <AnimatePresence>
              {isChatOpen && (
                 <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="fixed bottom-32 right-12 w-[440px] h-[650px] bg-white rounded-[3rem] shadow-premium-2xl border border-black/[0.05] flex flex-col overflow-hidden">
                    <div className="p-8 bg-brand-black text-white flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="relative"><Bot size={32} className="text-brand-blue" />{isSpeaking && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue"></span></span>}</div>
                          <div><p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue leading-none mb-1">CureVendAI Agent</p><p className="text-sm font-black text-white/90">Functionally Enabled</p></div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button onClick={clearChat} className="p-2.5 hover:bg-white/10 rounded-xl transition text-gray-400 hover:text-brand-pink"><Trash2 size={18} /></button>
                          <button onClick={() => setIsChatOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition"><X size={20} /></button>
                       </div>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-surface-soft/50 flex flex-col space-y-8 scroll-smooth">
                       {chatHistory.map((chat, i) => (
                          <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] p-6 rounded-[2.2rem] shadow-premium-md border border-black/[0.02] ${chat.role === 'user' ? 'bg-brand-black text-white' : 'bg-white text-brand-black'}`}>
                                <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                             </div>
                          </div>
                       ))}
                       {isProcessing && <div className="flex justify-start"><div className="p-6 bg-white rounded-[2.2rem] shadow-premium-md border border-black/[0.02] animate-pulse flex items-center gap-2"><Sparkles size={14} className="animate-spin text-brand-blue" /><p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Executing Intent...</p></div></div>}
                       <div ref={chatEndRef} />
                    </div>

                    <div className="p-8 bg-white border-t border-black/[0.03]">
                       <div className="flex items-center gap-4">
                          <button onClick={startListening} className={`p-5 rounded-[1.8rem] transition-all shadow-premium-md ${isListening ? 'bg-brand-pink text-white animate-pulse' : 'bg-surface-soft text-brand-blue'}`}><Mic size={24} /></button>
                          <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAgenticCommand(chatMessage)} placeholder="Command: 'Send mail' or 'Schedule'..." className="flex-1 bg-surface-soft px-6 py-5 rounded-[1.8rem] text-[12px] font-bold outline-none" />
                          <button onClick={() => handleAgenticCommand(chatMessage)} disabled={isProcessing} className="p-5 bg-brand-black text-white rounded-[1.8rem] shadow-premium-md active:scale-95 disabled:opacity-50"><Send size={24} /></button>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
           <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-20 h-20 rounded-[2.5rem] shadow-premium-xl flex items-center justify-center border-4 border-white transition-all transform hover:scale-105 active:scale-95 ${isChatOpen ? 'bg-brand-pink text-white' : 'bg-brand-black text-white'}`}>{isChatOpen ? <X size={32} /> : <div className="relative"><Bot size={36} className="text-brand-blue" />{isSpeaking && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-brand-pink"></span></span>}</div>}</button>
        </div>
      </div>
    </div>
  );
}
