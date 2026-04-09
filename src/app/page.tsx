'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-navy/80 border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent">
            ProcurAI
          </div>
          
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex gap-8 items-center">
            <Link href="/pm/login" className="hover:text-primary-blue transition">PM Login</Link>
            <Link href="/vendor/login" className="hover:text-primary-blue transition">Vendor Portal</Link>
            <Link href="#pricing" className="hover:text-primary-blue transition">Pricing</Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-darker border-t">
            <div className="px-4 py-4 space-y-4">
              <Link href="/pm/login" className="block hover:text-primary-blue">PM Login</Link>
              <Link href="/vendor/login" className="block hover:text-primary-blue">Vendor Portal</Link>
              <Link href="#pricing" className="block hover:text-primary-blue">Pricing</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-blue via-purple-400 to-primary-violet bg-clip-text text-transparent leading-tight"
          >
            AI-Powered Vendor & Project Management
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Procurement intelligence from onboarding to payment — powered by AI agents, voice commands, and real-time analytics.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/pm/login"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary-blue to-primary-violet hover:shadow-glow transition-all font-semibold"
            >
              PM Login
            </Link>
            <Link
              href="/vendor/login"
              className="px-8 py-4 rounded-lg glass hover:glass-darker transition-all font-semibold"
            >
              Vendor Portal
            </Link>
          </motion.div>

          {/* Animated glassmorphism card */}
          <motion.div
            variants={itemVariants}
            className="mt-16 relative"
            style={{
              y: scrollY * 0.1,
            }}
          >
            <div className="glass p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-blue">AI Voice</div>
                  <div className="text-sm text-gray-400">Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-blue">OCR</div>
                  <div className="text-sm text-gray-400">Pipeline</div>
                </div>
                <div className="text-center hidden md:block">
                  <div className="text-3xl font-bold text-primary-blue">Multi</div>
                  <div className="text-sm text-gray-400">Role</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-violet">Real-time</div>
                  <div className="text-sm text-gray-400">TAT</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-violet">Budget</div>
                  <div className="text-sm text-gray-400">Tracking</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-violet">Razorpay</div>
                  <div className="text-sm text-gray-400">Payments</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent"
        >
          Key Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'AI Voice Agent', description: 'Voice-controlled procurement intelligence' },
            { title: 'OCR Invoicing', description: 'Automatic invoice data extraction' },
            { title: 'Multi-Role Access', description: 'Role-based permissions and workflows' },
            { title: 'Real-time TAT', description: 'Live milestone tracking and alerts' },
            { title: 'Budget Control', description: 'Indian FY tracking with alerts' },
            { title: 'Razorpay Integration', description: 'Seamless payment processing' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-xl hover:glass-darker transition-all"
            >
              <h3 className="text-xl font-semibold mb-2 text-primary-blue">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent"
        >
          Pricing
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="glass p-8 md:p-12 text-center rounded-xl"
        >
          <h3 className="text-3xl font-bold mb-4">Start Free</h3>
          <p className="text-xl text-gray-300 mb-6">Zero infrastructure cost. Scale-to-pay as you grow.</p>
          <div className="text-4xl font-bold text-primary-blue mb-4">$0/month</div>
          <p className="text-gray-400">Free tier includes: 500MB database, OCR pipeline, AI agents, voice features</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2026 ProcurAI. Built for scale, starting free.</p>
        </div>
      </footer>
    </div>
  );
}
