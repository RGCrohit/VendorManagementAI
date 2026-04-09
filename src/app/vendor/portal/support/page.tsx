'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Ticket, 
  Send, Plus, Loader2, Sparkles,
  Clock, AlertCircle, Building2,
  ChevronRight, Headphones
} from 'lucide-react';

const MOCK_TICKETS = [
  { id: 'TKT-102', subject: 'Invoice Payment Delay', priority: 'high', status: 'open', date: '2026-04-08' },
  { id: 'TKT-098', subject: 'GST Document Update Query', priority: 'medium', status: 'resolved', date: '2026-04-05' },
  { id: 'TKT-105', subject: 'New Project Access Request', priority: 'low', status: 'in_progress', date: '2026-04-10' },
];

export default function VendorSupport() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agent' | 'tickets'>('agent');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your CureVendAI Support Intelligence. How can I assist you with your projects, KYC, or payments today?" }
  ]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMsg = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    // Auto-reply simulation
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', text: "I've received your request. Our support team has been notified, and I'm currently scanning your project data to provide a relevant update." }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-slide-in overflow-hidden">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-1">Support Central</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px]">Vendor Assistance / Active Session</p>
        </div>
        <div className="flex p-1 bg-white border border-black/[0.03] rounded-2xl shadow-premium-sm">
           <button onClick={() => setActiveTab('agent')} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${activeTab === 'agent' ? 'bg-brand-black text-white' : 'text-gray-400'}`}><Sparkles size={14} /> AI Intel</button>
           <button onClick={() => setActiveTab('tickets')} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${activeTab === 'tickets' ? 'bg-brand-black text-white' : 'text-gray-400'}`}><Ticket size={14} /> My Tickets</button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
         {/* Main Content Area */}
         <div className="flex-1 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
               {activeTab === 'agent' ? (
                 <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 glass p-0 bg-white border-white shadow-premium-xl rounded-[2.5rem] flex flex-col overflow-hidden relative">
                    {/* Chat Header */}
                    <div className="px-8 py-6 border-b border-black/[0.03] flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-brand-blue shadow-glow-blue flex items-center justify-center text-white"><Headphones size={20} /></div>
                          <div>
                             <h3 className="text-sm font-black text-brand-black uppercase tracking-widest leading-none">AI Support Terminal</h3>
                             <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest mt-1">Operational • Active Response Mode</p>
                          </div>
                       </div>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                       {messages.map((m, i) => (
                         <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-5 rounded-[2rem] text-xs font-bold leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-brand-black text-white rounded-br-none' : 'bg-surface-soft text-brand-black rounded-bl-none border border-black/[0.02]'}`}>
                               {m.text}
                            </div>
                         </div>
                       ))}
                    </div>
                    {/* Input */}
                    <div className="p-6 bg-surface-soft/50 border-t border-black/[0.02]">
                       <div className="relative">
                          <input 
                             value={inputValue}
                             onChange={(e) => setInputValue(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                             type="text" 
                             placeholder="Ask about project delays, KYC status, or payments..." 
                             className="w-full pl-6 pr-20 py-5 bg-white rounded-[2rem] shadow-premium-lg text-xs font-bold outline-none border border-black/[0.03] focus:border-brand-blue/30 transition-all" 
                          />
                          <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-black text-white rounded-[1.5rem] flex items-center justify-center hover:shadow-glow transition-all active:scale-95">
                             <Send size={18} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="tickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 glass p-8 bg-white border-white shadow-premium-xl rounded-[2.5rem] flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black text-brand-black tracking-tighter">Support Incident Log</h2>
                       <button className="flex items-center gap-2 px-4 py-2 bg-brand-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-premium-md hover:shadow-glow-pink transition-all active:scale-95"><Plus size={14} /> New Ticket</button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                       {MOCK_TICKETS.map((t) => (
                         <div key={t.id} className="p-5 rounded-[1.5rem] bg-surface-soft hover:bg-white border border-transparent hover:border-black/[0.03] transition-all group flex items-center gap-6 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all"><Ticket size={18} /></div>
                            <div className="flex-1 min-w-0">
                               <h3 className="text-sm font-black text-brand-black truncate mb-1">{t.subject}</h3>
                               <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t.id} • Assigned to Admin • {t.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <PriorityBadge priority={t.priority} />
                               <StatusBadge status={t.status} />
                               <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-black transition-colors" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Sidebar Area: Quick Help */}
         <div className="w-80 flex flex-col gap-6 flex-shrink-0">
            <div className="glass p-6 bg-white border-white shadow-premium-lg rounded-[2.5rem]">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Common Solutions</h4>
               <div className="space-y-4">
                  <SolutionItem label="KYC Document Rejected?" icon={AlertCircle} />
                  <SolutionItem label="Update Banking Details" icon={Building2} />
                  <SolutionItem label="Payment Cycle FAQ" icon={Clock} />
               </div>
            </div>
            <div className="flex-1 glass p-8 bg-brand-blue text-white shadow-premium-lg rounded-[2.5rem] flex flex-col justify-end gap-4">
               <div className="p-3 bg-white/20 rounded-2xl w-fit"><MessageSquare size={24} /></div>
               <div>
                  <h4 className="text-lg font-black tracking-tight leading-tight">Emergency Assistance</h4>
                  <p className="text-xs font-bold text-white/70 mt-2 leading-relaxed uppercase tracking-wider">Need immediate help with a critical invoice? Contact our financial ops directly.</p>
               </div>
               <button className="w-full py-4 bg-white text-brand-blue rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Request Call</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function SolutionItem({ label, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
       <div className="w-8 h-8 rounded-lg bg-surface-soft flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all"><Icon size={14} /></div>
       <span className="text-[11px] font-black text-brand-black group-hover:text-brand-blue transition-colors">{label}</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: any = {
    high: 'text-brand-pink bg-red-50',
    medium: 'text-brand-yellow bg-yellow-50',
    low: 'text-brand-blue bg-blue-50',
  };
  return <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${config[priority]}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    open: 'text-blue-600 bg-blue-50',
    resolved: 'text-green-600 bg-green-50',
    in_progress: 'text-purple-600 bg-purple-50',
  };
  return <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${config[status].replace('_', ' ')}`}>{status}</span>;
}
