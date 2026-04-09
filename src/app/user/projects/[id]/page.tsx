'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, AlertCircle, Clock, Users,
  Building2, Calendar, TrendingUp, FolderKanban, Wallet,
  ChevronRight, GitBranch, UserCircle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Demo data ────────────────────────────────────────────────────────────────
const PROJECT_DB: Record<string, {
  name: string; status: string; fy: string; start: string; end: string;
  budget_total: number; budget_spent: number; description: string;
}> = {
  '1': { name: 'Project Phoenix',  status: 'active', fy: '2025-26', start: '2025-09-01', end: '2026-06-30', budget_total: 50, budget_spent: 34, description: 'End-to-end IT infrastructure modernization including cloud migration, server upgrades, and network optimization.' },
  '2': { name: 'Enterprise Suite', status: 'active', fy: '2025-26', start: '2025-06-01', end: '2026-03-31', budget_total: 80, budget_spent: 72, description: 'Custom enterprise software suite for operations, HR, and supply chain management.' },
  '3': { name: 'Supply Chain AI',  status: 'active', fy: '2025-26', start: '2025-11-15', end: '2026-09-30', budget_total: 35, budget_spent: 18, description: 'AI-powered supply chain optimization with demand forecasting and automated procurement.' },
};

type TatStatus = 'completed' | 'on_track' | 'at_risk' | 'breached' | 'upcoming';
const tatColors: Record<TatStatus, { bg: string; text: string; dot: string }> = {
  completed: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  on_track:  { bg: 'bg-blue-500/10',  text: 'text-blue-400',  dot: 'bg-blue-400' },
  at_risk:   { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  breached:  { bg: 'bg-red-500/10',   text: 'text-red-400',   dot: 'bg-red-400' },
  upcoming:  { bg: 'bg-gray-500/10',  text: 'text-gray-400',  dot: 'bg-gray-500' },
};

const MILESTONES = [
  { name: 'Requirements Gathering', due: '2025-10-15', vendor: 'Acme Corp',       status: 'completed' as TatStatus },
  { name: 'Architecture Design',    due: '2025-11-30', vendor: 'Prime Solutions',  status: 'completed' as TatStatus },
  { name: 'Server Procurement',     due: '2025-12-20', vendor: 'Acme Corp',       status: 'completed' as TatStatus },
  { name: 'Network Setup',          due: '2026-01-15', vendor: 'Delta Exports',    status: 'completed' as TatStatus },
  { name: 'Development Sprint 1',   due: '2026-02-28', vendor: 'Prime Solutions',  status: 'completed' as TatStatus },
  { name: 'QC Phase 1',             due: '2026-03-15', vendor: 'Nova Industries',  status: 'on_track'  as TatStatus },
  { name: 'Development Sprint 2',   due: '2026-04-15', vendor: 'Prime Solutions',  status: 'at_risk'   as TatStatus },
  { name: 'Integration Testing',    due: '2026-04-30', vendor: 'Acme Corp',       status: 'upcoming'  as TatStatus },
  { name: 'UAT',                    due: '2026-05-20', vendor: 'All',              status: 'upcoming'  as TatStatus },
  { name: 'Go Live',                due: '2026-06-15', vendor: 'All',              status: 'upcoming'  as TatStatus },
];

const TEAM = {
  head_pm: { name: 'Asha Mehra', role: 'Head PM' },
  pms: [
    { name: 'Rajesh Kumar', role: 'Project Manager' },
    { name: 'Priya Nair', role: 'Project Manager' },
  ],
  jr_pms: [
    { name: 'Vikram Singh', role: 'Jr. PM' },
    { name: 'Ananya Das', role: 'Jr. PM' },
  ],
  finance: { name: 'Dinesh Gupta', role: 'Finance Lead' },
  vendors: ['Acme Corp', 'Prime Solutions', 'Delta Exports'],
};

const PROJECT_VENDORS = [
  { name: 'Acme Corp',        role: 'Infrastructure', risk: 'low' as const,    score: 85, invoices: 3, active_cases: 1 },
  { name: 'Prime Solutions',  role: 'Development',    risk: 'low' as const,    score: 78, invoices: 5, active_cases: 0 },
  { name: 'Delta Exports',    role: 'Networking',     risk: 'medium' as const, score: 62, invoices: 2, active_cases: 2 },
];

const BUDGET_TREND = [
  { month: 'Sep', planned: 4, actual: 3 },
  { month: 'Oct', planned: 8, actual: 7 },
  { month: 'Nov', planned: 12, actual: 11 },
  { month: 'Dec', planned: 18, actual: 16 },
  { month: 'Jan', planned: 24, actual: 22 },
  { month: 'Feb', planned: 30, actual: 28 },
  { month: 'Mar', planned: 36, actual: 34 },
];

const riskColor = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };

