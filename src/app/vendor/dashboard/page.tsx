'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, Clock, FileText, 
  ArrowUpRight, ArrowDownRight, Download, 
  CheckCircle, AlertCircle, TrendingUp, Calendar,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/auth/supabase';

export default function VendorDashboard() {
  const [payments, setPayments] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: payData } = await supabase
      .from('payments')
      .select('*')
      .order('invoice_date', { ascending: false })
      .limit(5);
    if (payData) setPayments(payData);

    const { data: meetData } = await supabase
      .from('meetings')
      .select('*')
      .gte('meeting_date', new Date().toISOString().split('T')[0])
      .order('meeting_date', { ascending: true })
      .limit(3);
    if (meetData) setMeetings(meetData);
  };

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0);

  const STATS = [
    { label: 'Amount Received', value: `₹${(totalPaid / 100000).toFixed(1)}L`, icon: IndianRupee, color: 'text-brand-blue', bg: 'bg-brand-blue/10', change: '+12%', up: true },
    { label: 'Pending Payments', value: `₹${(totalPending / 100000).toFixed(1)}L`, icon: Clock, color: 'text-brand-pink', bg: 'bg-brand-pink/10', change: `${payments.filter(p => p.status === 'pending').length} invoices`, up: false },
    { label: 'Total Invoices', value: `${payments.length}`, icon: FileText, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', change: 'Last 6 months', up: true },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Dashboard</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your payment history, documents & upcoming meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition-all shadow-premium-sm active:scale-95">
             <Download size={16} /> Download Statement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-6 border-white bg-white/40 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} shadow-premium-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.up ? 'text-brand-blue' : 'text-brand-pink'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-black text-brand-black mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Payments + Upcoming Meetings */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass p-8 border-white bg-white/60 shadow-premium-lg"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-brand-black tracking-tight">Recent Payments</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Your latest payment activity</p>
            </div>
            <button className="flex items-center gap-1.5 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline decoration-2">
               View All <ArrowUpRight size={12} />
            </button>
          </div>

          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-black/[0.03]">
                    <th className="px-4 py-3 text-left">Invoice</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.02]">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="group hover:bg-surface-soft transition-colors">
                      <td className="px-4 py-5 text-xs font-black text-brand-black">{pay.description || 'Invoice'}</td>
                      <td className="px-4 py-5 text-xs font-black text-brand-black">₹{Number(pay.amount).toLocaleString()}</td>
                      <td className="px-4 py-5 text-[10px] font-bold text-gray-400">{new Date(pay.invoice_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          pay.status === 'paid' ? 'bg-green-50 text-green-600 ring-1 ring-green-100' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-sm text-gray-400">No payment records yet</p>
              <p className="text-[10px] text-gray-300 mt-1">Payments will appear here once your invoices are processed</p>
            </div>
          )}
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-8 border-white bg-white/60 shadow-premium-lg flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-brand-black tracking-tight">Upcoming</h2>
            <Calendar size={20} className="text-brand-pink" />
          </div>

          <div className="flex-1 space-y-4">
            {meetings.length === 0 ? (
              <div className="text-center py-10">
                <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No upcoming meetings</p>
              </div>
            ) : (
              meetings.map(m => (
                <div key={m.id} className="p-4 rounded-2xl bg-surface-soft border border-black/[0.02] hover:bg-white transition-all group shadow-sm">
                  <p className="text-sm font-black text-brand-black group-hover:text-brand-blue transition mb-2 leading-snug">{m.title}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(m.meeting_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    {m.meeting_time && <span className="flex items-center gap-1"><Clock size={11} /> {m.meeting_time}</span>}
                  </div>
                  {m.meeting_link && (
                    <a href={m.meeting_link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">
                      Join Meeting <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Help */}
          <div className="mt-6 p-5 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-brand-blue mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-brand-black uppercase tracking-widest mb-1">Need Help?</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">Contact your project manager or reach out via the Support page for any queries.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
