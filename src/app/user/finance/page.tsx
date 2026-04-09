'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, FileText, TrendingUp, IndianRupee,
  Calendar, ArrowRight, AlertCircle, CheckCircle,
  CreditCard, Building2, X, Download, ShieldCheck, 
  Eye, FileDigit, ScanLine, FileSearch, ShieldAlert
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

// ── Demo data ────────────────────────────────────────────────────────────────
const FY_OPTIONS = ['2025-26', '2024-25', '2023-24'];

const CATEGORY_SPEND = [
  { name: 'IT Services',   value: 45, color: '#4DC8F0' },
  { name: 'Manufacturing', value: 28, color: '#E91E84' },
  { name: 'Logistics',     value: 15, color: '#F9D423' },
  { name: 'Garments',      value: 8,  color: '#f8fafc' },
];

const FINANCE_KPIS = [
  { label: 'Total Portfolio Budget',    value: '₹2.5Cr',  icon: Wallet,       color: 'text-brand-blue',   bg: 'bg-brand-blue/5',    change: '+12%', up: true },
  { label: 'Realized Spend',        value: '₹1.98Cr', icon: IndianRupee,  color: 'text-brand-pink',   bg: 'bg-brand-pink/5',    change: '+8%',  up: true },
  { label: 'Unverified Invoices',    value: '₹18.5L',  icon: FileText,     color: 'text-brand-yellow', bg: 'bg-brand-yellow/5',  change: '-3',   up: false },
  { label: 'Capital Leakage',       value: '₹4.2L',   icon: TrendingUp,   color: 'text-gray-400',     bg: 'bg-surface-soft',    change: '+2',   up: true },
];

const PENDING_INVOICES = [
  { id: 'INV-99201', name: 'Q4 Infrastructure Fee', vendor: 'Acme Global Solutions', amount: '₹12,40,000', date: '2 days ago', status: 'pending', risk: 'low' },
  { id: 'INV-99205', name: 'Raw Material Batch #14', vendor: 'Nova Industrial Mfg', amount: '₹5,80,000', date: '5 days ago', status: 'flagged', risk: 'medium' },
  { id: 'INV-99210', name: 'Textile Audit Master', vendor: 'Zenith Textiles', amount: '₹2,10,000', date: 'Yesterday', status: 'verified', risk: 'low' },
];

