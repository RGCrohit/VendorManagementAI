'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, ShieldCheck, Clock, FileText, 
  ArrowUpRight, Download, Eye, AlertCircle, TrendingUp,
  ScanLine, Loader2, CheckCircle
} from 'lucide-react';

const STATS = [
  { label: 'Total Settled Amount', value: '₹42.8L', icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'Pending Dues', value: '₹12.4L', icon: Clock, color: 'text-brand-pink', bg: 'bg-brand-pink/5' },
  { label: 'Compliance Score', value: '98%', icon: ShieldCheck, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
];

const RECENT_PAYMENTS = [
  { id: 'PAY-8821', name: 'Infrastructure Maintenance', amount: '₹4,50,000', date: 'Oct 12, 2025', status: 'settled' },
  { id: 'PAY-8805', name: 'Cloud Hub Sync Fee', amount: '₹2,10,000', date: 'Sep 28, 2025', status: 'settled' },
];

export default function VendorDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const triggerOCR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => setScanComplete(false), 3000);
    }, 4000);
  };

  return (
    <div className="space-y-10">
      
      {/* Welcome & Quick OCR */}
      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col gap-2">
               <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Partner Dashboard</h1>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time governance & fiscal synchronization</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {STATS.map((stat, i) => (
                 <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all group"
                 >
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                       <stat.icon size={24} />
                    </div>
                    <p className="text-3xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</p>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="glass p-10 bg-brand-black text-white rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-10"><ScanLine size={120} /></div>
            <div className="relative z-10">
               <h3 className="text-xl font-black tracking-tight mb-4 text-brand-blue uppercase">Neural OCR Sync</h3>
               <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-tighter">
                  Upload Invoices or Compliance Master Docs. Our AI engine will automatically extract and synchronize the data with the CureVend HQ Ledger.
               </p>
            </div>
            
            <div className="relative z-10 mt-10">
               {isScanning ? (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-blue animate-pulse">
                       <span>Scanning Telemetry...</span>
                       <span>84%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4 }} className="h-full bg-brand-blue shadow-glow-blue" />
                    </div>
                 </div>
               ) : scanComplete ? (
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-4 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 mb-2">
                    <CheckCircle size={24} />
                    <div className="text-left">
                       <p className="text-xs font-black uppercase tracking-widest">Doc Verified</p>
                       <p className="text-[9px] font-bold">Registry Synced Successfully</p>
                    </div>
                 </motion.div>
               ) : (
                 <button 
                  onClick={triggerOCR}
                  className="w-full py-5 bg-white text-brand-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-blue hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                 >
                    <FileText size={18} /> Upload Governance Doc
                 </button>
               )}
            </div>
         </div>
      </div>

      {/* Ledger Table */}
      <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Recent Settlements</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status of your recent fiscal disbursements</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline decoration-2">
               View Full Ledger <ArrowUpRight size={14} />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                     <th className="px-6 py-4 text-left">Transaction ID</th>
                     <th className="px-6 py-4 text-left">Internal Reference</th>
                     <th className="px-6 py-4 text-left">Amount Paid</th>
                     <th className="px-6 py-4 text-left">Date Sync</th>
                     <th className="px-6 py-4 text-right">Audit Docs</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {RECENT_PAYMENTS.map((pay) => (
                    <tr key={pay.id} className="group hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-6 text-xs font-black text-brand-blue">{pay.id}</td>
                       <td className="px-6 py-6 text-xs font-bold text-slate-600 uppercase tracking-tighter">{pay.name}</td>
                       <td className="px-6 py-6">
                          <p className="text-xs font-black text-slate-800">{pay.amount}</p>
                       </td>
                       <td className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.date}</td>
                       <td className="px-6 py-6 text-right">
                          <button className="p-2.5 bg-slate-100 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-white transition shadow-sm border border-transparent hover:border-slate-100">
                             <Download size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Compliance / Support */}
      <div className="grid md:grid-cols-2 gap-8">
         <div className="p-10 bg-blue-50/30 border border-blue-100 rounded-[2.5rem] flex items-start gap-6">
             <AlertCircle size={32} className="text-brand-blue" />
             <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Automated Compliance Monitoring</h4>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                   Your node is currenty performing at **98% fidelity**. Maintain regular doc uploads to avoid flagging by the HQ Governor.
                </p>
             </div>
         </div>
         <div className="p-10 bg-slate-100/50 border border-slate-200 rounded-[2.5rem] flex items-start gap-6">
             <TrendingUp size={32} className="text-slate-400" />
             <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Market Sentiment Sync</h4>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                   Performance benchmarking against regional sector leaders is now available in your deep-insights tab.
                </p>
             </div>
         </div>
      </div>

    </div>
  );
}
