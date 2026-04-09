'use client';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, IndianRupee, 
  Settings, LogOut, Menu, X, Bell, 
  Building2, HelpCircle, CalendarDays
} from 'lucide-react';
import { signOut } from '@/lib/auth/supabase';
import { useAuth } from '@/lib/hooks';

const VENDOR_NAV = [
  { name: 'Dashboard',  href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Payments',   href: '/vendor/payments',   icon: IndianRupee },
  { name: 'Documents',  href: '/vendor/documents',  icon: FileText },
  { name: 'Meetings',   href: '/vendor/meetings',   icon: CalendarDays },
  { name: 'Support',    href: '/vendor/support',     icon: HelpCircle },
];

export default function VendorLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  
  const companyName = profile?.company_name || profile?.full_name || 'Vendor Portal';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (pathname?.includes('/login') || pathname?.includes('/register')) return <>{children}</>;

  return (
    <div className="flex h-screen bg-surface-soft text-brand-black overflow-hidden font-sans">
      
      {/* ── Sidebar — matches Admin design language ────────────────── */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`
              fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-black/[0.03] shadow-premium-lg flex flex-col
              lg:static lg:block transition-all
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Logo — same as admin */}
            <div className="h-20 flex items-center gap-4 px-6 border-b border-black/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-white shadow-premium-md flex items-center justify-center p-1.5 border border-black/[0.03] hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="CureVendAI" width={32} height={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-brand-black tracking-tighter">CureVendAI</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-blue">Vendor Portal</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5 custom-scrollbar">
              {VENDOR_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative
                      ${isActive ? 'bg-brand-black text-white shadow-premium-md' : 'text-gray-400 hover:text-brand-black'}`}>
                      <item.icon size={18} className={isActive ? 'text-brand-blue' : 'group-hover:text-brand-pink transition-colors'} />
                      <span className="text-xs font-black uppercase tracking-widest flex-1">{item.name}</span>
                      {isActive && <motion.div layoutId="vendor-active" className="w-1.5 h-1.5 rounded-full bg-brand-pink" />}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-black/[0.02]">
               <div className="p-4 rounded-3xl bg-surface-soft border border-black/[0.03] flex items-center gap-3 group hover:bg-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-pink flex items-center justify-center text-white font-black text-sm shadow-sm">
                     {companyName[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <p className="text-xs font-black text-brand-black truncate">{companyName}</p>
                     <p className="text-[9px] font-bold text-brand-blue uppercase tracking-widest">Vendor</p>
                  </div>
               </div>
               <button 
                  onClick={async () => { await signOut(); router.push('/vendor/login'); }}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-pink hover:bg-red-50/50 transition-all"
               >
                  <LogOut size={14} /> Sign Out
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-black/[0.03] flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 shadow-premium-sm">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2.5 rounded-2xl bg-surface-soft text-brand-black hover:bg-white transition shadow-sm"
              >
               {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="hidden lg:flex items-center gap-3">
                 <Building2 size={16} className="text-brand-blue" />
                 <span className="text-xs font-black text-brand-black uppercase tracking-[0.3em]">Vendor Portal</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="relative p-2.5 rounded-2xl bg-surface-soft text-brand-black hover:bg-white transition shadow-sm">
                 <Bell size={20} />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-pink ring-2 ring-white animate-pulse" />
              </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
           <AnimatePresence mode="wait">
              <motion.div key={pathname} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.2 }} className="max-w-[1600px] mx-auto">
                 {children}
              </motion.div>
           </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
