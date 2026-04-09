'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Video, Mail, Clock, Users, 
  ChevronLeft, ChevronRight, X, ExternalLink, Send, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/auth/supabase';
import { sendEmail } from '@/app/actions/email';

type Meeting = {
  id: string;
  title: string;
  description: string;
  meeting_date: string;
  meeting_time: string;
  duration_minutes: number;
  meeting_link: string;
  status: string;
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('meetings')
      .select('*')
      .eq('organizer_id', user.id)
      .order('meeting_date', { ascending: true });
    if (data) setMeetings(data);
  };

  const handleCreateMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const { error } = await supabase.from('meetings').insert({
      title: formData.get('title'),
      description: formData.get('description'),
      meeting_date: formData.get('date'),
      meeting_time: formData.get('time'),
      duration_minutes: 60,
      organizer_id: user.id
    });

    if (!error) {
      await fetchMeetings();
      setIsCreateOpen(false);
      form.reset();
    }
  };

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailStatus(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    const googleToken = session?.provider_token;
    
    const formData = new FormData(e.currentTarget);
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    const result = await sendEmail({ to, subject, message, googleToken });
    
    setEmailLoading(true); // reset
    setEmailLoading(false);
    if (result.success) {
      setEmailStatus({ success: true, message: `Sent via ${result.method === 'google_api' ? 'your Gmail' : 'System Proxy'}` });
      setTimeout(() => {
        setIsEmailOpen(false);
        setEmailStatus(null);
      }, 2000);
    } else {
      setEmailStatus({ success: false, message: result.error || 'Failed to send' });
    }
  };

  // Calendar helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getMeetingsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.filter(m => m.meeting_date === dateStr);
  };

  const today = new Date();
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  const upcomingMeetings = meetings.filter(m => new Date(m.meeting_date) >= new Date(today.toDateString())).slice(0, 5);

  return (
    <div className="space-y-8 animate-slide-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Meetings</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Schedule and manage your team meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsEmailOpen(true)} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-100 text-brand-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-sm hover:shadow-premium-md transition-all active:scale-95">
            <Mail size={16} /> Send Email
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-6 py-3.5 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95">
            <Plus size={16} /> New Meeting
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 bg-white border-white shadow-premium-lg rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-brand-black tracking-tight">{monthName}</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2.5 rounded-xl border border-black/[0.05] hover:bg-surface-soft transition"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition">Today</button>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2.5 rounded-xl border border-black/[0.05] hover:bg-surface-soft transition"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="border border-black/[0.05] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 bg-surface-soft border-b border-black/[0.05]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-black/[0.03]">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => ( <div key={`empty-${i}`} className="min-h-[100px] bg-white/60 p-2" /> ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayMeetings = getMeetingsForDate(day);
                const todayClass = isToday(day);
                return (
                  <div key={day} onClick={() => setSelectedDate(day)} className={`min-h-[100px] bg-white p-2 hover:bg-brand-blue/[0.02] transition-colors cursor-pointer ${selectedDate === day ? 'ring-2 ring-brand-blue ring-inset' : ''}`}>
                    <span className={`text-[11px] font-black inline-flex items-center justify-center w-7 h-7 rounded-full ${todayClass ? 'bg-brand-black text-white' : 'text-gray-500'}`}>{day}</span>
                    {dayMeetings.map(m => ( <div key={m.id} className="mt-1.5 p-1.5 bg-brand-blue text-white rounded-lg text-[8px] font-bold truncate shadow-sm">{m.title}</div> ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="glass p-8 bg-white border-white shadow-premium-lg rounded-[2rem] flex flex-col">
          <h2 className="text-xl font-black text-brand-black tracking-tight mb-6">Upcoming</h2>
          <div className="flex-1 space-y-4">
            {upcomingMeetings.length === 0 ? ( <p className="text-sm text-gray-400 text-center py-10">No upcoming meetings</p> ) : (
              upcomingMeetings.map(meeting => (
                <motion.div key={meeting.id} className="p-5 rounded-2xl bg-surface-soft border border-black/[0.02] hover:bg-white transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-black text-brand-black group-hover:text-brand-blue transition leading-snug">{meeting.title}</p>
                    {meeting.meeting_link && ( <a href={meeting.meeting_link} target="_blank" className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue"><Video size={14} /></a> )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(meeting.meeting_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {meeting.meeting_time}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsCreateOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-10">
               <h2 className="text-2xl font-black mb-6">New Meeting</h2>
               <form onSubmit={handleCreateMeeting} className="space-y-4">
                 <input name="title" required placeholder="Title" className="w-full p-4 bg-surface-soft rounded-2xl outline-none" />
                 <input name="date" type="date" required className="w-full p-4 bg-surface-soft rounded-2xl outline-none" />
                 <input name="time" placeholder="Time" className="w-full p-4 bg-surface-soft rounded-2xl outline-none" />
                 <button className="w-full py-4 bg-brand-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Schedule</button>
               </form>
            </motion.div>
          </div>
        )}
        {isEmailOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsEmailOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-10">
               <h2 className="text-2xl font-black mb-6">Send Email</h2>
               <form onSubmit={handleSendEmail} className="space-y-4">
                 <input name="to" type="email" required placeholder="To" className="w-full p-4 bg-surface-soft rounded-2xl outline-none" />
                 <input name="subject" required placeholder="Subject" className="w-full p-4 bg-surface-soft rounded-2xl outline-none" />
                 <textarea name="message" rows={5} placeholder="Message" className="w-full p-4 bg-surface-soft rounded-2xl outline-none resize-none" />
                 {emailStatus && <p className={`text-[10px] font-bold ${emailStatus.success ? 'text-green-600' : 'text-red-600'}`}>{emailStatus.message}</p>}
                 <button disabled={emailLoading} className="w-full py-4 bg-brand-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                   {emailLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Send
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
