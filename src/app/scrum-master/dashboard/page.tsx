'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, checkUserActiveStatus } from '@/lib/auth/supabase';
import { 
  Shield, LogOut, CheckCircle2, XCircle, 
  ChevronDown, Building2, UserCircle2, 
  Search, Filter, ShieldCheck, UserPlus,
  RefreshCw, MoreVertical, Settings, Activity,
  Lock, Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Profile = {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  full_name?: string;
};

const USER_ROLES = [
  { value: 'PENDING', label: 'Restricted Access' },
  { value: 'VENDOR', label: 'Vendor Partner' },
  { value: 'JUNIOR_PROJECT_MANAGER', label: 'Junior Ops' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'HEAD_PROJECT_MANAGER', label: 'Executive' },
  { value: 'SCRUM_MASTER', label: 'Admin (SM)' },
];

export default function ScrumMasterDashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VENDOR' | 'USER' | 'PENDING'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/user/login');
        return;
      }
      
      const userProfile = await checkUserActiveStatus(session.user.id);
      if (userProfile.role !== 'SCRUM_MASTER') {
        router.push('/user/dashboard'); // Redirect standard users
        return;
      }
      
      fetchProfiles();
    };
    
    fetchAuth();
  }, [router]);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      setError('Failed to load system profiles');
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', id);
      
    if (!error) {
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);
      
    if (!error) {
       setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/user/login');
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'PENDING') return p.role === 'PENDING';
    if (filter === 'VENDOR') return p.role === 'VENDOR';
    if (filter === 'USER') return p.role !== 'VENDOR' && p.role !== 'PENDING';
    return true;
  });

  if (loading) return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center">
       <div className="text-center space-y-4">
          <Activity size={48} className="animate-spin text-brand-blue mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initializing Command Center...</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-soft text-brand-black font-sans">
      
      {/* ── Governance Header ── */}
      <nav className="h-24 bg-white border-b border-black/[0.03] px-10 flex items-center justify-between sticky top-0 z-[100] shadow-premium-sm">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 rounded-2xl bg-white shadow-premium-md flex items-center justify-center p-2 border border-black/[0.03]">
              <ShieldCheck size={28} className="text-brand-blue" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-brand-black tracking-tighter">Command Center</h1>
              <p className="text-[9px] font-black text-brand-pink uppercase tracking-widest leading-none">Global Role & Access Management</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <button onClick={fetchProfiles} className="p-3 bg-surface-soft rounded-2xl hover:bg-white transition-all shadow-sm active:scale-95 group">
              <RefreshCw size={18} className="text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
           </button>
           <button onClick={handleSignOut} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-pink transition-all">
              <LogOut size={16} /> Exit Base
           </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-10 space-y-10">

        {/* ── System Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'Total Principals', value: profiles.length, icon: UserCircle2, color: 'text-brand-blue' },
             { label: 'Unverified', value: profiles.filter(p => !p.is_active).length, icon: Lock, color: 'text-brand-pink' },
             { label: 'Active Vendors', value: profiles.filter(p => p.role === 'VENDOR').length, icon: Building2, color: 'text-brand-yellow' },
             { label: 'Operational staff', value: profiles.filter(p => p.role !== 'VENDOR' && p.role !== 'PENDING').length, icon: Shield, color: 'text-green-500' },
           ].map((s, i) => (
             <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-8 bg-white border-white shadow-premium-lg">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{s.label}</p>
                   <s.icon size={20} className={s.color} />
                </div>
                <p className="text-4xl font-black text-brand-black">{s.value}</p>
             </motion.div>
           ))}
        </div>

        {/* ── Main Access Table ── */}
        <div className="glass bg-white/70 border-white shadow-premium-2xl rounded-[3rem] overflow-hidden">
           
           {/* Table Filters */}
           <div className="p-10 border-b border-black/[0.02] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="relative w-full max-w-md group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-blue transition-colors" size={18} />
                 <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Identity, Email or Role..." 
                    className="w-full pl-16 pr-6 py-4 bg-surface-soft border border-transparent rounded-[1.8rem] text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition" 
                 />
              </div>

              <div className="flex bg-surface-soft p-1.5 rounded-[1.5rem] border border-black/[0.01]">
                 {(['ALL', 'PENDING', 'VENDOR', 'USER'] as const).map(f => (
                   <button key={f} onClick={() => setFilter(f)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-brand-black shadow-premium-md' : 'text-gray-400 hover:text-brand-black'}`}>
                      {f} Principals
                   </button>
                 ))}
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-surface-soft/30">
                       <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">System Principal</th>
                       <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Assigned Privilege</th>
                       <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Authorization Status</th>
                       <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Control Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-black/[0.02]">
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} className="group hover:bg-surface-soft transition-colors">
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-pink flex items-center justify-center text-white font-black text-sm shadow-premium-md">
                                  {p.username?.[0] || p.email?.[0] || 'U'}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-brand-black truncate">{p.full_name || p.username || 'System User'}</p>
                                  <p className="text-[10px] font-bold text-gray-400">{p.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-8">
                            <select 
                               value={p.role} 
                               onChange={(e) => handleRoleChange(p.id, e.target.value)}
                               className="bg-white border border-black/[0.05] rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-blue/5 transition shadow-sm text-brand-blue"
                            >
                               {USER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                         </td>
                         <td className="px-6 py-8 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-brand-pink border border-red-100'}`}>
                               {p.is_active ? 'Fully Authorized' : 'Access Revoked'}
                            </span>
                         </td>
                         <td className="px-10 py-8 text-right">
                            <div className="flex items-center justify-end gap-3">
                               <button 
                                  onClick={() => handleToggleActive(p.id, p.is_active)}
                                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p.is_active ? 'bg-red-50 text-brand-pink hover:bg-brand-pink hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'} shadow-sm`}
                               >
                                  {p.is_active ? <Lock size={14} /> : <Unlock size={14} />}
                               </button>
                               <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-brand-black transition shadow-sm"><MoreVertical size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
