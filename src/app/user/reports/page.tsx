'use client';

import { motion } from 'framer-motion';
import { 
  Network, Briefcase, Zap, Download, 
  Building2, Users, Shield, Award, Globe, User
} from 'lucide-react';
import Image from 'next/image';

const PM_NODE = {
  role: 'L3: PROJECT MANAGER',
  name: 'Rohit Ghosh Chowdhury',
  avatar: 'https://ui-avatars.com/api/?name=Rohit+Ghosh+Chowdhury&background=3395FF&color=fff',
  projects: ['Project Phoenix', 'Enterprise Suite', 'Supply Chain AI'],
  vendors: 142
};

const LEADERS = [
  { role: 'L1: SCRUM MASTER', name: 'Arjun Sharma', color: 'bg-brand-black', avatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=000&color=fff' },
  { role: 'L2: HPM', name: 'Priya Patel', color: 'bg-brand-pink', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=FF3366&color=fff' }
];

export default function ReportingPage() {
  return (
    <div className="space-y-8 animate-slide-in pb-10 max-h-screen">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-black tracking-tighter">ORG View (L3)</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Strategic Hierarchy • Fit HQ Governance</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
              <Shield size={14} /> Full Ledger Sync
           </div>
           <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-black transition shadow-sm">
              <Download size={18} />
           </button>
        </div>
      </div>

      {/* One-Page Compressed Node Chart */}
      <div className="glass p-8 bg-white/60 border-white shadow-premium-xl rounded-[3rem] overflow-hidden flex flex-col items-center justify-center relative min-h-[500px]">
        
        {/* Background Connector Orbs */}
        <div className="absolute inset-0 z-0 opacity-10 blur-[80px]">
           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand-blue rounded-full" />
           <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand-pink rounded-full" />
        </div>

        {/* Global Node Structure */}
        <div className="relative z-10 w-full max-w-5xl">
           
           {/* Top Leaders Row */}
           <div className="flex items-center justify-center gap-20 mb-16 relative">
              {/* Connector line between leaders */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gray-100" />
              
              {LEADERS.map((leader, i) => (
                <motion.div 
                  key={leader.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center group"
                >
                   <div className={`w-16 h-16 rounded-2xl ${leader.color} p-0.5 shadow-premium-lg mb-3 relative overflow-hidden group-hover:scale-110 transition-transform`}>
                      <div className="w-full h-full rounded-[0.9rem] bg-white overflow-hidden relative">
                         <Image src={leader.avatar} alt={leader.name} fill className="object-cover" />
                      </div>
                   </div>
                   <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{leader.role}</h3>
                   <p className="text-xs font-black text-brand-black">{leader.name}</p>
                </motion.div>
              ))}
           </div>

           {/* Central Hub Connector */}
           <div className="flex justify-center mb-8">
              <div className="w-px h-12 bg-gradient-to-b from-gray-100 to-brand-blue" />
           </div>

           {/* Rohit PM Hub (L3) */}
           <div className="flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 bg-white/80 border-white shadow-premium-xl rounded-[2.5rem] w-full max-w-3xl relative overflow-hidden group"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Network size={120} className="text-brand-blue" />
                 </div>
                 
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand-blue to-brand-pink p-1 shadow-premium-lg">
                       <div className="w-full h-full rounded-[1.8rem] bg-white overflow-hidden">
                          <Image src={PM_NODE.avatar} alt={PM_NODE.name} width={100} height={100} className="object-cover" />
                       </div>
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">{PM_NODE.role}</h3>
                          <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[8px] font-black rounded-lg">PRIMARY NODE</span>
                       </div>
                       <p className="text-3xl font-black text-brand-black tracking-tighter mb-4">{PM_NODE.name}</p>
                       
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                             <Users size={14} className="text-brand-pink" />
                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{PM_NODE.vendors} Active Vendors</span>
                          </div>
                          <div className="w-px h-4 bg-gray-100" />
                          <div className="flex items-center gap-2">
                             <Briefcase size={14} className="text-brand-yellow" />
                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{PM_NODE.projects.length} Governance Nodes</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Active Project Nodes Under PM */}
                 <div className="mt-8 pt-8 border-t border-black/[0.03] grid grid-cols-3 gap-4">
                    {PM_NODE.projects.map((proj, i) => (
                      <motion.div 
                        key={proj}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="p-4 bg-surface-soft rounded-2xl border border-transparent hover:border-brand-blue/20 hover:bg-white transition-all group flex items-center gap-3"
                      >
                         <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-brand-blue shadow-sm border border-black/[0.02]">
                            <Award size={16} />
                         </div>
                         <p className="text-[9px] font-black text-brand-black uppercase tracking-widest group-hover:text-brand-blue transition">{proj}</p>
                      </motion.div>
                    ))}
                 </div>
              </motion.div>
           </div>
        </div>
      </div>

      {/* Snapshot Stats */}
      <div className="grid grid-cols-3 gap-6">
         <div className="glass p-6 bg-white border-white shadow-premium-lg rounded-[2rem] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center"><Network size={20} /></div>
            <div>
               <p className="text-lg font-black text-brand-black">Global Node</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Status</p>
            </div>
         </div>
         <div className="glass p-6 bg-white border-white shadow-premium-lg rounded-[2rem] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-pink/5 text-brand-pink flex items-center justify-center"><Shield size={20} /></div>
            <div>
               <p className="text-lg font-black text-brand-black">Audit Ready</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Compliance Validated</p>
            </div>
         </div>
         <div className="glass p-6 bg-white border-white shadow-premium-lg rounded-[2rem] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-yellow/5 text-brand-yellow flex items-center justify-center"><Globe size={20} /></div>
            <div>
               <p className="text-lg font-black text-brand-black">Enterprise</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">L3 Hierarchy Active</p>
            </div>
         </div>
      </div>
    </div>
  );
}
