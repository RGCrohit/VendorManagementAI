'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, ShieldCheck, Download, Search, 
  Trash2, Plus, Loader2, BadgeCheck, FileStack,
  Clock, AlertCircle, Building2
} from 'lucide-react';

const MOCK_DOCS = [
  { id: 1, name: 'Service Agreement 2026.pdf', type: 'Contract', date: '2026-03-15', status: 'signed', size: '2.4 MB' },
  { id: 2, name: 'GST Certificate.pdf', type: 'Compliance', date: '2026-04-01', status: 'verified', size: '1.1 MB' },
  { id: 3, name: 'Bank Account Proof.jpeg', type: 'KYC', date: '2026-04-02', status: 'pending', size: '0.8 MB' },
  { id: 4, name: 'ISO 9001 Certification.pdf', type: 'Compliance', date: '2026-02-10', status: 'verified', size: '4.5 MB' },
];

export default function VendorDocuments() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center text-brand-blue">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-slide-in overflow-hidden">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-1">Document Vault</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px]">Compliance / {MOCK_DOCS.length} Cryptographic Records</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
              <input type="text" placeholder="Search Files..." className="pl-10 pr-6 py-3.5 bg-white border border-black/[0.03] rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-premium-sm focus:border-brand-blue/20 transition-all w-64" />
           </div>
           <button className="flex items-center gap-3 px-6 py-3.5 bg-brand-black text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-premium-xl hover:shadow-glow-blue transition-all active:scale-95">
              <Plus size={16} className="text-brand-blue" /> Upload Document
           </button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-hidden flex flex-col">
         {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-shrink-0">
            <SummaryCard label="Verified" value="2" icon={BadgeCheck} color="text-green-500" />
            <SummaryCard label="Contracts" value="1" icon={FileText} color="text-brand-blue" />
            <SummaryCard label="In Review" value="1" icon={Clock} color="text-brand-yellow" />
            <SummaryCard label="Missing" value="0" icon={AlertCircle} color="text-gray-300" />
         </div>

         {/* File Explorer */}
         <div className="flex-1 glass p-8 bg-white border-white shadow-premium-xl rounded-[2.5rem] flex flex-col overflow-hidden">
            <h2 className="text-xl font-black text-brand-black tracking-tighter mb-8 flex-shrink-0">Secured Repository</h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
               {MOCK_DOCS.map((doc, i) => (
                 <motion.div 
                   key={doc.id}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.05 }}
                   className="flex items-center gap-6 p-5 rounded-[1.5rem] bg-surface-soft border border-transparent hover:border-black/[0.03] hover:bg-white transition-all group shadow-sm hover:shadow-premium-md cursor-pointer"
                 >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-premium-sm flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shadow-sm">
                       <FileStack size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="text-sm font-black text-brand-black truncate mb-1">{doc.name}</h3>
                       <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                          <span>{doc.type}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span>{doc.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span>{doc.size}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <StatusBadge status={doc.status} />
                       <div className="flex border border-black/[0.03] rounded-xl overflow-hidden shadow-sm">
                          <button className="p-2.5 bg-white hover:bg-surface-soft transition-all text-gray-400 hover:text-brand-black border-r border-black/[0.03]"><Download size={16} /></button>
                          <button className="p-2.5 bg-white hover:bg-red-50 transition-all text-gray-400 hover:text-brand-pink"><Trash2 size={16} /></button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-8 pt-8 border-t border-black/[0.02] flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex-shrink-0">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-blue" />
                  End-to-End Encrypted Storage Active
               </div>
               <p>Storage used: 8.8 MB / 500 MB</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-5 bg-white/40 border border-white hover:bg-white transition-all rounded-3xl shadow-premium-sm flex flex-col gap-3">
       <div className={`w-10 h-10 rounded-2xl bg-white shadow-premium-sm flex items-center justify-center ${color}`}>
          <Icon size={18} />
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-2xl font-black text-brand-black tracking-tighter">{value}</p>
       </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    signed: { label: 'Active', bg: 'bg-green-50 text-green-600' },
    verified: { label: 'Verified', bg: 'bg-blue-50 text-brand-blue' },
    pending: { label: 'In Review', bg: 'bg-yellow-50 text-brand-yellow' },
  };
  const { label, bg } = config[status];
  return (
    <span className={`px-2.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${bg}`}>
      {label}
    </span>
  );
}
