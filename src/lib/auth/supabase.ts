import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Auth functions ──────────────────────────────────────────────────────────

export async function signUpUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'PROJECT_MANAGER',
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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data; // { session, user }
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

export async function signInWithGoogle(role: string = 'VENDOR') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { access_type: 'offline', prompt: 'consent' },
      redirectTo: `${window.location.origin}/auth/callback?intended_role=${role}`,
    },
  });
  if (error) throw error;
  return data;
}

export async function checkUserActiveStatus(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, username, full_name, company_name, role, is_active')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { is_active: false, role: 'PENDING', username: null, full_name: null, company_name: null };
    }
    throw error;
  }
  return data;
}
