'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2, Search, Filter, LayoutGrid, List, ChevronRight,
  AlertCircle, CheckCircle, Clock, Shield, ExternalLink,
  MoreHorizontal, Users, FolderKanban, Plus,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type VendorStatus = 'active' | 'pending' | 'suspended';
type RiskLevel = 'low' | 'medium' | 'high';

// ── Demo data ────────────────────────────────────────────────────────────────
const VENDORS = [
  { id: '1', name: 'Acme Corp',         type: 'IT Services',   status: 'active'    as VendorStatus, risk: 'low'    as RiskLevel, score: 85, cases: 2, projects: 3, gst: '27AAPCT1234H1Z5', joined: '2025-06-15' },
  { id: '2', name: 'Nova Industries',    type: 'Manufacturing', status: 'active'    as VendorStatus, risk: 'low'    as RiskLevel, score: 92, cases: 0, projects: 2, gst: '29BBBPT5678K2Z8', joined: '2025-08-01' },
  { id: '3', name: 'Zenith Textiles',    type: 'Garments',      status: 'active'    as VendorStatus, risk: 'medium' as RiskLevel, score: 58, cases: 4, projects: 1, gst: '07CCCPT9012L3Z1', joined: '2025-09-20' },
  { id: '4', name: 'Apex Logistics',     type: 'Logistics',     status: 'suspended' as VendorStatus, risk: 'high'   as RiskLevel, score: 28, cases: 7, projects: 0, gst: '06DDDPT3456M4Z9', joined: '2025-03-10' },
  { id: '5', name: 'Prime Solutions',    type: 'IT Services',   status: 'active'    as VendorStatus, risk: 'low'    as RiskLevel, score: 78, cases: 1, projects: 4, gst: '33EEEPT7890N5Z2', joined: '2025-11-05' },
  { id: '6', name: 'Sigma Garments',     type: 'Garments',      status: 'pending'   as VendorStatus, risk: 'medium' as RiskLevel, score: 62, cases: 0, projects: 0, gst: '19FFFPT1234P6Z4', joined: '2026-03-28' },
  { id: '7', name: 'Delta Exports',      type: 'Import/Export', status: 'active'    as VendorStatus, risk: 'low'    as RiskLevel, score: 88, cases: 1, projects: 2, gst: '24GGGPT5678Q7Z7', joined: '2025-07-12' },
  { id: '8', name: 'Omega Tech',         type: 'IT Services',   status: 'pending'   as VendorStatus, risk: 'high'   as RiskLevel, score: 35, cases: 0, projects: 0, gst: '27HHHPT9012R8Z0', joined: '2026-04-01' },
];

