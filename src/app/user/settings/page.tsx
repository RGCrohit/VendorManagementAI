'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, Camera, 
  Save, CheckCircle, X, ChevronRight,
  Database, Zap, Key
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks';

export default function SettingsPage() {
  const { profile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const fullName = profile?.full_name || 'Rohit Ghosh Chowdhury';
  const role = profile?.role || 'PROJECT_MANAGER';

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slide-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-black tracking-tighter mb-2">Command Center</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Personal preferences & governance configuration</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-8 py-3.5 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium-lg hover:shadow-glow-pink transition-all active:scale-95"
        >
          <Save size={18} /> Update Vault
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-between text-green-600 mb-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Configuration synced to back-end ledger</span>
            </div>
            <button onClick={() => setSuccess(false)}><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs */}
        <div className="space-y-2">
           {[
             { id: 'profile', label: 'Identity', icon: User },
             { id: 'security', label: 'Governance', icon: Shield },
             { id: 'notifications', label: 'Alert Signals', icon: Bell },
             { id: 'back-end', label: 'Supabase Sync', icon: Database },
           ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-brand-black text-white shadow-premium-lg' 
                    : 'text-gray-400 hover:text-brand-black hover:bg-surface-soft'
                }`}
             >
                <tab.icon size={18} />
                {tab.label}
             </button>
           ))}
        </div>

        {/* Dynamic Panel */}
        <div className="lg:col-span-3">
           <div className="glass p-10 bg-white border-white shadow-premium-xl rounded-[3rem]">
              
              {activeTab === 'profile' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex flex-col md:flex-row items-center gap-10 border-b border-black/[0.03] pb-10">
                      <div className="relative group">
                         <div className="w-32 h-32 rounded-full ring-4 ring-brand-blue/10 overflow-hidden shadow-premium-lg relative">
                            <Image 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&size=256`} 
                              alt="Profile" 
                              fill 
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                               <Camera size={32} className="text-white" />
                            </div>
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-black/[0.03] shadow-premium-md rounded-2xl flex items-center justify-center text-brand-pink">
                            <Zap size={20} />
                         </div>
                      </div>
                      <div className="text-center md:text-left">
                         <h3 className="text-2xl font-black text-brand-black tracking-tight">{fullName}</h3>
                         <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mt-1">Status: Governance Officer</p>
                         <p className="text-xs text-gray-400 mt-2 font-medium">Node ID: CB-992-ROH</p>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Identity</label>
                         <input type="text" defaultValue={fullName} className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Audit Alias</label>
                         <input type="text" defaultValue="Sector-Commander" className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Secure Email Address</label>
                         <input type="email" defaultValue={profile?.email || 'rohit@curevend.ai'} className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Node Hierarchy</label>
                         <select className="w-full px-6 py-4 bg-surface-soft border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition appearance-none">
                            <option>{role}</option>
                            <option>HEAD_PROJECT_MANAGER</option>
                            <option>SCRUM_MASTER</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'back-end' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                   <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-6">
                      <Database size={40} className="text-brand-blue" />
                      <div>
                         <h4 className="text-lg font-black text-brand-black tracking-tight mb-2">Supabase Sync Hub</h4>
                         <p className="text-xs font-medium text-blue-600/80 leading-relaxed uppercase tracking-tighter">Manage data pipelines, migration scripts, and front-end state synchronization. You have 14.2MB of cached audit history.</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-6 bg-surface-soft hover:bg-white border border-transparent hover:border-black/[0.03] rounded-[2rem] transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-pink shadow-sm">
                               <Zap size={20} />
                            </div>
                            <div className="text-left">
                               <p className="text-xs font-black text-brand-black">Trigger Data Re-index</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Update 6-month historical demo cache</p>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-black" />
                      </button>

                      <button className="w-full flex items-center justify-between p-6 bg-surface-soft hover:bg-white border border-transparent hover:border-black/[0.03] rounded-[2rem] transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-blue shadow-sm">
                               <Key size={20} />
                            </div>
                            <div className="text-left">
                               <p className="text-xs font-black text-brand-black">Project Vault Keys</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Manage public/private API access tokens</p>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-black" />
                      </button>
                   </div>
                </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
}
