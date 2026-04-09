'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn, checkUserActiveStatus, signInWithGoogle } from '@/lib/auth/supabase';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function VendorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { session, user } = await signIn(email, password);
      
      if (session && user) {
        const profile = await checkUserActiveStatus(user.id);
        localStorage.setItem('access_token', session.access_token);

        const role = profile?.role ?? 'PENDING';
        if (role === 'SCRUM_MASTER') {
          router.push('/scrum-master/dashboard');
        } else if (['JUNIOR_PROJECT_MANAGER', 'PROJECT_MANAGER', 'HEAD_PROJECT_MANAGER'].includes(role)) {
          router.push('/user/dashboard');
        } else {
          // VENDOR or PENDING
          router.push('/vendor/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-brand-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background — soft logo colors */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glass card */}
        <div className="glass p-8 md:p-12 rounded-[2.5rem] bg-white/70 border-white shadow-premium-lg">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-premium-md flex items-center justify-center p-2 group-hover:scale-110 transition-transform border border-black/[0.03]">
                <Image src="/logo.png" alt="CureVendAI" width={48} height={48} priority />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-brand-black mb-2 tracking-tighter">
              CureVendAI
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Partner Portal</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-400 px-1">
                Vendor Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-brand-blue transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="provider@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-brand-blue/30 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition text-brand-black placeholder-gray-300 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-400 px-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-brand-yellow transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-brand-yellow/30 focus:bg-white focus:ring-4 focus:ring-brand-yellow/5 transition text-brand-black placeholder-gray-300 text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-brand-yellow text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-premium-lg hover:brightness-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 bg-white text-gray-400 font-black uppercase tracking-widest">Verify with Provider</span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  await signInWithGoogle('VENDOR');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Google Login failed');
                }
              }}
              className="w-full py-3.5 bg-white border border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-xs shadow-premium-sm active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Vendor Google SSO
            </button>
          </form>

          <div className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            <p>Become a certified partner?</p>
            <Link href="/vendor/register" className="text-brand-yellow hover:text-brand-blue transition font-black mt-2 inline-block border-b-2 border-brand-yellow/20 hover:border-brand-blue/20">
              Apply for Certification
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] text-gray-400 hover:text-brand-black uppercase tracking-[0.3em] font-black transition">
            ← Ecosystem Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
