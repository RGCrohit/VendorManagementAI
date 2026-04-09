'use server';

import { supabase } from '@/lib/auth/supabase';

export async function scheduleMeetingAction({ title, date, time }: { title: string, date: string, time: string }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('meetings').insert({
      organizer_id: user.id,
      title,
      meeting_date: date,
      meeting_time: time,
      status: 'scheduled'
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Meeting insert error:', error);
    return { success: false, error: error.message };
  }
}
