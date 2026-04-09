'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/auth/supabase';
import { 
  FileStack, Plus, IndianRupee, Clock, CheckCircle2, 
  X, Loader2, Send, FileText, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Quotation = {
  id: string;
  title: string;
  amount: number;
  status: string;
  created_at: string;
  project_name?: string;
};

export default function VendorQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuotations();
  }, []);

  async function fetchQuotations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // We use public.payments or similar if quotations table isn't ready, 
    // but here we try to select from 'quotations'
    const { data } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setQuotations(data);
    setLoading(false);
  }

  const handleSubmitQuotation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('quotations').insert({
      vendor_id: user.id,
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount') as string),
      status: 'pending'
    });

    if (!error) {
      await fetchQuotations();
      setIsSubmitOpen(false);
      form.reset();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Quotations</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Submit and track your project bids</p>
        </div>
        <button 
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95"
        >
          <Plus size={16} /> Submit New Quote
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         {/* Summary Cards */}
         <div className="glass p-6 bg-white shadow-premium-md border-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Bids</p>
            <p className="text-2xl font-black text-brand-black">{quotations.length}</p>
         </div>
         <div className="glass p-6 bg-white shadow-premium-md border-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Approved</p>
            <p className="text-2xl font-black text-green-600">{quotations.filter(q => q.status === 'approved').length}</p>
         </div>
         <div className="glass p-6 bg-white shadow-premium-md border-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pending</p>
            <p className="text-2xl font-black text-brand-yellow">{quotations.filter(q => q.status === 'pending').length}</p>
         </div>
         <div className="glass p-6 bg-white shadow-premium-md border-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Success Rate</p>
            <p className="text-2xl font-black text-brand-blue">
               {quotations.length ? Math.round((quotations.filter(q => q.status === 'approved').length / quotations.length) * 100) : 0}%
            </p>
         </div>
      </div>

      <div className="glass p-8 bg-white shadow-premium-xl border-white rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-black text-brand-black">Quotation History</h2>
           <button className="p-2 border border-black/[0.05] rounded-xl text-gray-400"><Filter size={18} /></button>
        </div>

        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" /></div>
        ) : quotations.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <FileStack size={48} className="text-gray-100" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No quotations submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.03]">
                  <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Title / Project</th>
                  <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Submitted On</th>
                  <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.02]">
                {quotations.map((q) => (
                  <tr key={q.id} className="group hover:bg-surface-soft transition-colors">
                    <td className="py-6">
                       <p className="text-sm font-black text-brand-black">{q.title}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{q.project_name || 'General Inquiry'}</p>
                    </td>
                    <td className="py-6">
                       <div className="flex items-center gap-1.5 text-brand-blue font-black text-sm">
                          <IndianRupee size={14} /> {q.amount?.toLocaleString('en-IN')}
                       </div>
                    </td>
                    <td className="py-6">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                         q.status === 'approved' ? 'bg-green-50 text-green-600' : 
                         q.status === 'rejected' ? 'bg-red-50 text-brand-pink' : 'bg-amber-50 text-brand-yellow'
                       }`}>
                         {q.status}
                       </span>
                    </td>
                    <td className="py-6 text-[11px] font-bold text-gray-400">
                       {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-6 text-right">
                       <button className="p-2 text-gray-300 hover:text-brand-black transition"><FileText size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SUBMIT MODAL */}
      <AnimatePresence>
        {isSubmitOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSubmitOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-premium-xl border border-white p-10 overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-brand-black tracking-tighter">Submit Quotation</h2>
                  <button onClick={() => setIsSubmitOpen(false)} className="p-2 hover:bg-surface-soft rounded-xl transition"><X size={20} /></button>
               </div>

               <form onSubmit={handleSubmitQuotation} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bid Title</label>
                     <input name="title" required placeholder="e.g. Server Infrastructure Maintenance" className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Quoted Amount (INR)</label>
                     <div className="relative">
                        <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input name="amount" type="number" required placeholder="0.00" className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Add Agenda / Description (Optional)</label>
                     <textarea rows={3} placeholder="Provide breakdown..." className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold outline-none focus:bg-white transition resize-none" />
                  </div>

                  <button 
                     type="submit" 
                     disabled={submitting}
                     className="w-full py-5 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                     {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                     Submit Quotation
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
