'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, Plus, 
  ChevronRight, LayoutGrid, CalendarDays,
  ChevronLeft, Loader2, Video, Sparkles, Building2
} from 'lucide-react';
import { createProjectAction, getProjects, getMeetings } from '@/app/actions/projects';

export default function ProjectsPage() {
  const [view, setView] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); 
  const [projects, setProjects] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', budget: '', startDate: '2026-04-10' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [pData, mData] = await Promise.all([getProjects(), getMeetings()]);
    setProjects(pData);
    setMeetings(mData);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createProjectAction(formData);
    if (res.success) {
       await loadData();
       setIsModalOpen(false);
       setFormData({ name: '', budget: '', startDate: '2026-04-10' });
    } else {
       alert(res.error);
    }
    setSubmitting(false);
  };

  // ── CALENDAR LOGIC ──
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(month, year);
    const startOffset = firstDayOfMonth(month, year);
    const prevMonthDays = daysInMonth(month - 1, year);
    const days = [];
    for (let i = startOffset - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, current: false, dateStr: `${year}-${month}-${prevMonthDays - i}` });
    for (let i = 1; i <= totalDays; i++) {
       const d = i < 10 ? `0${i}` : i;
       const m = (month + 1) < 10 ? `0${month + 1}` : month + 1;
       days.push({ day: i, current: true, dateStr: `${year}-${m}-${d}` });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, current: false, dateStr: `${year}-${month + 2}-${i}` });
    return days;
  }, [currentDate]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-slide-in overflow-hidden">
      
      {/* ── HEADER ── */}
        </div>
      </div>

      {/* ── PROJECT HIGHLIGHTS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
         {[
            { label: 'Active Ventures', value: projects.length, icon: Building2, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
            { label: 'Deployment Budget', value: `₹${(projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0) / 10000000).toFixed(1)}Cr`, icon: Sparkles, color: 'text-brand-pink', bg: 'bg-brand-pink/5' },
            { label: 'Completion Avg', value: `${projects.length ? Math.round(projects.reduce((acc, p) => acc + (p.budget ? (p.spent/p.budget)*100 : 0), 0) / projects.length) : 0}%`, icon: LayoutGrid, color: 'text-brand-yellow', bg: 'bg-brand-yellow/5' },
            { label: 'High Risk Alerts', value: projects.filter(p => (p.spent/p.budget) > 0.9).length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50/50' },
         ].map((stat, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="glass p-4 rounded-3xl bg-white border-white shadow-premium-sm flex items-center gap-4">
               <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}><stat.icon size={18} /></div>
               <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
                  <p className="text-sm font-black text-brand-black tracking-tighter">{stat.value}</p>
               </div>
            </motion.div>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={i * 0.05} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 glass p-6 bg-white border-white shadow-premium-xl rounded-[2.5rem] flex flex-col overflow-hidden">
             
             {/* Calendar Header */}
             <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                   <div className="flex bg-surface-soft p-1 rounded-xl border border-black/[0.01]">
                      <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg transition shadow-sm text-brand-black"><ChevronLeft size={16} /></button>
                      <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg transition shadow-sm text-brand-black"><ChevronRight size={16} /></button>
                   </div>
                   <p className="text-sm font-black text-brand-black uppercase tracking-widest">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400"><span className="w-2 h-2 rounded-full bg-brand-blue" /> Project</div>
                   <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400"><span className="w-2 h-2 rounded-full bg-brand-pink" /> Call</div>
                   {loading && <Loader2 className="animate-spin text-brand-blue ml-4" size={16} />}
                </div>
             </div>

             <div className="flex-1 flex flex-col border-[2px] border-black/[0.08] rounded-[2.5rem] overflow-hidden bg-white shadow-premium-lg">
                <div className="grid grid-cols-7 border-b-[2px] border-black/[0.1] bg-surface-soft/60">
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                     <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-brand-black/40">{day}</div>
                   ))}
                </div>

                <div className="flex-1 grid grid-cols-7 bg-black/[0.06] gap-[2px] min-h-0">
                   {calendarDays.map((date, i) => {
                     const projectsOnDay = projects.filter(p => (p.timeline?.split(' - ')?.[0] || p.timeline) === date.dateStr);
                     const meetingsOnDay = meetings.filter(m => m.meeting_date === date.dateStr);
                     const isToday = new Date().toISOString().split('T')[0] === date.dateStr;

                     return (
                       <div key={i} className={`p-4 bg-white hover:bg-brand-blue/[0.02] transition-all flex flex-col overflow-hidden ${!date.current ? 'bg-surface-soft/40 opacity-30 shadow-inner' : ''}`}>
                          <div className="flex items-center justify-between mb-3 flex-shrink-0">
                             <span className={`text-[12px] font-black tracking-tighter ${isToday ? 'w-7 h-7 bg-brand-black text-white rounded-lg flex items-center justify-center shadow-premium-lg' : 'text-gray-400'}`}>{date.day}</span>
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar min-h-0">
                             {projectsOnDay.map(p => (
                               <div key={p.id} className="p-2.5 bg-brand-black text-white rounded-xl text-[8px] font-black uppercase tracking-tighter truncate shadow-premium-sm flex items-center gap-2 border border-white/5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" /> {p.name}
                               </div>
                             ))}
                             {meetingsOnDay.map(m => (
                               <div key={m.id} className="p-2 px-3 bg-brand-pink text-white rounded-xl text-[8px] font-black uppercase tracking-tighter truncate shadow-premium-sm flex items-center gap-2 border border-white/10">
                                  <Video size={12} /> {m.title}
                               </div>
                             ))}
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-premium-2xl p-10 overflow-hidden">
               <h2 className="text-2xl font-black text-brand-black tracking-tighter mb-8">New Venture Deployment</h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-3">Venture Name</label>
                     <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Neo Infrastructure" className="w-full px-5 py-3.5 bg-surface-soft rounded-2xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-brand-blue/20 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-3">Budget (INR)</label>
                        <input required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} type="text" placeholder="5,000,000" className="w-full px-5 py-3.5 bg-surface-soft rounded-2xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-brand-blue/20 transition" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-3">Launch Date</label>
                        <input required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} type="date" className="w-full px-5 py-3.5 bg-surface-soft rounded-2xl text-xs font-bold outline-none border border-transparent focus:bg-white focus:border-brand-blue/20 transition" />
                     </div>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-4 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                     {submitting ? <Loader2 className="animate-spin" size={14} /> : 'Deploy Project'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, delay }: { project: any, delay: number }) {
  const completion = project.budget ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : 0;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} className="glass p-6 bg-white border-white shadow-premium-lg flex flex-col h-fit group">
       <div className="flex items-start justify-between mb-6">
          <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all"><FolderKanban size={18} /></div>
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${completion > 90 ? 'bg-red-50 text-brand-pink border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
             {completion > 90 ? 'Critical' : 'Operational'}
          </span>
       </div>
       <h3 className="text-lg font-black text-brand-black tracking-tighter mb-4">{project.name}</h3>
       <div className="flex-1 space-y-4">
          <div className="w-full bg-surface-soft h-1 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }} className={`h-full ${completion > 90 ? 'bg-brand-pink shadow-glow-pink' : 'bg-brand-blue shadow-glow-blue'}`} />
          </div>
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-400">
             <span>Status: Live</span>
             <span className="text-brand-black">{completion}% Burn Rate</span>
          </div>
       </div>
    </motion.div>
  );
}
