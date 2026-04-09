import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/auth/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  company_name: string | null;
  role: string;
  is_active: boolean;
  gst_number?: string | null;
  pan_number?: string | null;
  bank_account?: string | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  aadhar_number?: string | null;
  created_at: string;
};

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.warn('Profile fetch error:', profileError.message);
      return null;
    }
    return data as Profile;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          if (mounted) setProfile(p);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setLoading(true);
        const p = await fetchProfile(session.user.id);
        if (mounted) {
          setProfile(p);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return { user, profile, loading, error };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