function DonutTooltip({ active, payload }: { active?: boolean; payload?: any }) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-premium-lg">
      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-xl font-black text-brand-black tracking-tight">₹{payload[0].value}L</p>
    </div>
  );
}

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('audit');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [selectedFY, setSelectedFY] = useState('2025-26');

  const handlePayTrigger = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsPayModalOpen(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
       setPaySuccess(true);
       setTimeout(() => {
         setIsPayModalOpen(false);
         setPaySuccess(false);
         setSelectedInvoice(null);
       }, 2000);
    }, 1500);
  };

  const handleDownload = (name: string) => {
     // Mock download logic
     console.log(`Downloading ${name}...`);
     alert(`Initiating download: ${name}.pdf`);
  };

  return (
    <div className="space-y-8 animate-slide-in pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Capital Fidelity</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time spend audit & disbursement engine</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-surface-soft border border-black/[0.02] rounded-2xl shadow-sm">
            <Calendar size={16} className="text-gray-400" />
            <select value={selectedFY} onChange={e => setSelectedFY(e.target.value)}
              className="bg-transparent text-[10px] font-black text-gray-500 uppercase tracking-widest outline-none cursor-pointer appearance-none"
            >
              {FY_OPTIONS.map(fy => <option key={fy} value={fy} className="bg-white">FY {fy}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1.5 bg-surface-soft rounded-[2.5rem] border border-black/[0.02] shadow-sm w-fit">
        {[
          { id: 'audit', label: 'Financial Audit', icon: ShieldCheck },
          { id: 'payments', label: 'Pending Payments', icon: CreditCard },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-10 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-brand-black shadow-premium-lg' 
                : 'text-gray-400 hover:text-brand-black'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'audit' ? (
          <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FINANCE_KPIS.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="glass p-8 border-white bg-white/40 shadow-premium-lg group cursor-pointer transition-all hover:y-[-5px]">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center shadow-premium-sm border border-white`}>
                        <Icon size={24} className={kpi.color} />
                      </div>
                      <span className={`text-[10px] font-black uppercase text-brand-blue`}>{kpi.change}</span>
                    </div>
                    <p className="text-3xl font-black text-brand-black mb-1">{kpi.value}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{kpi.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
               <div className="lg:col-span-3 glass p-10 border-white bg-white/60 shadow-premium-lg">
                  <h2 className="text-2xl font-black text-brand-black tracking-tight mb-10">Realized Resource Flow</h2>
                  <div className="space-y-10">
                    {[
                      { name: 'Project Phoenix', budget: 50, spent: 34, color: 'bg-brand-blue' },
                      { name: 'Enterprise Suite', budget: 80, spent: 72, color: 'bg-brand-pink' },
                    ].map(p => (
                      <div key={p.name}>
                        <div className="flex justify-between mb-3 text-sm font-black text-brand-black">
                           <span>{p.name}</span>
                           <span>₹{p.spent}L / ₹{p.budget}L</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                           <div className={`h-full ${p.color} transition-all duration-1000`} style={{ width: `${(p.spent/p.budget)*100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="lg:col-span-2 glass p-10 border-white bg-white shadow-premium-lg h-full">
                  <h2 className="text-2xl font-black text-brand-black tracking-tight mb-10">Ecosystem Dispersion</h2>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={CATEGORY_SPEND} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="transparent">
                          {CATEGORY_SPEND.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip content={<DonutTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="glass p-10 border-white bg-white/60 shadow-premium-lg rounded-[3rem]">
               <div className="flex items-center justify-between mb-10 px-4">
                  <div>
                    <h2 className="text-2xl font-black text-brand-black tracking-tight">Invoice Disbursement Queue</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Authorized disbursements awaiting Razorpay synchronization</p>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-black/[0.03]">
                        <th className="px-6 py-4 text-left">Invoice Ref</th>
                        <th className="px-6 py-4 text-left">Entity</th>
                        <th className="px-6 py-4 text-left">Capital Amount</th>
                        <th className="px-6 py-4 text-left">Audit Status</th>
                        <th className="px-6 py-4 text-right">Synchronization</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.02]">
                      {PENDING_INVOICES.map(inv => (
                        <tr key={inv.id} className="group hover:bg-surface-soft transition-colors items-center">
                          <td className="px-6 py-6 font-medium">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-surface-soft text-brand-black rounded-xl flex items-center justify-center p-2 shadow-sm border border-black/[0.03]">
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <p className="text-xs font-black text-brand-black group-hover:text-brand-blue transition">{inv.name}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{inv.id} • {inv.date}</p>
                               </div>
                             </div>
                          </td>
                          <td className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-tighter">{inv.vendor}</td>
                          <td className="px-6 py-6 text-xs font-black text-brand-black">{inv.amount}</td>
                          <td className="px-6 py-6">
                             <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                               inv.status === 'verified' ? 'bg-green-50 text-green-600' :
                               inv.status === 'flagged' ? 'bg-amber-50 text-brand-yellow' : 'bg-blue-50 text-brand-blue'
                             }`}>
                                {inv.status}
                             </span>
                          </td>
                          <td className="px-6 py-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleDownload(inv.name)}
                                  className="p-2.5 bg-white border border-black/[0.05] rounded-xl text-gray-400 hover:text-brand-pink transition shadow-sm"
                                >
                                   <Download size={16} />
                                </button>
                                <button 
                                  onClick={() => handlePayTrigger(inv)}
                                  className="px-5 py-2.5 bg-brand-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue transition shadow-premium-sm"
                                >
                                   Settle Due
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="p-10 bg-blue-50/20 border-white shadow-premium-lg rounded-[2.5rem] flex items-center gap-6">
                  <ScanLine size={32} className="text-brand-blue" />
                  <div>
                    <h4 className="text-sm font-black text-brand-black uppercase tracking-widest mb-1">Razorpay Live Gateway</h4>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter leading-relaxed">Disbursements are authorized using the CureVend Test ID protocol: **rzp_test_9920**.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Razorpay Payment Modal */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPayModalOpen(false)} className="absolute inset-0 bg-brand-black/20 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-premium-xl border border-white p-10 overflow-hidden">
              {paySuccess ? (
                <div className="py-12 text-center animate-in zoom-in duration-500">
                   <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-premium-lg"><CheckCircle size={48} /></div>
                   <h3 className="text-2xl font-black text-brand-black mb-2 tracking-tighter">Razorpay Sync Complete</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Successfully Synced to Global Ledger</p>
                </div>
              ) : (
                <form onSubmit={handlePayment}>
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#3395FF] rounded-2xl flex items-center justify-center shadow-lg"><CreditCard className="text-white" size={24} /></div>
                        <div>
                          <h2 className="text-2xl font-black text-brand-black tracking-tight">Razorpay Gateway</h2>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Disbursement Hub</p>
                        </div>
                     </div>
                     <button type="button" onClick={() => setIsPayModalOpen(false)} className="p-2 hover:bg-surface-soft rounded-full transition"><X size={20} /></button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-surface-soft border border-black/[0.03] rounded-3xl">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Source Node</p>
                       <p className="text-sm font-black text-brand-black">CureVendAI Corporate Vault</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-surface-soft border border-black/[0.03] rounded-3xl">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Entity</p>
                         <p className="text-xs font-black text-brand-blue truncate">{selectedInvoice?.vendor}</p>
                      </div>
                      <div className="p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-3xl">
                         <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest mb-1">Capital Amount</p>
                         <p className="text-xs font-black text-brand-blue">{selectedInvoice?.amount}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex items-start gap-4">
                       <ShieldAlert size={20} className="text-brand-yellow" />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-brand-yellow uppercase tracking-widest mb-1">Governance Notice</p>
                          <p className="text-[10px] font-medium text-amber-600/80 leading-relaxed uppercase tracking-tighter">
                            Authorizing this disbursement using Razorpay Test Key **rzp_test_9920**. Ensure 6-month budget parity is maintained.
                          </p>
                       </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-brand-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-blue transition-all active:scale-95 flex items-center justify-center gap-3">
                       <ShieldCheck size={18} /> Authorize & Settle Due
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
