'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth/supabase';
import { Loader2 } from 'lucide-react';

const USER_ROLES = [
  'JUNIOR_PROJECT_MANAGER',
  'PROJECT_MANAGER',
  'HEAD_PROJECT_MANAGER',
];

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw new Error(`Session error: ${sessionError.message}`);
        if (!session) return; // Wait for SIGNED_IN event

        // Fetch this user's profile from the DB
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_active, role')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('Profile lookup failed:', profileError.message);
        }

        localStorage.setItem('access_token', session.access_token);

        const role = profile?.role ?? 'PENDING';

        // Route by role
        if (role === 'SCRUM_MASTER') {
          router.push('/scrum-master/dashboard');
        } else if (USER_ROLES.includes(role)) {
          router.push('/user/dashboard');
        } else if (role === 'VENDOR') {
          router.push('/vendor/portal');
        } else {
          // PENDING or unknown — check URL param first (from Google SSO), then user_metadata
          const urlParams = new URLSearchParams(window.location.search);
          const intendedRole = urlParams.get('intended_role') || session.user.user_metadata?.role || 'PROJECT_MANAGER';
          if (intendedRole === 'VENDOR') {
            router.push('/vendor/portal');
          } else {
            router.push('/user/dashboard');
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        console.error('Auth callback error:', msg);
        setError(msg);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        handleCallback();
      }
    });

    handleCallback();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-navy text-white flex flex-col items-center justify-center px-4">
      {error ? (
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4 text-xl font-semibold">Authentication Error</div>
          <p className="text-gray-300 mb-2 text-sm bg-white/5 border border-white/10 rounded-lg p-4 font-mono break-all">
            {error}
          </p>
          <p className="text-gray-500 text-xs mb-6 mt-2">
            Check your Supabase dashboard — the <code className="text-primary-blue">profiles</code> table may need the SQL migration applied.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
          >
            Return Home
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-primary-blue" />
          <p className="text-gray-400 animate-pulse">Completing authentication...</p>
        </div>
      )}
    </div>
  );
}
