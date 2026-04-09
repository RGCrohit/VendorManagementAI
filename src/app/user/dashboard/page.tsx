'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, TrendingUp, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, IndianRupee,
  Download, Plus, ChevronRight, Activity, ShieldCheck,
  Database, RefreshCw, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/auth/supabase';

const DASHBOARD_KPIS = [
  { label: 'Total Spend',       value: '₹4.2Cr', icon: IndianRupee,  color: 'text-brand-blue',   bg: 'bg-brand-blue/10',   change: '+12.5%', up: true },
  { label: 'Active Vendors',    value: '142',     icon: Building2,    color: 'text-brand-pink',   bg: 'bg-brand-pink/10',   change: '+4',     up: true },
  { label: 'Vendor Score',      value: '94.2%',   icon: ShieldCheck,  color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', change: '+2.1%',  up: true },
  { label: 'Open Issues',       value: '6',       icon: AlertTriangle, color: 'text-brand-pink',  bg: 'bg-brand-pink/10',   change: '-2',     up: false },
];

const ANALYTICS_DATA = [
  { name: 'Nov', spend: 3200, score: 82 },
  { name: 'Dec', spend: 4000, score: 85 },
  { name: 'Jan', spend: 3000, score: 88 },
  { name: 'Feb', spend: 5000, score: 92 },
  { name: 'Mar', spend: 4500, score: 90 },
  { name: 'Apr (YTD)', spend: 6000, score: 94 },
];

const RECENT_ALERTS = [
  { id: 1, type: 'VENDOR',  title: 'Acme Corp documents expired — needs renewal', time: '2h ago', severity: 'high' },
  { id: 2, type: 'PAYMENT', title: 'Invoice mismatch detected: ₹2.4L', time: '5h ago', severity: 'medium' },
  { id: 3, type: 'UPDATE',  title: 'New vendor "Delta Tech" registered', time: '8h ago', severity: 'low' },
];

export default function AdminDashboard() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedSuccess(false);
    
    try {
      // 1. Check if vendors exists
      const { data: existing } = await supabase.from('vendors').select('id').limit(1);
      
      if (existing && existing.length > 0) {
        alert("Database already has data. Manual seeding skipped to prevent duplicates.");
      } else {
        // Insert some dummy vendors to start
        const { error } = await supabase.from('vendors').insert([
          { name: 'Acme Global Solutions', industry: 'IT Services', status: 'active', rating: 92, contact_email: 'info@acme.com' },
          { name: 'Nova Industries', industry: 'Manufacturing', status: 'active', rating: 85, contact_email: 'ops@nova.in' },
          { name: 'Apex Research Labs', industry: 'BioTech', status: 'pending', rating: 50, contact_email: 'hello@apex.io' }
        ]);
        if (error) throw error;
        
        // Insert dummy expenses
        const { data: vendorList } = await supabase.from('vendors').select('id');
        if (vendorList && vendorList.length > 0) {
           await supabase.from('vendor_expenses').insert([
             { vendor_id: vendorList[0].id, amount: 45000, category: 'Infrastructure', description: 'Cloud server monthly cost', status: 'paid' },
             { vendor_id: vendorList[0].id, amount: 12000, category: 'Logistics', description: 'Equipment shipping', status: 'pending' },
             { vendor_id: vendorList[1].id, amount: 89000, category: 'Software', description: 'License renewal', status: 'paid' },
           ]);
        }

        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Seed error:", err);
      alert("Seeding failed. Please run the SQL migration manually in Supabase SQL Editor.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      
      {/* ── Dashboard Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Dashboard</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Overview of your vendors, projects & payments • Last 6 Months</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedData}
            disabled={isSeeding}
            className="flex items-center gap-2 px-5 py-3 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-blue hover:bg-brand-blue/10 transition-all active:scale-95 disabled:opacity-50"
          >
             {isSeeding ? <RefreshCw size={14} className="animate-spin" /> : seedSuccess ? <CheckCircle2 size={14} /> : <Database size={14} />}
             {isSeeding ? 'Seeding...' : seedSuccess ? 'System Synced' : 'Sync Mock Data'}
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition-all shadow-premium-sm active:scale-95">
             <Download size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-6 border-white bg-white/40 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${kpi.bg} shadow-premium-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={kpi.color} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${kpi.up ? 'text-brand-blue' : 'text-brand-pink'}`}>
                  {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-3xl font-black text-brand-black mb-1">{kpi.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Visual Analytics Center ───────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass p-8 border-white bg-white/60 shadow-premium-lg"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-brand-black tracking-tight">Spending Trends</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly spend vs vendor performance score</p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-surface-soft rounded-xl border border-black/[0.03]">
              <button className="px-3 py-1.5 bg-white text-[10px] font-black uppercase tracking-widest text-brand-black rounded-lg shadow-sm">6 Months</button>
              <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition">Full Year</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4DC8F0" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4DC8F0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '1.5rem' }} />
                <Area type="monotone" dataKey="spend" stroke="#4DC8F0" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-8 border-white bg-white/60 shadow-premium-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-black text-brand-black tracking-tight">Recent Alerts</h2>
             <Activity size={20} className="text-brand-pink" />
          </div>
          <div className="flex-1 space-y-6">
            {RECENT_ALERTS.map((alert) => (
              <div key={alert.id} className="p-4 rounded-3xl bg-surface-soft border border-black/[0.02] hover:bg-white transition-all group shadow-sm cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${alert.severity === 'high' ? 'bg-red-50 text-brand-pink' : 'bg-blue-50 text-brand-blue'}`}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">{alert.time}</span>
                </div>
                <p className="text-sm font-bold text-brand-black group-hover:text-brand-blue transition mb-3 leading-snug">{alert.title}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:shadow-glow-pink transition-all active:scale-95">
             View All Alerts
          </button>
        </motion.div>
      </div>
    </div>
  );
}
