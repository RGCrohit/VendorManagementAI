'use client';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, IndianRupee, 
  Settings, LogOut, Menu, X, Shield, Bell, CheckCircle, 
  User, Building2, UploadCloud, HelpCircle
} from 'lucide-react';
import { signOut } from '@/lib/auth/supabase';
import { useAuth } from '@/lib/hooks';

const VENDOR_NAV = [
  { name: 'Dashboard',   href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'My Invoices', href: '/vendor/invoices',  icon: IndianRupee },
  { name: 'Compliance',  href: '/vendor/compliance', icon: Shield },
  { name: 'Documents',   href: '/vendor/documents',  icon: FileText },
];

export default function VendorLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  
  const companyName = profile?.company_name || 'Apex Global Solutions';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (pathname?.includes('/login') || pathname?.includes('/register')) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 text-brand-black overflow-hidden font-sans">
      
      {/* ── Vendor Sidebar ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`
              fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl flex flex-col
              lg:static lg:block transition-all
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Header */}
            <div className="h-24 flex items-center gap-4 px-8 border-b border-slate-100 bg-slate-50/30">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center p-2 shadow-lg shadow-brand-blue/20">
                <Image src="/logo.png" alt="CureVendAI" width={36} height={36} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-brand-black tracking-tighter">CureVend</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue">Partner Hub</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-6 py-10 space-y-2 custom-scrollbar">
              {VENDOR_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span className={`
                      flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group
                      ${isActive 
                        ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' 
                        : 'text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5'}
                    `}>
                      <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-brand-blue transition-colors'} />
                      <span className="text-xs font-black uppercase tracking-widest flex-1">{item.name}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100">
               <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-200 flex items-center gap-4 mb-6 group cursor-pointer hover:bg-white transition-all shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black text-sm">
                     {companyName[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <p className="text-xs font-black text-brand-black truncate">{companyName}</p>
                     <p className="text-[9px] font-bold text-brand-blue uppercase tracking-tighter">Verified Partner</p>
                  </div>
               </div>
               <button 
                  onClick={async () => { await signOut(); router.push('/vendor/login'); }}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-pink transition-colors flex items-center justify-center gap-2"
               >
                  <LogOut size={16} /> Disconnect
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-30 sticky top-0 shadow-sm">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-3 rounded-2xl bg-slate-50 text-slate-600 shadow-sm border border-slate-100 transition hover:bg-white"
              >
                 {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-3">
                 <Building2 size={20} className="text-brand-blue" />
                 <span className="text-sm font-black text-slate-800 uppercase tracking-widest hidden md:block">External Vendor Ecosystem</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 px-6 py-3 bg-brand-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-brand-blue/20 transition-all active:scale-95">
                 <UploadCloud size={18} /> Submit Invoice
              </button>
              <div className="w-px h-8 bg-slate-100 mx-2" />
              <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 hover:text-brand-blue hover:bg-white transition shadow-sm relative">
                 <Bell size={20} />
                 <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-pink border-2 border-white" />
              </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-slate-50/30">
           <AnimatePresence mode="wait">
              <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-[1400px] mx-auto">
                 {children}
              </motion.div>
           </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
