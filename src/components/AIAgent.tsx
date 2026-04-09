'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Mic, X } from 'lucide-react';
import { useState } from 'react';

export function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; from: 'user' | 'agent' }>>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, from: 'user' }]);
    setInput('');

    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Processing your request... This is a demo response.',
        from: 'agent' 
      }]);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary-blue to-primary-violet hover:shadow-glow transition-all flex items-center justify-center"
        title="AI Agent"
      >
        <MessageCircle size={24} className="text-white" />
      </motion.button>

      {/* Chat panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 z-50 w-96 h-96 glass rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold">CureVendAI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-sm text-gray-400">
                  How can I help you with procurement today?
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.from === 'user'
                        ? 'bg-primary-blue/20 text-white'
                        : 'bg-white/5 text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask something..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue text-white placeholder-gray-500 text-sm"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-primary-blue/20 hover:bg-primary-blue/30 rounded-lg transition"
              >
                Send
              </button>
            </div>
            <button
              onClick={() => setIsListening(!isListening)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                isListening
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <Mic size={16} />
              {isListening ? 'Stop listening' : 'Voice command'}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
