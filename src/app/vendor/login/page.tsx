'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, signOut, checkUserActiveStatus, signInWithGoogle } from '@/lib/auth/supabase';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

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
        // Check active status
        const profile = await checkUserActiveStatus(user.id);
        
        if (!profile.is_active) {
          await signOut();
          throw new Error('Restricted: Your account is pending activation by a Scrum Master.');
        }

        localStorage.setItem('access_token', session.access_token);
        router.push('/vendor/portal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center px-4">
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
            <p className="text-gray-400">Vendor Portal</p>
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
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="company@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition text-white placeholder-gray-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-6 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg font-semibold hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-navy text-gray-500">Or continue with</span>
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
              className="w-full py-2.5 mt-4 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google Login
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-400">Don't have an account?</p>
            <Link href="/vendor/register" className="text-primary-blue hover:text-primary-violet transition font-semibold">
              Register here
            </Link>
          </div>
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
