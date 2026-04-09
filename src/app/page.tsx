'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, X, ArrowRight, PlayCircle, TrendingUp
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden selection:bg-brand-blue/20">
      
      {/* ── Background Elements ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Soft flowing orbs — logo colors */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-brand-pink/5 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[10%] w-[45%] h-[45%] bg-brand-yellow/5 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
        
        {/* Fine grid pattern for premium feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 h-20 md:h-24">
        <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-black/[0.02] transition-colors cursor-pointer border border-transparent hover:border-black/[0.05]">
          <div className="w-10 h-10 rounded-xl bg-white shadow-premium-md flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
            <Image src="/logo.png" alt="CureVendAI Logo" width={32} height={32} priority />
          </div>
          <span className="text-xl font-black text-brand-black tracking-tighter">CureVendAI</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Solutions', 'Ecosystem', 'Case Studies', 'Insights'].map((link) => (
            <a key={link} href="#" className="text-sm font-bold text-gray-400 hover:text-brand-black transition-colors uppercase tracking-widest">{link}</a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/user/login" className="text-sm font-bold text-gray-500 hover:text-brand-black transition-colors">Sign In</Link>
          <Link href="/vendor/login" className="px-5 py-2.5 bg-brand-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black/90 transition-all shadow-premium-lg active:scale-95">Vendor Portal</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-brand-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 z-40 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 md:hidden shadow-xl"
          >
            {['Solutions', 'Ecosystem', 'Case Studies', 'Insights'].map((link) => (
              <a key={link} href="#" className="text-lg font-black text-brand-black uppercase tracking-widest">{link}</a>
            ))}
            <div className="h-px bg-gray-100 w-full" />
            <Link href="/user/login" className="text-lg font-black text-gray-500 uppercase tracking-widest">Sign In</Link>
            <Link href="/vendor/login" className="py-4 bg-brand-black text-white text-center font-black uppercase tracking-widest rounded-2xl">Vendor Portal</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 px-6 pt-12 md:pt-16 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.05] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
              Revolutionizing Vendor Management
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-black text-brand-black leading-tight mb-8 tracking-tighter lg:-ml-1"
            >
              Next Gen <br />
              <span className="text-gradient">Vendor</span> <br />
              Management.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-500 font-medium max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed"
            >
              Manage your vendors, track project budgets, process payments, 
              and schedule meetings — all from one intelligent platform.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
            >
              <Link href="/user/register" className="group relative px-8 py-4 bg-brand-black text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-premium-lg hover:shadow-glow-pink hover:scale-105 transition-all active:scale-95">
                Get Started
                <ArrowRight size={16} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white border border-gray-100 text-brand-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-premium-sm hover:bg-gray-50 transition-all flex items-center gap-3 active:scale-95">
                <PlayCircle size={20} className="text-brand-blue" />
                Live Demo
              </button>
            </motion.div>

            {/* Trusted by section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-20 pt-10 border-t border-black/[0.03]"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Trusted by teams at</p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all">
                {['Google', 'Microsoft', 'NVIDIA', 'Amazon'].map(brand => (
                  <span key={brand} className="text-lg font-black text-brand-black">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative aspect-square md:aspect-video rounded-[3rem] overflow-hidden glass border-white shadow-premium-lg transition-transform hover:scale-[1.02]"
            >
              {/* Dynamic Abstract Visual */}
              <div className="absolute inset-0 bg-white shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-12 flex flex-col justify-center gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ width: '0%', opacity: 0 }}
                      animate={{ width: `${60 + i * 10}%`, opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.2, duration: 1 }}
                      className={`h-4 rounded-full bg-gradient-to-r ${i === 1 ? 'from-brand-blue' : i === 2 ? 'from-brand-pink' : 'from-brand-yellow'} via-white/50 to-transparent shadow-premium-sm`}
                    />
                  ))}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="h-32 rounded-3xl bg-surface-soft border border-black/[0.02]" />
                    <div className="h-32 rounded-3xl bg-surface-soft border border-black/[0.02]" />
                  </div>
                </div>
              </div>
              
              {/* Floating KPI Cards on image */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/4 right-10 p-6 glass border-white shadow-premium-lg rounded-3xl"
              >
                <TrendingUp size={24} className="text-brand-pink mb-2" />
                <p className="text-2xl font-black text-brand-black leading-none mb-1">94.2%</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vendor Score</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="relative z-10 px-6 lg:px-12 py-10 border-t border-black/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">© 2026 CureVendAI. All Rights Reserved.</p>
        <div className="flex items-center gap-8">
           {['Privacy', 'Legal', 'Governance', 'Status'].map(item => (
             <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-black transition-colors">{item}</a>
           ))}
        </div>
      </footer>
    </div>
  );
}
