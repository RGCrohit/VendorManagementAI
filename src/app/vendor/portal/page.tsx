'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText, CheckCircle, Clock, AlertCircle,
  Building2, ChevronRight, BarChart3, Ticket, CalendarDays,
  LogOut, Bell, Settings, TrendingUp, RefreshCw, Plus, ExternalLink,
  ChevronLeft, ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { signOut } from '@/lib/auth/supabase';
import { useAuth } from '@/lib/hooks';

// ── Types ────────────────────────────────────────────────────────────────────
type InvoiceStatus = 'draft' | 'submitted' | 'pm_approved' | 'paid' | 'rejected';
type TatStatus = 'on_track' | 'at_risk' | 'breached';
type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ milestones = [] }: { milestones?: { date: string; label: string; color: string }[] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ day: number; label: string } | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const milestoneMap: Record<number, { label: string; color: string }[]> = {};
  milestones.forEach((m) => {
    const d = new Date(m.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!milestoneMap[day]) milestoneMap[day] = [];
      milestoneMap[day].push({ label: m.label, color: m.color });
    }
  });

  const prev = () => setViewDate(new Date(year, month - 1, 1));
  const next = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
    const dots = milestoneMap[d] || [];
    cells.push(
      <div
        key={d}
        onMouseEnter={() => dots.length > 0 && setTooltip({ day: d, label: dots.map(x => x.label).join(', ') })}
        onMouseLeave={() => setTooltip(null)}
        className={`relative flex flex-col items-center justify-center rounded-lg h-8 cursor-default transition-all ${
          isToday ? 'bg-primary-blue text-white font-bold' : 'hover:bg-white/5 text-gray-300'
        }`}
      >
        <span className="text-xs">{d}</span>
        {dots.length > 0 && (
          <div className="flex gap-0.5 mt-0.5">
            {dots.slice(0, 3).map((dot, i) => (
              <span key={i} className={`w-1 h-1 rounded-full ${dot.color}`} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <CalendarDays size={18} className="text-primary-blue" /> Project Calendar
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="p-1 rounded hover:bg-white/10 transition"><ChevronLeft size={16} className="text-gray-400" /></button>
          <span className="text-xs text-gray-400 min-w-[110px] text-center">{monthName}</span>
          <button onClick={next} className="p-1 rounded hover:bg-white/10 transition"><ChevronRightIcon size={16} className="text-gray-400" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>

      {tooltip && (
        <div className="absolute bottom-3 left-3 right-3 bg-dark-navy border border-primary-blue/30 rounded-lg p-2 text-xs text-gray-300 z-10">
          📌 {tooltip.label}
        </div>
      )}

      {milestones.length === 0 && (
        <p className="text-center text-xs text-gray-600 mt-3">No milestones this month</p>
      )}
    </div>
  );
}

// ── Status Badges ─────────────────────────────────────────────────────────────
const invoiceStatusConfig: Record<InvoiceStatus, { label: string; cls: string }> = {
  draft:       { label: 'Draft',       cls: 'bg-gray-500/10 text-gray-400' },
  submitted:   { label: 'Submitted',   cls: 'bg-yellow-500/10 text-yellow-400' },
  pm_approved: { label: 'PM Approved', cls: 'bg-blue-500/10 text-blue-400' },
  paid:        { label: 'Paid',        cls: 'bg-green-500/10 text-green-400' },
  rejected:    { label: 'Rejected',    cls: 'bg-red-500/10 text-red-400' },
};

const tatStatusConfig: Record<TatStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  on_track: { label: 'On Track',  cls: 'text-green-400', icon: <CheckCircle size={14} /> },
  at_risk:  { label: 'At Risk',   cls: 'text-yellow-400', icon: <AlertCircle size={14} /> },
  breached: { label: 'Breached',  cls: 'text-red-400',    icon: <AlertCircle size={14} /> },
};

const ticketPriorityConfig: Record<TicketPriority, string> = {
  low:      'bg-gray-500/10 text-gray-400',
  medium:   'bg-yellow-500/10 text-yellow-400',
  high:     'bg-orange-500/10 text-orange-400',
  critical: 'bg-red-500/10 text-red-400',
};

const ticketStatusConfig: Record<TicketStatus, string> = {
  open:        'bg-blue-500/10 text-blue-400',
  in_progress: 'bg-purple-500/10 text-purple-400',
  resolved:    'bg-green-500/10 text-green-400',
  closed:      'bg-gray-500/10 text-gray-400',
};

// ── Section Empty State ───────────────────────────────────────────────────────
function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 bg-white/5 rounded-full mb-4">
        <Icon size={28} className="text-gray-600" />
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
      <p className="text-gray-700 text-xs mt-1">Data will appear here once connected to the backend</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function VendorPortal() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'tickets' | 'calendar'>('overview');

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const stats = [
    { label: 'Project Assets',    value: '4', icon: BarChart3,   color: 'text-brand-blue',   bg: 'bg-brand-blue/10' },
    { label: 'Total Invoices',     value: '₹43.0L', icon: FileText,    color: 'text-brand-pink',   bg: 'bg-brand-pink/10' },
    { label: 'Wait for PM',   value: '₹8.5L', icon: Clock,       color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
    { label: 'Active Alerts',       value: '2', icon: Ticket,      color: 'text-brand-pink',  bg: 'bg-brand-pink/10' },
  ];

  // ── Sync with New Modules ───────────────────────────────────────────────────
  const projects: any[] = [
    { id: 1, name: 'Phoenix Sync', pm: 'Rajesh K.', timeline: 'Q2 2026', deadline: '2026-06-15', tat_status: 'on_track', budget_used: 68 },
    { id: 2, name: 'Enterprise Audit', pm: 'Sarah J.', timeline: 'Q2 2026', deadline: '2026-04-20', tat_status: 'at_risk', budget_used: 91 },
  ];

  const invoices: any[] = [
    { id: 'INV-7821', project: 'Phoenix Sync', amount: '₹12,40,000', date: '2026-04-05', due_date: '2026-04-20', status: 'paid' },
    { id: 'INV-7844', project: 'Enterprise Audit', amount: '₹8,50,000', date: '2026-04-10', due_date: '2026-04-25', status: 'submitted' },
  ];

  const tickets: any[] = [
    { id: 'TKT-102', subject: 'Invoice Payment Delay', project: 'Global Logistics', priority: 'high', status: 'open', created_at: '2026-04-08' },
  ];

  const milestones = [
    { date: '2026-04-12', label: 'Phoenix Sprint Review', color: 'bg-brand-blue' },
    { date: '2026-04-20', label: 'Audit Sign-off', color: 'bg-brand-pink' },
  ];

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-primary-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.company_name || profile?.full_name || profile?.username || profile?.email || 'Vendor';
  const isKycComplete = profile?.gst_number && profile?.pan_number && profile?.bank_account;

  return (
    <div className="min-h-screen bg-dark-navy text-white">

      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-blue/20 rounded-lg">
              <Building2 size={20} className="text-primary-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent leading-tight">
                Vendor Portal
              </h1>
              <p className="text-xs text-gray-400">{displayName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isKycComplete && (
              <Link href="/vendor/portal/kyc"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 transition"
              >
                <AlertCircle size={13} /> Complete KYC
              </Link>
            )}
            <button className="p-2 rounded-lg hover:bg-white/5 transition text-gray-400 hover:text-white">
              <Bell size={18} />
            </button>
            <Link href="/vendor/portal/kyc"
              className="p-2 rounded-lg hover:bg-white/5 transition text-gray-400 hover:text-white"
            >
              <Settings size={18} />
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition text-sm"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* KYC Banner */}
        {!isKycComplete && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-400">KYC Incomplete</p>
                <p className="text-xs text-gray-400">Add your GST, PAN & banking details to unlock invoice processing.</p>
              </div>
            </div>
            <Link href="/vendor/portal/kyc"
              className="flex-shrink-0 px-4 py-2 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold hover:bg-yellow-500/30 transition"
            >
              Complete Now →
            </Link>
          </motion.div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <div className={`p-2 rounded-lg ${s.bg}`}>
                    <Icon size={16} className={s.color} />
                  </div>
                </div>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
          {[
            { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
            { id: 'invoices' as const, label: 'Invoices', icon: FileText },
            { id: 'tickets'  as const, label: 'Tickets',  icon: Ticket },
            { id: 'calendar' as const, label: 'Calendar', icon: CalendarDays },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-blue text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary-blue" /> Active Projects
                </h2>
                <button className="flex items-center gap-1 text-xs text-primary-blue hover:underline">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
              {projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wide">
                        <th className="px-6 py-3 text-left font-medium">Project</th>
                        <th className="px-6 py-3 text-left font-medium">PM</th>
                        <th className="px-6 py-3 text-left font-medium">Deadline</th>
                        <th className="px-6 py-3 text-left font-medium">Budget</th>
                        <th className="px-6 py-3 text-left font-medium">TAT Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => {
                        const tat = tatStatusConfig[p.tat_status];
                        return (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-6 py-4 font-medium">{p.name}</td>
                            <td className="px-6 py-4 text-gray-400">{p.pm}</td>
                            <td className="px-6 py-4 text-gray-400">{p.deadline}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-white/10 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-primary-blue to-primary-violet" style={{ width: `${p.budget_used}%` }} />
                                </div>
                                <span className="text-xs text-gray-400">{p.budget_used}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center gap-1.5 text-xs font-medium ${tat.cls}`}>
                                {tat.icon} {tat.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon={BarChart3} message="No active projects assigned yet" />
              )}
            </div>
          </motion.div>
        )}

        {/* ── INVOICES TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'invoices' && (
          <motion.div key="invoices" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <FileText size={18} className="text-primary-blue" /> Invoice History
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 border border-primary-blue/20 rounded-lg text-primary-blue text-xs font-medium hover:bg-primary-blue/20 transition">
                  <Plus size={13} /> Raise Invoice
                </button>
              </div>
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wide">
                        <th className="px-6 py-3 text-left font-medium">Invoice ID</th>
                        <th className="px-6 py-3 text-left font-medium">Project</th>
                        <th className="px-6 py-3 text-left font-medium">Amount</th>
                        <th className="px-6 py-3 text-left font-medium">Date</th>
                        <th className="px-6 py-3 text-left font-medium">Due</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-left font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => {
                        const status = invoiceStatusConfig[inv.status];
                        return (
                          <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-6 py-4 font-mono text-xs text-primary-blue">{inv.id}</td>
                            <td className="px-6 py-4 text-gray-300">{inv.project}</td>
                            <td className="px-6 py-4 font-semibold">{inv.amount}</td>
                            <td className="px-6 py-4 text-gray-400 text-xs">{inv.date}</td>
                            <td className="px-6 py-4 text-gray-400 text-xs">{inv.due_date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}>{status.label}</span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-gray-600 hover:text-white transition"><ExternalLink size={14} /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon={FileText} message="No invoices raised yet" />
              )}
            </div>
          </motion.div>
        )}

        {/* ── TICKETS TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'tickets' && (
          <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Ticket size={18} className="text-primary-blue" /> Support Tickets
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 border border-primary-blue/20 rounded-lg text-primary-blue text-xs font-medium hover:bg-primary-blue/20 transition">
                  <Plus size={13} /> New Ticket
                </button>
              </div>
              {tickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wide">
                        <th className="px-6 py-3 text-left font-medium">Ticket ID</th>
                        <th className="px-6 py-3 text-left font-medium">Subject</th>
                        <th className="px-6 py-3 text-left font-medium">Project</th>
                        <th className="px-6 py-3 text-left font-medium">Priority</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-left font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(t => (
                        <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                          <td className="px-6 py-4 font-mono text-xs text-primary-blue">{t.id}</td>
                          <td className="px-6 py-4 font-medium">{t.subject}</td>
                          <td className="px-6 py-4 text-gray-400">{t.project}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ticketPriorityConfig[t.priority]}`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ticketStatusConfig[t.status]}`}>
                              {t.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">{t.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon={Ticket} message="No support tickets raised yet" />
              )}
            </div>
          </motion.div>
        )}

        {/* ── CALENDAR TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
            <MiniCalendar milestones={milestones} />
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <ChevronRight size={18} className="text-primary-blue" /> Upcoming Milestones
              </h3>
              {milestones.length > 0 ? (
                <div className="space-y-3">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.color}`} />
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={CalendarDays} message="No upcoming milestones" />
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
