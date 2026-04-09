'use client';

import { useState, ReactNode, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, FolderKanban, Wallet, UserCheck,
  FileBarChart, Bot, ChevronRight, Search, Bell,
  Settings, LogOut, Menu, X, Shield, Send, Mic, Loader2, Trash2
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

const INITIAL_MESSAGE = { role: 'bot', text: "Hi! I'm your CureVendAI assistant. How can I help you manage your vendors and projects today?" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([INITIAL_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Robust Scroll-to-Bottom
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
      router.push('/user/login');
      router.refresh();
    } catch (err) {
      window.location.href = '/user/login';
    }
  };

  const clearChat = () => {
    setChatHistory([INITIAL_MESSAGE]);
  };

  const handleAgenticCommand = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setChatMessage('');
    setIsProcessing(true);

    try {
      const responseText = await queryCureVendAI(text);
      setChatHistory(prev => [...prev, { role: 'bot', text: responseText }]);
      
      // Auto-navigation detection (optional but helpful)
      const t = text.toLowerCase();
      if (t.includes('finance') || t.includes('payment')) router.push('/user/finance');
      else if (t.includes('project')) router.push('/user/projects');
      
      // Background TTS
      fetch('/api/tts', { method: 'POST', body: JSON.stringify({ text: responseText }) }).catch(() => {});
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: "I hit a snag. Please ensure your Gemini key is correct." }]);
    } finally {
      setIsProcessing(false);
    }
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
               <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-pink transition-all active:scale-95">
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

        {/* ── CHATBOT UI FIXED ── */}
        <div className="fixed bottom-10 right-10 z-[1000]">
           <AnimatePresence>
              {isChatOpen && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="fixed bottom-32 right-12 w-[440px] h-[650px] bg-white rounded-[3rem] shadow-premium-2xl border border-black/[0.05] flex flex-col overflow-hidden"
                 >
                    {/* Header */}
                    <div className="p-8 bg-brand-black text-white flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Bot size={32} className="text-brand-blue" />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue leading-none mb-1">CureVendAI Assistant</p>
                             <p className="text-sm font-black text-white/90">Data Operations</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button onClick={clearChat} className="p-2.5 hover:bg-white/10 rounded-xl transition text-gray-400 hover:text-brand-pink" title="Clear History"><Trash2 size={18} /></button>
                          <button onClick={() => setIsChatOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition"><X size={20} /></button>
                       </div>
                    </div>

                    {/* Messages Area - FIXED SCROLLING */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-surface-soft/50 flex flex-col space-y-8 scroll-smooth">
                       {chatHistory.map((chat, i) => (
                          <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] p-6 rounded-[2.2rem] shadow-premium-md border border-black/[0.02] ${chat.role === 'user' ? 'bg-brand-black text-white rounded-tr-none' : 'bg-white text-brand-black rounded-tl-none'}`}>
                                <p className="text-[12px] font-bold leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                             </div>
                          </div>
                       ))}
                       {isProcessing && (
                          <div className="flex justify-start">
                             <div className="p-6 bg-white rounded-[2.2rem] shadow-premium-md border border-black/[0.02] animate-pulse">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Assistant is processing...</p>
                             </div>
                          </div>
                       )}
                       <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-8 bg-white border-t border-black/[0.03]">
                       <div className="flex items-center gap-4">
                          <input 
                             type="text" 
                             value={chatMessage} 
                             onChange={(e) => setChatMessage(e.target.value)} 
                             onKeyPress={(e) => e.key === 'Enter' && handleAgenticCommand(chatMessage)} 
                             placeholder="Ask your data questions..." 
                             className="flex-1 bg-surface-soft px-6 py-5 rounded-[1.8rem] text-[12px] font-bold outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                          />
                          <button 
                             onClick={() => handleAgenticCommand(chatMessage)} 
                             disabled={isProcessing}
                             className="p-5 bg-brand-black text-white rounded-[1.8rem] shadow-premium-md active:scale-95 disabled:opacity-50 transition-all"
                          >
                             <Send size={24} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

           <button 
              onClick={() => setIsChatOpen(!isChatOpen)} 
              className={`w-20 h-20 rounded-[2.5rem] shadow-premium-xl flex items-center justify-center border-4 border-white transition-all transform hover:scale-105 active:scale-95 ${isChatOpen ? 'bg-brand-pink text-white' : 'bg-brand-black text-white'}`}
           >
              {isChatOpen ? <X size={32} /> : <Bot size={36} className="text-brand-blue" />}
           </button>
        </div>
      </div>
    </div>
  );
}
