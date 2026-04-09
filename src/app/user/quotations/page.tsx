'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileBarChart, ChevronDown, CheckCircle, AlertCircle,
  Building2, IndianRupee, Clock, Shield, Bot, Sparkles,
} from 'lucide-react';

// ── Demo data ────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: '1', name: 'Project Phoenix' },
  { id: '2', name: 'Enterprise Suite' },
  { id: '3', name: 'Supply Chain AI' },
];

const RFQS: Record<string, { id: string; title: string; vendors: number; deadline: string; quotations: {
  vendor: string; risk: 'low' | 'medium' | 'high'; total: string; items: { desc: string; qty: number; rate: string; amount: string }[];
  delivery_weeks: number; sla: string; score: number;
}[] }[]> = {
  '1': [
    { id: 'RFQ-001', title: 'Server Infrastructure Setup', vendors: 3, deadline: '2026-04-20', quotations: [
      { vendor: 'Acme Corp', risk: 'low', total: '₹12,50,000', items: [
        { desc: 'Dell PowerEdge R750 × 4', qty: 4, rate: '₹2,10,000', amount: '₹8,40,000' },
        { desc: 'Network cabling', qty: 1, rate: '₹1,50,000', amount: '₹1,50,000' },
        { desc: 'Setup & config labor', qty: 1, rate: '₹2,60,000', amount: '₹2,60,000' },
      ], delivery_weeks: 6, sla: '99.9% uptime guarantee, 4hr response SLA', score: 88 },
      { vendor: 'Prime Solutions', risk: 'low', total: '₹14,20,000', items: [
        { desc: 'HP ProLiant DL380 × 4', qty: 4, rate: '₹2,55,000', amount: '₹10,20,000' },
        { desc: 'Networking infra', qty: 1, rate: '₹1,80,000', amount: '₹1,80,000' },
        { desc: 'Deployment + training', qty: 1, rate: '₹2,20,000', amount: '₹2,20,000' },
      ], delivery_weeks: 8, sla: '99.5% uptime, 8hr response SLA', score: 78 },
      { vendor: 'Omega Tech', risk: 'high', total: '₹9,80,000', items: [
        { desc: 'Custom-built servers × 4', qty: 4, rate: '₹1,70,000', amount: '₹6,80,000' },
        { desc: 'Basic cabling', qty: 1, rate: '₹80,000', amount: '₹80,000' },
        { desc: 'Installation only', qty: 1, rate: '₹2,20,000', amount: '₹2,20,000' },
      ], delivery_weeks: 10, sla: 'Best-effort basis', score: 35 },
    ]},
    { id: 'RFQ-002', title: 'Cloud Migration Services', vendors: 2, deadline: '2026-04-25', quotations: [] },
  ],
  '2': [{ id: 'RFQ-003', title: 'UI/UX Design Sprint', vendors: 2, deadline: '2026-04-18', quotations: [] }],
  '3': [],
};

const riskColors = { low: 'bg-green-500/10 text-green-400', medium: 'bg-yellow-500/10 text-yellow-400', high: 'bg-red-500/10 text-red-400' };

