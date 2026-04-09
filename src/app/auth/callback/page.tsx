'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signOut } from '@/lib/auth/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw new Error(`Session error: ${sessionError.message}`);

        if (!session) {
          // OAuth redirects happen via hash — session may not be ready immediately
          return;
        }

        // Try to fetch the user profile
        let profile: { is_active: boolean; role: string | null } | null = null;

        try {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('is_active, role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            // If profiles table doesn't exist or profile not created yet, allow through
            console.warn('Profile fetch warning:', profileError.message);
            profile = null;
          } else {
            profile = data;
          }
        } catch (profileErr) {
          console.warn('Profile lookup failed, proceeding without profile check:', profileErr);
          profile = null;
        }

        const isGoogleAuth =
          session.user.app_metadata?.provider === 'google' ||
          session.user.app_metadata?.providers?.includes('google');

        // Only enforce is_active for non-Google, non-new users
        if (!isGoogleAuth && profile && !profile.is_active) {
          await signOut();
          router.push('/vendor/login?error=Your account is pending activation by a Scrum Master.');
          return;
        }

        localStorage.setItem('access_token', session.access_token);

        // Route by role, fallback to vendor portal
        const role = profile?.role;
        if (role === 'SCRUM_MASTER') {
          router.push('/scrum-master/dashboard');
        } else if (role === 'PM') {
          router.push('/pm/dashboard');
        } else {
          router.push('/vendor/portal');
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
            Check your Supabase dashboard — the <code className="text-primary-blue">profiles</code> table may need to be created via the SQL migration.
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

