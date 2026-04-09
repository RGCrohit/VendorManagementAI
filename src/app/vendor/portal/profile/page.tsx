'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/auth/supabase';
import { 
  Building2, Mail, Save, User, 
  ArrowLeft, CheckCircle2, Loader2, Globe
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VendorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    email: '',
    company_name: '',
    full_name: '',
    industry: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('id, email, company_name, full_name, role')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        id: data.id,
        email: data.email || user.email || '',
        company_name: data.company_name || '',
        full_name: data.full_name || '',
        industry: '', // Placeholder
      });
    }
    setLoading(false);
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        company_name: profile.company_name,
        full_name: profile.full_name,
      })
      .eq('id', profile.id);

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" /></div>;

  return (
    <div className="space-y-8 animate-slide-in max-w-4xl mx-auto">
      <Link href="/vendor/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-brand-black transition text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to Hub
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">My Profile</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Manage your vendor identity and credentials</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 bg-white border-white shadow-premium-xl rounded-[3rem]"
      >
        <form onSubmit={handleUpdate} className="space-y-8">
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  value={profile.company_name}
                  onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  readOnly
                  value={profile.email}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-400 cursor-not-allowed outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contact Person</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  className="w-full pl-14 pr-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-black/[0.03]">
            {success && (
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} /> Profile Updated Successfully!
              </p>
            )}
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
            </button>
          </div>
        </form>

        <div className="mt-12 p-8 bg-blue-50/20 rounded-[2.5rem] border border-blue-100/50">
          <h4 className="text-brand-blue text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <Globe size={16} /> Public Presence
          </h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
            Your company name is visible to project managers across the CureVendAI network. 
            Keep it professional to improve your vendor rating and discovery.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
