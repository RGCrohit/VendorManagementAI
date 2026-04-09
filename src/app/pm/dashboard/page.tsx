'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

export default function PMDashboard() {
  const { user, loading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const kpis = [
    { label: 'Active Vendors', value: '24', icon: Users, color: 'blue' },
    { label: 'Open Projects', value: '8', icon: BarChart3, color: 'purple' },
    { label: 'Pending Invoices', value: '12', icon: FileText, color: 'green' },
    { label: 'Budget Used', value: '68%', icon: TrendingUp, color: 'orange' },
  ];

  const recentActivity = [
    { type: 'vendor_onboarded', message: 'Acme Supplies onboarded to Project Phoenix', time: '2 hours ago' },
    { type: 'invoice_submitted', message: 'Invoice INV-2026-001 submitted for review', time: '4 hours ago' },
    { type: 'tat_breach', message: 'TAT breach alert: Supplier X - Delivery milestone', time: '6 hours ago' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-primary-blue animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent">
              ProcurAI Dashboard
            </h1>
            <p className="text-sm text-gray-400">Welcome, {user?.full_name || 'Project Manager'}</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary-blue/10 border border-primary-blue/20 hover:bg-primary-blue/20 transition">
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-primary-blue" />
            Key Metrics
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-xl hover:glass-darker transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-400">{kpi.label}</h3>
                    <div className={`p-2 rounded-lg ${
                      kpi.color === 'blue' ? 'bg-blue-500/10' :
                      kpi.color === 'purple' ? 'bg-purple-500/10' :
                      kpi.color === 'green' ? 'bg-green-500/10' :
                      'bg-orange-500/10'
                    }`}>
                      <Icon size={20} className={
                        kpi.color === 'blue' ? 'text-blue-400' :
                        kpi.color === 'purple' ? 'text-purple-400' :
                        kpi.color === 'green' ? 'text-green-400' :
                        'text-orange-400'
                      } />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">{kpi.value}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Spend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-blue" />
              Monthly Spend by Vendor Category
            </h3>
            <div className="space-y-4">
              {['IT Vendors', 'Garment Suppliers', 'Heavy Industry', 'Creative Agencies'].map((category, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{category}</span>
                    <span className="text-sm font-semibold">₹{(Math.random() * 100 + 20).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-blue to-primary-violet h-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vendor Risk Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-primary-blue" />
              Vendor Risk Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm">Low Risk</span>
                </span>
                <span className="text-sm font-semibold">16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">Medium Risk</span>
                </span>
                <span className="text-sm font-semibold">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm">High Risk</span>
                </span>
                <span className="text-sm font-semibold">2</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary-blue mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