type TabId = 'overview' | 'team' | 'tat' | 'vendors' | 'finance';

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id as string;
  const project = PROJECT_DB[id];
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Project not found</p>
        <Link href="/user/projects" className="text-primary-blue text-sm hover:underline mt-2 inline-block">← Back to projects</Link>
      </div>
    );
  }

  const pct = Math.round((project.budget_spent / project.budget_total) * 100);
  const isOver = project.budget_spent > project.budget_total;
  const statusCls = project.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    project.status === 'on_hold' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border-gray-500/30';

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview',  icon: FolderKanban },
    { id: 'team',     label: 'Team Map',  icon: GitBranch },
    { id: 'tat',      label: 'TAT',       icon: Clock },
    { id: 'vendors',  label: 'Vendors',   icon: Building2 },
    { id: 'finance',  label: 'Finance',   icon: Wallet },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1200px] mx-auto">
      <Link href="/user/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusCls}`}>{project.status}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">FY {project.fy} · {project.start} → {project.end}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Budget Burn</p>
              <p className={`text-lg font-bold ${isOver ? 'text-red-400' : 'text-primary-blue'}`}>{pct}%</p>
            </div>
            <div className="w-24 bg-white/5 rounded-full h-2 overflow-hidden">
              <div className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-gradient-to-r from-primary-blue to-primary-violet'}`}
                style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
          </div>
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

      {/* ── Overview ───────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass p-5">
            <h3 className="font-semibold mb-2">Project Description</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Team Size', value: TEAM.pms.length + TEAM.jr_pms.length + 2, icon: Users, color: 'text-blue-400' },
              { label: 'Active Vendors', value: PROJECT_VENDORS.length, icon: Building2, color: 'text-purple-400' },
              { label: 'Milestones', value: `${MILESTONES.filter(m => m.status === 'completed').length}/${MILESTONES.length}`, icon: CheckCircle, color: 'text-green-400' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass p-4 flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl"><Icon size={22} className={s.color} /></div>
                  <div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Team Map ───────────────────────────────────────────────────── */}
      {activeTab === 'team' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6">
          <h3 className="font-semibold mb-6 text-center">Organization Chart</h3>
          <div className="flex flex-col items-center gap-1">
            {/* Head PM */}
            <div className="px-5 py-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl text-center">
              <p className="font-semibold">{TEAM.head_pm.name}</p>
              <p className="text-xs text-violet-400">{TEAM.head_pm.role}</p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            {/* PMs + Finance */}
            <div className="flex gap-8 items-start">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-4">
                  {TEAM.pms.map(pm => (
                    <div key={pm.name} className="px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                      <p className="text-sm font-medium">{pm.name}</p>
                      <p className="text-xs text-blue-400">{pm.role}</p>
                    </div>
                  ))}
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex gap-4">
                  {TEAM.jr_pms.map(j => (
                    <div key={j.name} className="px-3 py-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-center">
                      <p className="text-sm font-medium">{j.name}</p>
                      <p className="text-xs text-sky-400">{j.role}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                  <p className="text-sm font-medium">{TEAM.finance.name}</p>
                  <p className="text-xs text-green-400">{TEAM.finance.role}</p>
                </div>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            {/* Vendors */}
            <div className="flex gap-3">
              {TEAM.vendors.map(v => (
                <div key={v} className="px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
                  <p className="text-sm font-medium">{v}</p>
                  <p className="text-xs text-orange-400">Vendor</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAT (Milestones) ───────────────────────────────────────────── */}
      {activeTab === 'tat' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="font-semibold">TAT Milestones</h3>
            </div>
            <div className="divide-y divide-white/5">
              {MILESTONES.map((m, i) => {
                const tc = tatColors[m.status];
                return (
                  <motion.div key={m.name}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition"
                  >
                    <div className="relative flex flex-col items-center">
                      <span className={`w-3 h-3 rounded-full ${tc.dot}`} />
                      {i < MILESTONES.length - 1 && <div className="w-px h-full bg-white/10 absolute top-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.vendor}</p>
                    </div>
                    <p className="text-xs text-gray-400 hidden sm:block">{m.due}</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tc.bg} ${tc.text}`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Vendors ────────────────────────────────────────────────────── */}
      {activeTab === 'vendors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid md:grid-cols-3 gap-4">
            {PROJECT_VENDORS.map((v, i) => (
              <motion.div key={v.name}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-blue/10 flex items-center justify-center text-sm font-bold text-primary-blue">
                    {v.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Risk</span><span className={`font-medium ${riskColor[v.risk]}`}>{v.risk} ({v.score})</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Invoices</span><span>{v.invoices}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Active Cases</span><span>{v.active_cases}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Finance ────────────────────────────────────────────────────── */}
      {activeTab === 'finance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-5">
          <h3 className="font-semibold mb-4">Budget Trend — Planned vs Actual (₹ Lakhs)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BUDGET_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="planned" name="Planned" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
