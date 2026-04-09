'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, Mail, Lock, FileText, 
  MapPin, CheckCircle, ChevronRight, ChevronLeft,
  Camera, Upload, ShieldCheck, AlertCircle, Loader2, Zap, ScanLine
} from 'lucide-react';

export default function VendorRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form values for auto-fill demo
  const [entityName, setEntityName] = useState('');
  const [gstNum, setGstNum] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const triggerAutoFill = () => {
    setIsScanning(true);
    setTimeout(() => {
      setEntityName('Apex Industrial Fab Lab');
      setGstNum('27AAPCT4412H1Z5');
      setIsScanning(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-premium-lg">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-brand-black mb-4">Verification Active</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Your telemetry has been matched via **Neural OCR**. 
            CureVendAI governance is now syncing your node to the global ledger.
          </p>
          <Link href="/" className="inline-block px-10 py-4 bg-brand-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium-lg active:scale-95 transition-all">
            Registry Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-brand-black flex items-center justify-center py-20 px-4 relative overflow-hidden">
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full filter blur-[100px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6 group">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-premium-md flex items-center justify-center p-2 group-hover:scale-110 transition-transform border border-black/[0.03]">
              <Image src="/logo.png" alt="CureVendAI" width={48} height={48} />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Partner Certification</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Step {step} of 3 • {step === 1 ? 'Enterprise Identity' : step === 2 ? 'KYC Mastery' : 'Protocol Entry'}</p>
        </div>

        <div className="glass p-8 md:p-12 rounded-[3.5rem] bg-white border-white shadow-premium-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-50">
             <motion.div className="h-full bg-brand-pink" initial={{ width: '33.3%' }} animate={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 pt-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-[2rem] flex items-center justify-between mb-4">
                     <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Optional: Auto-fill via Master PDF</p>
                     <button type="button" onClick={triggerAutoFill} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-premium-sm">
                        {isScanning ? <Loader2 size={12} className="animate-spin" /> : <ScanLine size={12} className="inline-block mr-2" />}
                        Quick Scan
                     </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Legal Entity Name</label>
                       <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="text" value={entityName} onChange={e => setEntityName(e.target.value)} placeholder="Acme Solutions Ltd" required className="w-full pl-12 pr-4 py-4 bg-surface-soft border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Industry Sector</label>
                      <div className="relative">
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="text" placeholder="IT Services / Mfg" required className="w-full pl-12 pr-4 py-4 bg-surface-soft border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Gst / Tax Identifier</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="text" value={gstNum} onChange={e => setGstNum(e.target.value)} placeholder="27AAPCT..." required className="w-full pl-12 pr-4 py-4 bg-surface-soft border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition outline-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Registrant Photo</label>
                       <div className="aspect-square rounded-[2.5rem] bg-surface-soft border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 group hover:bg-white hover:border-brand-blue transition-all cursor-pointer relative overflow-hidden">
                          <Camera size={40} className="text-gray-300 group-hover:text-brand-blue transition-colors" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Facial Match Sync</p>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">PAN Master Doc</label>
                       <div className="aspect-square rounded-[2.5rem] bg-surface-soft border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 group hover:bg-white hover:border-brand-pink transition-all cursor-pointer relative overflow-hidden">
                          <Upload size={40} className="text-gray-300 group-hover:text-brand-pink transition-colors" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trigger Neural OCR</p>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={triggerAutoFill} />
                       </div>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                     <ShieldCheck size={24} className="text-brand-blue" />
                     <p className="text-[10px] font-medium text-blue-600/80 leading-relaxed uppercase tracking-tighter">
                        Uploading your PAN will **automatically trigger** the CureVendAI extraction engine to verify your registry data.
                     </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Admin Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="email" placeholder="gov@partner.ai" required className="w-full pl-12 pr-4 py-4 bg-surface-soft border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Secure Node Key</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="password" placeholder="••••••••" required className="w-full pl-12 pr-4 py-4 bg-surface-soft border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-pink/5 transition outline-none" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-4">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="flex-1 py-5 bg-surface-soft text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Previous
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="flex-[2] py-5 bg-brand-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95">
                  Confirm & Advance <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex-[2] py-5 bg-brand-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Finalize Sync'}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/vendor/login" className="text-[10px] text-gray-400 hover:text-brand-black uppercase tracking-[0.3em] font-black transition">
            ← Synchronize Existing Node
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
