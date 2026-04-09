'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, MicOff, Sparkles, User, Zap } from 'lucide-react';

// ── Suggested Prompts ─────────────────────────────────────────────────────────
const PROMPTS = [
  'Show vendor risk scores',
  'How much spent this FY?',
  'Create a case for Phoenix',
  'Draft email to Acme',
  'Which vendors have TAT breaches?',
  'Compare quotations for Project Atlas',
];

type Message = {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

export default function AIAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I\'m CureVendAI, your intelligent procurement assistant. I can help you analyze vendor data, review risk scores, draft communications, and much more. What would you like to know?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        role: 'ai',
        content: `I'll analyze that for you. Based on the current data:\n\n🔍 Processing: "${text.trim()}"\n\nThis feature will connect to the backend AI service at \`/ai/chat\` to provide real-time intelligent responses based on your vendor database, project data, and financial records.\n\nFor the hackathon demo, this shows the chat interface structure.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">

      {/* ── Chat Area ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-primary-violet flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[600px] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-blue text-white rounded-br-md'
                    : 'glass text-gray-200 rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-600'}`}>
                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="px-4 lg:px-6 pb-3">
            <p className="text-xs text-gray-500 mb-2">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="px-3 py-1.5 glass text-xs text-gray-300 hover:text-white hover:border-primary-blue/30 transition cursor-pointer"
                >
                  <Sparkles size={10} className="inline-block mr-1 text-primary-blue" /> {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/5 p-4 lg:px-6">
          <div className="flex items-center gap-3 max-w-[800px] mx-auto">
            {/* Voice Orb */}
            <button
              onClick={() => setIsListening(!isListening)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {isListening && <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />}
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask CureVendAI anything..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-primary-blue/50 outline-none transition"
              />
            </div>

            {/* Send */}
            <button onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-blue to-primary-violet flex items-center justify-center text-white disabled:opacity-30 hover:shadow-glow transition flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Context Panel ──────────────────────────────────────────────── */}
      <div className="hidden xl:flex flex-col w-[280px] border-l border-white/5 p-4 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Zap size={14} className="text-primary-blue" /> Agent Context
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Active Project',  value: 'Project Phoenix' },
            { label: 'Active Vendor',    value: 'Acme Corp' },
            { label: 'Your Role',        value: 'Project Manager' },
            { label: 'FY',               value: '2025-26' },
            { label: 'Unread Alerts',    value: '3' },
          ].map(item => (
            <div key={item.label} className="glass p-3">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-medium mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
