'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, Clock, FileText, 
  ArrowUpRight, ArrowDownRight, Download, 
  CheckCircle, AlertCircle, TrendingUp, Calendar,
  ChevronRight, Building2, Briefcase, FileStack, AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/auth/supabase';
import Link from 'next/link';

export default function VendorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalInvoices: 0,
    pendingPayments: 0,
    kycCompleted: false
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile for KYC status
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      const isKYC = !!(profile?.gst_number && profile?.bank_account);

      // 2. Fetch Payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .order('invoice_date', { ascending: false });

      // 3. Fetch Projects (Logic: Projects where this vendor ID is mentioned, or just general for now)
      const { data: projects } = await supabase
        .from('projects')
        .select('*');

      // 4. Fetch Meetings
      const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .gte('meeting_date', new Date().toISOString().split('T')[0])
        .order('meeting_date', { ascending: true })
        .limit(3);

      setStats({
        activeProjects: projects?.length || 0,
        totalInvoices: payments?.length || 0,
        pendingPayments: payments?.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0) || 0,
        kycCompleted: isKYC
      });

      setRecentPayments(payments?.slice(0, 5) || []);
      setUpcomingMeetings(meetings || []);

    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const KPI_DATA = [
    { label: 'Active Projects', value: stats.activeProjects, icon: Briefcase, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Total Invoices', value: stats.totalInvoices, icon: FileStack, color: 'text-brand-pink', bg: 'bg-brand-pink/10' },
    { label: 'Pending Payout', value: `₹${(stats.pendingPayments / 100000).toFixed(1)}L`, icon: IndianRupee, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
  ];

  return (
    <div className="space-y-10 animate-slide-in pb-20 px-2 lg:px-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-brand-black tracking-tighter mb-2">Portal Overview</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your professional vendor command center</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchDashboardData} className="p-3 bg-white border border-gray-100 rounded-2xl shadow-premium-sm hover:rotate-180 transition-all duration-500">
             <RefreshCwIcon size={20} className="text-brand-blue" />
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-black hover:shadow-premium-md transition-all active:scale-95">
             <Download size={18} /> Statement
          </button>
        </div>
      </div>

      {/* ── KYC NOTIFICATION (STREAMLINED) ── */}
      <AnimatePresence>
        {!stats.kycCompleted && !loading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className="bg-brand-pink/5 border border-brand-pink/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-pink flex items-center justify-center text-white shadow-glow-pink">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-black tracking-tight">Compliance Missing (KYC)</h3>
                  <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">Payments are disabled until PAN & GST are verified.</p>
                </div>
              </div>
              <Link href="/vendor/portal/kyc">
                <button className="px-8 py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-glow-pink transition-all active:scale-95 flex items-center gap-2">
                  Verify Identity <ArrowUpRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {KPI_DATA.map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 bg-white border-white shadow-premium-xl group hover:-translate-y-2 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-[1.5rem] ${kpi.bg}`}>
                <kpi.icon size={24} className={kpi.color} />
              </div>
              <div className="text-gray-300 group-hover:text-brand-black transition-colors">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-brand-black mb-1">{kpi.value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* ── RECENT INVOICES ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass p-10 bg-white border-white shadow-premium-xl rounded-[3rem]"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-brand-black tracking-tighter">Finance History</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status of your submitted quotations & invoices</p>
            </div>
            <Link href="/vendor/payments">
              <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">Full Report</button>
            </Link>
          </div>

          {!loading && recentPayments.length > 0 ? (
            <div className="space-y-4">
              {recentPayments.map(pay => (
                <div key={pay.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-surface-soft border border-transparent hover:border-black/[0.03] hover:bg-white transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pay.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                         <IndianRupee size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-black text-brand-black">{pay.description || 'Project Payout'}</p>
                         <p className="text-[10px] font-bold text-gray-400">{new Date(pay.invoice_date).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-brand-black">₹{Number(pay.amount).toLocaleString()}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${pay.status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>{pay.status}</span>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <FileStack size={48} className="text-gray-100" />
               <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No financial activity to show</p>
            </div>
          )}
        </motion.div>

        {/* ── UPCOMING SCHEDULE ── */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 bg-white border-white shadow-premium-xl rounded-[3rem] flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-brand-black tracking-tighter">Agenda</h2>
            <Calendar size={24} className="text-brand-pink" />
          </div>

          <div className="flex-1 space-y-6">
            {!loading && upcomingMeetings.length > 0 ? (
               upcomingMeetings.map(m => (
                 <div key={m.id} className="relative pl-8 border-l-2 border-brand-blue/20 pb-4 last:border-0 last:pb-0">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-brand-blue shadow-sm" />
                    <p className="text-sm font-black text-brand-black leading-tight mb-1">{m.title}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                       <span className="flex items-center gap-1.5"><Clock size={12} /> {m.meeting_time}</span>
                       <span className="flex items-center gap-1.5">{new Date(m.meeting_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                 </div>
               ))
            ) : (
              <div className="text-center py-20 text-gray-300 space-y-4">
                 <Clock size={48} className="mx-auto opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Schedule Clear</p>
              </div>
            )}
          </div>

          <button className="w-full mt-10 py-4 bg-surface-soft text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-2xl border border-brand-blue/10 hover:bg-brand-blue hover:text-white transition-all active:scale-95">
             Open Full Calendar
          </button>
        </motion.div>

      </div>
    </div>
  );
}

function RefreshCwIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
  );
}