const statusConfig: Record<VendorStatus, { label: string; cls: string; icon: React.ElementType }> = {
  active:    { label: 'Verified',    cls: 'bg-green-50 text-green-600 ring-1 ring-green-100',  icon: CheckCircle },
  pending:   { label: 'Assessing',   cls: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100', icon: Clock },
  suspended: { label: 'Suspended', cls: 'bg-red-50 text-brand-pink ring-1 ring-red-100',      icon: AlertCircle },
};

const riskConfig: Record<RiskLevel, { cls: string; barCls: string }> = {
  low:    { cls: 'text-brand-blue',  barCls: 'bg-brand-blue' },
  medium: { cls: 'text-brand-yellow', barCls: 'bg-brand-yellow' },
  high:   { cls: 'text-brand-pink',    barCls: 'bg-brand-pink' },
};

// ── Risk Gauge ────────────────────────────────────────────────────────────────
function RiskGauge({ score, risk }: { score: number; risk: RiskLevel }) {
  const cfg = riskConfig[risk];
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 max-w-[100px] bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${cfg.barCls} opacity-60`} 
        />
      </div>
      <span className={`text-[10px] font-black ${cfg.cls}`}>{score}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function VendorList() {
  const [statusFilter, setStatusFilter] = useState<'all' | VendorStatus>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'card'>('list');

  const filtered = VENDORS.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (riskFilter !== 'all' && v.risk !== riskFilter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-slide-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Vendors</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Registry of certified supply tier entities</p>
        </div>
        <Link href="/user/onboarding"
          className="flex items-center gap-3 px-8 py-3.5 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95"
        >
          <Plus size={18} /> Add Enterprise
        </Link>
      </div>

      {/* Control Bar */}
      <div className="glass p-5 rounded-[2rem] bg-white/60 border-white shadow-premium-lg flex flex-wrap items-center gap-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search registry by company, GST or type..." 
            className="w-full pl-14 pr-6 py-3.5 bg-surface-soft border border-black/[0.02] rounded-2xl text-[11px] font-black text-brand-black placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition uppercase tracking-widest"
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Status Tabs */}
          <div className="flex p-1.5 bg-surface-soft rounded-2xl border border-black/[0.02] shadow-sm">
            {(['all', 'active', 'pending'] as const).map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === s 
                    ? 'bg-white text-brand-black shadow-premium-md ring-1 ring-black/[0.03]' 
                    : 'text-gray-400 hover:text-brand-black'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex p-1.5 bg-surface-soft rounded-2xl border border-black/[0.02] shadow-sm">
            <button 
              onClick={() => setView('list')} 
              className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white text-brand-black shadow-premium-md ring-1 ring-black/[0.03]' : 'text-gray-300'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setView('card')} 
              className={`p-2 rounded-xl transition-all ${view === 'card' ? 'bg-white text-brand-black shadow-premium-md ring-1 ring-black/[0.03]' : 'text-gray-300'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-[2rem] overflow-hidden border-white bg-white/60 shadow-premium-lg"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-soft/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-black/[0.02]">
                    <th className="px-10 py-6 text-left">Enterprise</th>
                    <th className="px-8 py-6 text-left">Audit Score</th>
                    <th className="px-8 py-6 text-left">Fidelity Status</th>
                    <th className="px-8 py-6 text-left">Ecosystem Role</th>
                    <th className="px-10 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.02]">
                  {filtered.map((v, i) => {
                    const st = statusConfig[v.status];
                    const StatusIcon = st.icon;
                    return (
                      <motion.tr 
                        key={v.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group hover:bg-white transition-colors cursor-pointer"
                      >
                        <td className="px-10 py-6">
                          <Link href={`/user/vendors/${v.id}`} className="flex items-center gap-5">
                            <div className="w-11 h-11 rounded-2xl bg-surface-soft border border-black/[0.03] flex items-center justify-center text-[10px] font-black text-brand-black group-hover:scale-110 group-hover:bg-brand-black group-hover:text-white transition-all shadow-premium-sm">
                              {v.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-black text-brand-black text-sm group-hover:text-brand-blue transition">{v.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.gst}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-8 py-6"><RiskGauge score={v.score} risk={v.risk} /></td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${st.cls}`}>
                            <StatusIcon size={14} /> {st.label}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                          {v.type}
                        </td>
                        <td className="px-10 py-6 text-right text-gray-300 group-hover:text-brand-black transition-colors">
                           <ChevronRight size={20} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-24 text-center">
                  <Building2 size={64} className="mx-auto text-gray-200 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 underline underline-offset-8 decoration-gray-100">Zero entities found in the selected domain</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
          >
            {filtered.map((v, i) => {
              const st = statusConfig[v.status];
              const StatusIcon = st.icon;
              return (
                <motion.div 
                  key={v.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/user/vendors/${v.id}`} className="block glass p-8 rounded-[2.5rem] border-white bg-white shadow-premium-lg hover:border-brand-blue/30 transition-all">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-surface-soft border border-black/[0.03] flex items-center justify-center text-xs font-black text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shadow-premium-sm">
                        {v.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${st.cls}`}>
                        <StatusIcon size={12} /> {st.label}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-brand-black group-hover:text-brand-blue transition mb-1 tracking-tight">{v.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">{v.type}</p>
                    
                    <div className="space-y-6 pt-8 border-t border-black/[0.03]">
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Score</span>
                          <span className={`text-[11px] font-black ${riskConfig[v.risk].cls}`}>{v.score}%</span>
                        </div>
                        <RiskGauge score={v.score} risk={v.risk} />
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                               <FolderKanban size={14} className="text-brand-blue" /> {v.projects}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                               <AlertCircle size={14} className="text-brand-pink" /> {v.cases}
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-gray-200 group-hover:text-brand-black transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
