'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signUpVendor } from '@/lib/auth/supabase';
import { BuildingIcon, Mail, Lock, FileText, AlertCircle, Loader2, Upload } from 'lucide-react';

export default function VendorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    gstNumber: '',
    ifscCode: '',
    password: '',
    confirmPassword: '',
  });
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setChequeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { user } = await signUpVendor(formData.email, formData.password, formData.companyName);
      if (user) {
        router.push(`/vendor/login?email=${formData.email}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center px-4 py-8">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 md:p-12 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent">
              ProcurAI
            </h1>
            <p className="text-gray-400">Vendor Registration</p>
            <p className="text-sm text-gray-500 mt-2">Step {step} of 2</p>
          </div>

          <div className="w-full bg-white/5 rounded-full h-1 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-blue to-primary-violet h-full transition-all"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Company Name
                  </label>
                  <div className="relative">
                    <BuildingIcon className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your Company"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="company@email.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="27AAPCT1234H1Z5"
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="SBIN0001234"
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 mt-6 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg font-semibold hover:shadow-glow transition-all"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Cancelled Cheque (PDF/Image)
                  </label>
                  <label className="flex items-center justify-center px-4 py-4 bg-white/5 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-primary-blue transition">
                    <div className="text-center">
                      <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">
                        {chequeFile ? chequeFile.name : 'Click to upload'}
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 font-semibold hover:bg-white/5 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg font-semibold hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>Already registered?</p>
              <Link href="/vendor/login" className="text-primary-blue hover:text-primary-violet transition">
                Sign in here
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-primary-blue transition">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
