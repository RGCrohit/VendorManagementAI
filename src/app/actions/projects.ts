'use server';

import { supabase } from '@/lib/auth/supabase';
import { revalidatePath } from 'next/cache';

export async function createProjectAction(formData: { name: string, budget: string, startDate: string }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('projects').insert({
      name: formData.name,
      budget: parseFloat(formData.budget.replace(/[^0-9.]/g, '')),
      spent: 0,
      timeline: formData.startDate,
      // We assume public projects for now, or you can add creator_id logic
    });

    if (error) throw error;

    revalidatePath('/user/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Project creation error:', error);
    return { success: false, error: error.message };
  }
}

export async function getProjects() {
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return data || [];
}
