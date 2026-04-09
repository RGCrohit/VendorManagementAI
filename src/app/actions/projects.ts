'use server';

import { supabase } from '@/lib/auth/supabase';
import { revalidatePath } from 'next/cache';

export async function createProjectAction(formData: { name: string, budget: string, startDate: string }) {
  try {
    // For FITATHALON DEMO: We will try to get user, but if it fails we check if we can at least insert.
    // In production, you'd use @supabase/ssr setSession.
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('projects').insert({
      name: formData.name,
      budget: parseFloat(formData.budget.replace(/[^0-9.]/g, '')),
      spent: 0,
      timeline: formData.startDate,
      // If we have user, we could link it here.
    });

    if (error) throw error;

    revalidatePath('/user/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Project creation error:', error);
    // If auth fails but we are in demo mode, let's try to explain or bypass if permitted by DB
    return { success: false, error: "Please log in again. Your session may have expired." };
  }
}

export async function getProjects() {
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getMeetings() {
   const { data } = await supabase.from('meetings').select('*').order('meeting_date', { ascending: true });
   return data || [];
}