export default function QuotationComparison() {
  const [selectedProject, setSelectedProject] = useState('1');
  const [expandedRFQ, setExpandedRFQ] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const rfqs = RFQS[selectedProject] || [];

  const requestAI = (rfqId: string) => {
    setAiAnalysis('loading');
    setTimeout(() => {
      setAiAnalysis(
        `📊 **AI Recommendation for ${rfqId}:**\n\n` +
        `**Best Value:** Acme Corp — competitive pricing with excellent SLA (99.9% uptime). Risk score: 88/100.\n\n` +
        `**Cheapest:** Omega Tech at ₹9.8L, but HIGH risk (score: 35). No uptime guarantee. Not recommended.\n\n` +
        `**Balanced Pick:** Acme Corp provides best risk-adjusted value. ₹2.7L more than Omega but includes enterprise-grade SLA and proven compliance record.\n\n` +
        `💡 Suggestion: Negotiate with Acme Corp on labor cost (₹2.6L) — market rate is closer to ₹2.2L for similar scope.`
      );
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1400px] mx-auto">

      <div>
        <h1 className="text-2xl font-bold">Quotation Comparison</h1>
        <p className="text-sm text-gray-500">Compare vendor quotations side-by-side with AI analysis</p>
      </div>

      {/* Project selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Project:</span>
        <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setExpandedRFQ(null); setAiAnalysis(null); }}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:border-primary-blue outline-none"
        >
          {PROJECTS.map(p => <option key={p.id} value={p.id} className="bg-dark-navy">{p.name}</option>)}
        </select>
      </div>

      {/* RFQ Cards */}
      {rfqs.length === 0 ? (
        <div className="glass p-16 text-center">
          <FileBarChart size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">No RFQs for this project yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rfqs.map(rfq => (
            <motion.div key={rfq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden">
              {/* RFQ Header */}
              <button onClick={() => { setExpandedRFQ(expandedRFQ === rfq.id ? null : rfq.id); setAiAnalysis(null); }}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-primary-blue/10 rounded-lg">
                    <FileBarChart size={18} className="text-primary-blue" />
                  </div>
                  <div>
                    <p className="font-semibold">{rfq.title}</p>
                    <p className="text-xs text-gray-500">{rfq.id} · {rfq.vendors} vendor{rfq.vendors !== 1 ? 's' : ''} submitted · Due {rfq.deadline}</p>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedRFQ === rfq.id ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded: Quotation Cards */}
              <AnimatePresence>
                {expandedRFQ === rfq.id && rfq.quotations.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-gray-400">Side-by-side comparison</p>
                        <button onClick={() => requestAI(rfq.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 text-primary-blue rounded-lg text-xs font-medium hover:bg-primary-blue/20 transition"
                        >
                          <Sparkles size={13} /> AI Analysis
                        </button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        {rfq.quotations.map((q, i) => (
                          <motion.div key={q.vendor}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition"
                          >
                            {/* Vendor header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-blue/10 flex items-center justify-center text-xs font-bold text-primary-blue">
                                  {q.vendor.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                </div>
                                <p className="font-semibold text-sm">{q.vendor}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[q.risk]}`}>
                                {q.risk}
                              </span>
                            </div>

                            {/* Total */}
                            <p className="text-2xl font-bold text-white mb-3">{q.total}</p>

                            {/* Line items */}
                            <div className="space-y-1.5 mb-4">
                              {q.items.map((item, j) => (
                                <div key={j} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0">
                                  <span className="text-gray-400 truncate mr-2">{item.desc}</span>
                                  <span className="text-gray-300 flex-shrink-0">{item.amount}</span>
                                </div>
                              ))}
                            </div>

                            {/* Meta */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock size={12} /> {q.delivery_weeks} weeks delivery
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Shield size={12} /> {q.sla}
                              </div>
                            </div>

                            {/* Score + Select */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <span className="text-xs text-gray-500">Score: <span className="font-bold text-white">{q.score}/100</span></span>
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg text-xs font-semibold hover:shadow-glow transition">
                                <CheckCircle size={12} /> Select
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* AI Analysis Panel */}
                      {aiAnalysis && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-5 bg-primary-blue/5 border border-primary-blue/20 rounded-xl"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Bot size={18} className="text-primary-blue" />
                            <span className="font-semibold text-sm text-primary-blue">AI Analysis</span>
                          </div>
                          {aiAnalysis === 'loading' ? (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <div className="w-4 h-4 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin" />
                              Analyzing quotations...
                            </div>
                          ) : (
                            <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{aiAnalysis}</p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {expandedRFQ === rfq.id && rfq.quotations.length === 0 && (
                      <div className="p-8 text-center text-gray-600 text-sm">No quotations submitted yet for this RFQ</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
