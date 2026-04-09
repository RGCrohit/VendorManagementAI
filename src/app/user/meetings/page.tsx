'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Video, Mail, Clock, Users, 
  ChevronLeft, ChevronRight, X, ExternalLink, Send
} from 'lucide-react';
import { supabase } from '@/lib/auth/supabase';

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

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .order('meeting_date', { ascending: true });
    if (data) setMeetings(data);
  };

  const handleCreateMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const { error } = await supabase.from('meetings').insert({
      title: formData.get('title'),
      description: formData.get('description'),
      meeting_date: formData.get('date'),
      meeting_time: formData.get('time'),
      duration_minutes: parseInt(formData.get('duration') as string) || 60,
      meeting_link: formData.get('meetLink') || null,
    });

    if (!error) {
      await fetchMeetings();
      setIsCreateOpen(false);
      form.reset();
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
          <button 
            onClick={() => setIsEmailOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-100 text-brand-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-sm hover:shadow-premium-md transition-all active:scale-95"
          >
            <Mail size={16} /> Send Email
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95"
          >
            <Plus size={16} /> New Meeting
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Calendar */}
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
            {/* Day headers */}
            <div className="grid grid-cols-7 bg-surface-soft border-b border-black/[0.05]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">{day}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-black/[0.03]">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] bg-white/60 p-2" />
              ))}
              
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayMeetings = getMeetingsForDate(day);
                const todayClass = isToday(day);
                
                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[100px] bg-white p-2 hover:bg-brand-blue/[0.02] transition-colors cursor-pointer
                      ${selectedDate === day ? 'ring-2 ring-brand-blue ring-inset' : ''}`}
                  >
                    <span className={`text-[11px] font-black inline-flex items-center justify-center w-7 h-7 rounded-full
                      ${todayClass ? 'bg-brand-black text-white' : 'text-gray-500'}`}>
                      {day}
                    </span>
                    
                    {dayMeetings.map(m => (
                      <div key={m.id} className="mt-1.5 p-1.5 bg-brand-blue text-white rounded-lg text-[8px] font-bold truncate shadow-sm">
                        {m.meeting_time ? `${m.meeting_time} ` : ''}{m.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings Sidebar */}
        <div className="glass p-8 bg-white border-white shadow-premium-lg rounded-[2rem] flex flex-col">
          <h2 className="text-xl font-black text-brand-black tracking-tight mb-6">Upcoming</h2>
          
          <div className="flex-1 space-y-4">
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No upcoming meetings</p>
            ) : (
              upcomingMeetings.map(meeting => (
                <motion.div 
                  key={meeting.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 rounded-2xl bg-surface-soft border border-black/[0.02] hover:bg-white transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-black text-brand-black group-hover:text-brand-blue transition leading-snug">{meeting.title}</p>
                    {meeting.meeting_link && (
                      <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition">
                        <Video size={14} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(meeting.meeting_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    {meeting.meeting_time && <span className="flex items-center gap-1"><Clock size={11} /> {meeting.meeting_time}</span>}
                    <span className="flex items-center gap-1"><Clock size={11} /> {meeting.duration_minutes}m</span>
                  </div>
                  {meeting.description && (
                    <p className="text-[10px] text-gray-400 mt-2 line-clamp-2">{meeting.description}</p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Meeting Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-premium-xl border border-white p-10 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-brand-black tracking-tighter">Schedule Meeting</h2>
                <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-surface-soft rounded-xl transition"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleCreateMeeting} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Title</label>
                  <input name="title" type="text" required placeholder="e.g. Weekly Standup" className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Date</label>
                    <input name="date" type="date" required className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Time</label>
                    <input name="time" type="text" placeholder="10:00 AM" className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Duration (mins)</label>
                    <input name="duration" type="number" defaultValue={60} className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Google Meet Link</label>
                    <input name="meetLink" type="url" placeholder="https://meet.google.com/..." className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description</label>
                  <textarea name="description" rows={3} placeholder="Meeting agenda..." className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition resize-none" />
                </div>
                <button type="submit" className="w-full py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95">
                  Schedule Meeting
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Send Email Modal */}
      <AnimatePresence>
        {isEmailOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEmailOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-premium-xl border border-white p-10 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-brand-black tracking-tighter">Send Email</h2>
                <button onClick={() => setIsEmailOpen(false)} className="p-2 hover:bg-surface-soft rounded-xl transition"><X size={20} /></button>
              </div>
              
              <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">To</label>
                  <input type="email" required placeholder="vendor@example.com" className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                  <input type="text" required placeholder="e.g. Payment Confirmation" className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                  <textarea rows={5} placeholder="Type your message..." className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition resize-none" />
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <Mail size={16} className="text-brand-blue mt-0.5" />
                  <p className="text-[10px] font-medium text-blue-600/80">Emails will be sent via your connected Gmail account. Connect in Settings to enable.</p>
                </div>
                <button type="submit" className="w-full py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Send size={16} /> Send Email
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
