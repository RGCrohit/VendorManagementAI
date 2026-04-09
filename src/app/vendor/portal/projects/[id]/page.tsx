'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, AlertCircle, Clock, Mail, Phone,
  FileText, Upload, Calendar, ChevronRight, Truck, ClipboardCheck,
  User,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type TatStatus = 'completed' | 'on_track' | 'at_risk' | 'upcoming';
type TabId = 'updates' | 'tat' | 'qc' | 'shipping' | 'invoices';

const tatColors: Record<TatStatus, { bg: string; text: string; dot: string }> = {
  completed: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  on_track:  { bg: 'bg-blue-500/10',  text: 'text-blue-400',  dot: 'bg-blue-400' },
  at_risk:   { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  upcoming:  { bg: 'bg-gray-500/10',  text: 'text-gray-400',  dot: 'bg-gray-500' },
};

// ── Demo Data ─────────────────────────────────────────────────────────────────
const PROJECT = {
  name: 'Project Phoenix',
  phase: 'Development Sprint 2',
  status: 'active',
  pm: { name: 'Rajesh Kumar', email: 'rajesh@curevendai.io', phone: '+91 98765 43210', role: 'Project Manager' },
};

const MILESTONES = [
  { name: 'Requirements Sign-off',   due: '2025-10-15', status: 'completed' as TatStatus },
  { name: 'Server Procurement',      due: '2025-12-20', status: 'completed' as TatStatus },
  { name: 'Network Setup',           due: '2026-01-15', status: 'completed' as TatStatus },
  { name: 'Development Sprint 1',    due: '2026-02-28', status: 'completed' as TatStatus },
  { name: 'QC Phase 1',              due: '2026-03-15', status: 'on_track'  as TatStatus },
  { name: 'Development Sprint 2',    due: '2026-04-15', status: 'at_risk'   as TatStatus },
  { name: 'Integration Testing',     due: '2026-04-30', status: 'upcoming'  as TatStatus },
  { name: 'Go Live',                 due: '2026-06-15', status: 'upcoming'  as TatStatus },
];

const QC_ITEMS = [
  { item: 'Server load test — 10k concurrent',    status: 'passed' },
  { item: 'Network latency < 50ms',               status: 'passed' },
  { item: 'Data backup verification',             status: 'passed' },
  { item: 'Security vulnerability scan',          status: 'pending' },
  { item: 'API response time < 200ms',            status: 'pending' },
  { item: 'Documentation completeness',           status: 'failed' },
];

const UPDATES = [
  { date: '2026-04-08', author: 'Rajesh Kumar', msg: 'Sprint 2 delayed by 3 days due to dependency issues. Adjusted timeline shared.' },
  { date: '2026-04-05', author: 'System', msg: 'QC Phase 1 marked as on-track. 3/5 checks passed.' },
  { date: '2026-03-28', author: 'Priya Nair', msg: 'Sprint 1 completed successfully. All deliverables accepted.' },
  { date: '2026-03-15', author: 'System', msg: 'Invoice INV-2026-038 approved and payment processed.' },
];

export default function VendorProjectDetail() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<TabId>('updates');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'updates',  label: 'Updates',     icon: ChevronRight },
    { id: 'tat',      label: 'TAT Timeline', icon: Clock },
    { id: 'qc',       label: 'QC Checklist', icon: ClipboardCheck },
    { id: 'shipping', label: 'Shipment',     icon: Truck },
    { id: 'invoices', label: 'Invoices',     icon: FileText },
  ];

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/vendor/portal" className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent">{PROJECT.name}</h1>
            <p className="text-xs text-gray-500">Phase: {PROJECT.phase}</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* PM Contact Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{PROJECT.pm.name}</p>
            <p className="text-xs text-blue-400">{PROJECT.pm.role}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href={`mailto:${PROJECT.pm.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition">
              <Mail size={14} /> Email
            </a>
            <a href={`tel:${PROJECT.pm.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition">
              <Phone size={14} /> Call
            </a>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary-blue text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Updates ──────────────────────────────────────────────────── */}
        {activeTab === 'updates' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {UPDATES.map((u, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="glass p-4 flex gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-primary-blue mt-2 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{u.author}</span>
                    <span className="text-xs text-gray-600">{u.date}</span>
                  </div>
                  <p className="text-sm text-gray-400">{u.msg}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── TAT Timeline ─────────────────────────────────────────────── */}
        {activeTab === 'tat' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Horizontal scrolling timeline */}
            <div className="glass p-5 overflow-x-auto">
              <div className="flex items-start gap-0 min-w-[700px]">
                {MILESTONES.map((m, i) => {
                  const tc = tatColors[m.status];
                  return (
                    <div key={m.name} className="flex-1 flex flex-col items-center text-center relative">
                      {/* Connector line */}
                      {i > 0 && (
                        <div className={`absolute top-3 right-1/2 w-full h-0.5 -z-10 ${
                          m.status === 'completed' ? 'bg-green-500/50' : 'bg-white/10'
                        }`} />
                      )}
                      {/* Dot */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tc.dot} mb-2 z-10 ring-4 ring-dark-navy`}>
                        {m.status === 'completed' && <CheckCircle size={14} className="text-white" />}
                        {m.status === 'at_risk' && <AlertCircle size={14} className="text-white" />}
                      </div>
                      <p className="text-xs font-medium mb-0.5 px-1">{m.name}</p>
                      <p className="text-xs text-gray-600">{m.due}</p>
                      <span className={`mt-1 px-2 py-0.5 rounded-full text-xs ${tc.bg} ${tc.text}`}>
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── QC Checklist ─────────────────────────────────────────────── */}
        {activeTab === 'qc' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="font-semibold">Quality Checklist</h3>
              <p className="text-xs text-gray-500">{QC_ITEMS.filter(q => q.status === 'passed').length}/{QC_ITEMS.length} checks passed</p>
            </div>
            <div className="divide-y divide-white/5">
              {QC_ITEMS.map((q, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition">
                  {q.status === 'passed' && <CheckCircle size={16} className="text-green-400 flex-shrink-0" />}
                  {q.status === 'pending' && <Clock size={16} className="text-yellow-400 flex-shrink-0" />}
                  {q.status === 'failed' && <AlertCircle size={16} className="text-red-400 flex-shrink-0" />}
                  <span className="text-sm flex-1">{q.item}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    q.status === 'passed' ? 'bg-green-500/10 text-green-400' :
                    q.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{q.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Shipment ─────────────────────────────────────────────────── */}
        {activeTab === 'shipping' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 text-center">
            <Truck size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Shipment tracking will appear here when connected to the logistics backend</p>
          </motion.div>
        )}

        {/* ── Invoices (Upload) ────────────────────────────────────────── */}
        {activeTab === 'invoices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Upload area */}
            <div className="glass p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Upload size={16} className="text-primary-blue" /> Upload Invoice</h3>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                uploading ? 'border-primary-blue/50 bg-primary-blue/5' : 'border-white/10 hover:border-white/20'
              }`}>
                {uploading ? (
                  <div>
                    <div className="w-8 h-8 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Processing OCR scan...</p>
                  </div>
                ) : uploadSuccess ? (
                  <div>
                    <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-green-400">Invoice processed — 3 line items extracted</p>
                    <p className="text-xs text-gray-500 mt-1">Total: ₹3,45,000 · Ready to submit</p>
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg text-sm font-semibold hover:shadow-glow transition">
                      Submit Invoice
                    </button>
                  </div>
                ) : (
                  <div>
                    <FileText size={32} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Drag & drop your invoice PDF here</p>
                    <p className="text-xs text-gray-600 mb-4">or click to browse. AI will extract line items automatically.</p>
                    <button onClick={simulateUpload}
                      className="px-6 py-2 bg-primary-blue/10 border border-primary-blue/20 rounded-lg text-sm text-primary-blue font-medium hover:bg-primary-blue/20 transition"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Past invoices */}
            <div className="glass overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10">
                <h3 className="font-semibold text-sm">Submitted Invoices</h3>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { id: 'INV-2026-042', amount: '₹3,45,000', date: '2026-04-02', status: 'Pending' },
                  { id: 'INV-2026-038', amount: '₹2,30,000', date: '2026-03-20', status: 'Paid' },
                ].map(inv => (
                  <div key={inv.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition">
                    <div>
                      <p className="text-sm font-mono text-primary-blue">{inv.id}</p>
                      <p className="text-xs text-gray-600">{inv.date}</p>
                    </div>
                    <p className="text-sm font-semibold">{inv.amount}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>{inv.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
