'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth/supabase';
import {
  CreditCard, BadgeCheck, Banknote, ShieldCheck,
  AlertCircle, Loader2, Save, ArrowLeft, Building2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VendorKYC() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    gst_number: '',
    ifsc_code: '',
    bank_account: '',
    bank_name: '',
    pan_number: '',
    aadhar_number: '',
  });

  useEffect(() => {
    fetchKYCData();
  }, []);

  async function fetchKYCData() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth error in KYC:', authError);
        window.location.href = '/vendor/login';
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          gst_number: data.gst_number || '',
          ifsc_code: data.ifsc_code || '',
          bank_account: data.bank_account || '',
          bank_name: data.bank_name || '',
          pan_number: data.pan_number || '',
          aadhar_number: data.aadhar_number || '',
        });
      }
    } catch (err: any) {
      console.error('Error fetching KYC:', err);
      setError(err.message || 'Failed to connect to security server');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save KYC');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary-blue mx-auto mb-4" size={32} />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-navy py-12 px-4 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/vendor/portal" className="flex items-center gap-2 text-gray-500 hover:text-white transition group text-[10px] font-black uppercase tracking-[0.3em]">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </Link>
          <div className="flex items-center gap-2">
             <Building2 size={24} className="text-brand-blue" />
             <span className="text-xl font-black text-brand-black tracking-tighter uppercase">CureVendAI</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-[3rem] bg-white border-white shadow-premium-xl"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-4">
              KYC Verification
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Complete your profile to enable payments & project access</p>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4 text-brand-pink text-xs font-bold uppercase tracking-wide">
              <AlertCircle size={20} className="flex-shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 bg-green-50 border border-green-100 rounded-3xl flex items-start gap-4 text-green-600 text-xs font-bold uppercase tracking-wide">
              <BadgeCheck size={20} className="flex-shrink-0" /> KYC details updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">GST Number</label>
              <div className="relative">
                <BadgeCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                  placeholder="27AAPCT1234H1Z5"
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.5rem] text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">PAN Number</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  placeholder="AAPCT1234H"
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.5rem] text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bank Name</label>
              <div className="relative">
                <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g. HDFC Bank"
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.5rem] text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">IFSC Code</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  placeholder="HDFC0001234"
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.5rem] text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bank Account Number</label>
              <div className="relative">
                <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleInputChange}
                  placeholder="50100012345678"
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.5rem] text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Aadhar Number (12 Digits)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012"
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.5rem] text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition"
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-10">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-5 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save KYC Details
              </button>
            </div>
          </form>

          <div className="mt-12 p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
            <h4 className="text-brand-blue text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldCheck size={16} /> Data Protection & Security
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
              Your sensitive data is encrypted at rest. CureVendAI uses bank-grade security to ensure your personal and financial identifiers are never exposed to unauthorized entities.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
