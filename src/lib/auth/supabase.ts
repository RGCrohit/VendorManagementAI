import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export async function signUpPM(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'PM',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signUpVendor(email: string, password: string, companyName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName,
        role: 'VENDOR',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle(role: string = 'VENDOR') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

export async function checkUserActiveStatus(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_active, role')
    .eq('id', userId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      // Profile not found, possibly not created yet by trigger.
      return { is_active: false, role: null };
    }
    throw error;
  }
  return data;
}
