'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth/supabase';
import {
  CreditCard, BadgeCheck, Banknote, ShieldCheck,
  AlertCircle, Loader2, Save, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/vendor/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('gst_number, ifsc_code, bank_account, bank_name, pan_number, aadhar_number')
        .eq('id', user.id)
        .single();

      if (error) throw error;
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
    } catch (err) {
      console.error('Error fetching KYC:', err);
      setError('Could not load KYC data');
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
      <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-navy text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/vendor/portal" className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group w-fit">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>

        <div className="glass p-8 md:p-10 rounded-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent">
              KYC Document Portal
            </h1>
            <p className="text-gray-400 mt-2">Complete your profile to enable full platform features.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3 text-green-300 text-sm">
              <BadgeCheck size={18} className="flex-shrink-0" /> KYC details updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* GST */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">GST Number</label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                  placeholder="27AAPCT1234H1Z5"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary-blue transition text-sm uppercase"
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                />
              </div>
            </div>

            {/* PAN */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">PAN Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  placeholder="AAPCT1234H"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary-blue transition text-sm uppercase"
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                />
              </div>
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Bank Name</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="HDFC Bank"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary-blue transition text-sm"
                />
              </div>
            </div>

            {/* IFSC Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">IFSC Code</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  placeholder="HDFC0001234"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary-blue transition text-sm uppercase"
                  pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                />
              </div>
            </div>

            {/* Bank Account */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Bank Account Number</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleInputChange}
                  placeholder="50100012345678"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary-blue transition text-sm"
                  pattern="^[0-9]{9,18}$"
                />
              </div>
            </div>

            {/* Aadhar */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Aadhar Number (Last 12 digits)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={handleInputChange}
                  placeholder="123456789012"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-primary-blue transition text-sm"
                  pattern="^[0-9]{12}$"
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg font-semibold hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Save KYC Details
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <h4 className="text-yellow-400 text-sm font-semibold mb-1 flex items-center gap-2">
              <ShieldCheck size={16} /> Data Security
            </h4>
            <p className="text-xs text-gray-400">
              Your KYC information is encrypted and only accessible to authorized Scrum Masters for verification. We do not share your bank or identity details with other users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
