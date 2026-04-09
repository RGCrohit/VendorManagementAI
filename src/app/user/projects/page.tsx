'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, Plus, Search, Filter, 
  ChevronRight, Calendar, Users, Target, 
  AlertCircle, CheckCircle, Clock, X, LayoutGrid, CalendarDays,
  ChevronLeft
} from 'lucide-react';

const PROJECTS = [
  { id: '1', name: 'Project Phoenix', status: 'active', budget: '₹50L', completion: 68, date: '2026-04-05', color: 'bg-brand-blue' },
  { id: '2', name: 'Enterprise Audit', status: 'active', budget: '₹80L', completion: 90, date: '2026-04-12', color: 'bg-brand-pink' },
  { id: '3', name: 'Supply Chain AI', status: 'planning', budget: '₹35L', completion: 5, date: '2026-04-24', color: 'bg-brand-yellow' },
];

export default function ProjectsPage() {
  const [view, setView] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026 init

  // ── CALENDAR LOGIC ──
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(month, year);
    const startOffset = firstDayOfMonth(month, year);
    const prevMonthDays = daysInMonth(month - 1, year);

    const days = [];
    // Prev Month Padding
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false, dateStr: `${year}-${month}-${prevMonthDays - i}` });
    }
    // Current Month
    for (let i = 1; i <= totalDays; i++) {
      const d = i < 10 ? `0${i}` : i;
      const m = (month + 1) < 10 ? `0${month + 1}` : month + 1;
      days.push({ day: i, current: true, dateStr: `${year}-${m}-${d}` });
    }
    // Next Month Padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false, dateStr: `${year}-${month + 2}-${i}` });
    }
    return days;
  }, [currentDate]);

  return (
    <div className="space-y-10 animate-slide-in pb-20 px-4 lg:px-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-brand-black tracking-tighter mb-2">Project Fleet</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Managing {PROJECTS.length} strategic missions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex p-1.5 bg-white border border-black/[0.03] rounded-[1.5rem] shadow-premium-sm">
             <button onClick={() => setView('grid')} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${view === 'grid' ? 'bg-brand-black text-white' : 'text-gray-400'}`}>
                <LayoutGrid size={16} /> Grid
             </button>
             <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${view === 'calendar' ? 'bg-brand-black text-white' : 'text-gray-400'}`}>
                <CalendarDays size={16} /> Schedule
             </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-brand-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-premium-xl hover:shadow-glow transition-all active:scale-95"
          >
             <div className="w-6 h-6 rounded-lg bg-brand-blue flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus size={16} />
             </div>
             New Venture
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={i * 0.1} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass p-10 lg:p-14 bg-white border-white shadow-premium-2xl rounded-[3rem] overflow-hidden">
             
             {/* Calendar Header */}
             <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-black text-brand-black tracking-tighter">Strategic Timeline</h2>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global mission scheduling & deadines</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex bg-surface-soft p-1.5 rounded-2xl border border-black/[0.02]">
                      <button onClick={handlePrevMonth} className="p-3 hover:bg-white rounded-xl transition shadow-sm text-brand-black"><ChevronLeft size={20} /></button>
                      <button onClick={handleNextMonth} className="p-3 hover:bg-white rounded-xl transition shadow-sm text-brand-black"><ChevronRight size={20} /></button>
                   </div>
                   <div className="text-center min-w-[180px]">
                      <p className="text-xl font-black text-brand-black uppercase tracking-tighter">
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                      </p>
                   </div>
                </div>
             </div>

             <div className="border border-black/[0.05] rounded-[2.5rem] overflow-hidden bg-white shadow-premium-lg">
                <div className="grid grid-cols-7 border-b border-black/[0.05] bg-surface-soft/50">
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                     <div key={day} className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{day}</div>
                   ))}
                </div>

                <div className="grid grid-cols-7 bg-black/[0.02] gap-[1px]">
                   {calendarDays.map((date, i) => {
                     const projectsOnDay = PROJECTS.filter(p => p.date === date.dateStr);
                     const isToday = new Date().toDateString() === new Date(date.dateStr).toDateString();

                     return (
                       <div key={i} className={`min-h-[160px] p-4 bg-white hover:z-10 hover:shadow-inner transition-all relative ${!date.current ? 'bg-surface-soft/30' : ''}`}>
                          <div className="flex items-center justify-between mb-4">
                             <span className={`text-[11px] font-black tracking-widest ${isToday ? 'w-8 h-8 bg-brand-black text-white rounded-xl flex items-center justify-center shadow-premium-md' : 'text-gray-300'}`}>
                                {date.day}
                             </span>
                          </div>
                          
                          <div className="space-y-2">
                             {projectsOnDay.map(p => (
                               <motion.div key={p.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`p-2.5 ${p.color} text-white rounded-xl text-[9px] font-black uppercase tracking-tighter truncate shadow-premium-sm cursor-pointer hover:scale-105 transition-transform`}>
                                  {p.name}
                               </motion.div>
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
    </div>
  );
}

function ProjectCard({ project, delay }: { project: any, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="glass p-8 bg-white border-white shadow-premium-lg group hover:shadow-premium-xl transition-all">
       <div className="flex items-start justify-between mb-8">
          <div className="w-14 h-14 rounded-[1.8rem] bg-surface-soft flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shadow-sm">
             <FolderKanban size={24} />
          </div>
          <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest bg-blue-50 text-brand-blue border border-brand-blue/10`}>Active</span>
       </div>
       <h3 className="text-2xl font-black text-brand-black tracking-tighter mb-4">{project.name}</h3>
       <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden mb-6">
          <motion.div initial={{ width: 0 }} animate={{ width: `${project.completion}%` }} className="h-full bg-brand-blue shadow-glow-blue" />
       </div>
       <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget: {project.budget}</p>
          <button className="p-3 bg-surface-soft rounded-xl text-brand-black group-hover:bg-brand-pink group-hover:text-white transition-all"><ChevronRight size={18} /></button>
       </div>
    </motion.div>
  );
}
