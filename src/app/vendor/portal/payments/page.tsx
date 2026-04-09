'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, ArrowUpRight, ArrowDownRight, 
  FileText, Download, Filter, Plus, 
  Clock, CheckCircle, AlertTriangle, Search,
  X, Loader2, Building2
} from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'INV-7821', project: 'Phoenix Sync', amount: '₹12,40,000', date: '2026-04-05', status: 'paid', type: 'Milestone 1' },
  { id: 'INV-7844', project: 'Enterprise Audit', amount: '₹8,50,000', date: '2026-04-10', status: 'pending', type: 'Design Sign-off' },
  { id: 'INV-7901', project: 'Supply Chain AI', amount: '₹22,10,000', date: '2026-04-20', status: 'processing', type: 'Hardware Proc' },
];

export default function VendorPayments() {
  const [loading, setLoading] = useState(true);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-slide-in overflow-hidden">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-1">Financials</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px]">Revenue Control / {MOCK_PAYMENTS.length} Transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-black/[0.03] rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition-all shadow-premium-sm active:scale-95">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setIsInvoiceModalOpen(true)} className="flex items-center gap-3 px-6 py-3.5 bg-brand-black text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-premium-xl hover:shadow-glow-pink transition-all active:scale-95">
            <Plus size={16} className="text-brand-pink" /> Raise Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
        <StatCard label="Total Revenue" value="₹43.0L" icon={IndianRupee} color="text-brand-blue" />
        <StatCard label="Pending Approval" value="₹8.5L" icon={Clock} color="text-brand-yellow" />
        <StatCard label="Paid This Month" value="₹12.4L" icon={CheckCircle} color="text-green-500" />
      </div>

      {/* ── Transaction Table ── */}
      <div className="flex-1 glass p-8 bg-white border-white shadow-premium-xl rounded-[2.5rem] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
           <h2 className="text-xl font-black text-brand-black tracking-tighter">Transaction Ledger</h2>
           <div className="flex items-center gap-2">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                 <input type="text" placeholder="Search Invoices..." className="pl-10 pr-4 py-2.5 bg-surface-soft rounded-xl text-[10px] font-bold outline-none border border-transparent focus:bg-white focus:border-brand-blue/20 transition w-64" />
              </div>
              <button className="p-2.5 rounded-xl bg-surface-soft text-gray-400 hover:text-brand-black transition border border-transparent hover:border-black/[0.03]"><Filter size={18} /></button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-black/[0.02]">
                <th className="px-6 py-4 text-left">Invoice ID</th>
                <th className="px-6 py-4 text-left">Project</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.01]">
              {MOCK_PAYMENTS.map((p, i) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-surface-soft/50 transition-all cursor-default"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-surface-soft flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all"><FileText size={14} /></div>
                       <span className="text-xs font-black text-brand-black">{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500">{p.project}</td>
                  <td className="px-6 py-5 text-xs font-black text-brand-black">{p.amount}</td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/5 px-2 py-1 rounded-lg uppercase tracking-widest">{p.type}</span>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-white rounded-xl transition shadow-premium-sm text-gray-400 hover:text-brand-black"><Download size={16} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invoice Modal ── */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInvoiceModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-premium-2xl p-10 overflow-hidden">
               <h2 className="text-2xl font-black text-brand-black tracking-tighter mb-8">Raise Strategic Invoice</h2>
               <div className="space-y-6">
                  <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-3">Select Project</label>
                     <select className="w-full px-5 py-3.5 bg-surface-soft rounded-2xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-brand-pink/20 transition appearance-none">
                        <option>Phoenix Sync</option>
                        <option>Enterprise Audit</option>
                        <option>Global Logistics</option>
                     </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-3">Invoice Amount</label>
                        <input type="text" placeholder="₹5,00,000" className="w-full px-5 py-3.5 bg-surface-soft rounded-2xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-brand-pink/20 transition" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-3">Milestone Date</label>
                        <input type="date" className="w-full px-5 py-3.5 bg-surface-soft rounded-2xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-brand-pink/20 transition" />
                     </div>
                  </div>
                  <div className="space-y-1 text-center py-8 border-2 border-dashed border-gray-100 rounded-[2rem] hover:border-brand-pink/20 transition cursor-pointer bg-surface-soft/30">
                     <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload PDF Invoice</p>
                  </div>
                  <button onClick={() => setIsInvoiceModalOpen(false)} className="w-full py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all">Submit for PM Approval</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass p-6 bg-white border-white shadow-premium-lg flex items-center justify-between group">
      <div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">{label}</p>
        <p className={`text-2xl font-black ${color} tracking-tighter`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-surface-soft flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    paid: { label: 'Settled', bg: 'bg-green-50 text-green-600 border-green-100' },
    pending: { label: 'Pending PM', bg: 'bg-yellow-50 text-brand-yellow border-yellow-100' },
    processing: { label: 'Disbursing', bg: 'bg-blue-50 text-brand-blue border-blue-100' },
  };
  const { label, bg } = config[status];
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${bg}`}>
      {label}
    </span>
  );
}
