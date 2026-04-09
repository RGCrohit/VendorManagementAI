'use client';

import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

export default function VendorPortal() {
  const { user, loading } = useAuth();

  const projects = [
    {
      id: 1,
      name: 'Project Phoenix',
      status: 'active',
      pm: 'Rajesh Kumar',
      timeline: '45 days',
      tat_status: 'on_track',
    },
    {
      id: 2,
      name: 'Enterprise Suite Build',
      status: 'active',
      pm: 'Priya Sharma',
      timeline: '60 days',
      tat_status: 'at_risk',
    },
  ];

  const invoices = [
    { id: 'INV-001', amount: '₹45,000', status: 'paid', date: '2026-04-01' },
    { id: 'INV-002', amount: '₹32,500', status: 'pending', date: '2026-04-05' },
    { id: 'INV-003', amount: '₹58,200', status: 'pm_approved', date: '2026-04-08' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-primary-blue animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portal...</p>
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
              Vendor Portal
            </h1>
            <p className="text-sm text-gray-400">{user?.full_name || 'Vendor'}</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary-blue/10 border border-primary-blue/20 hover:bg-primary-blue/20 transition">
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-xl hover:glass-darker transition-all"
              >
                <h3 className="text-lg font-semibold mb-4">{project.name}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">PM</span>
                    <span className="font-medium">{project.pm}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Timeline</span>
                    <span className="font-medium">{project.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">TAT Status</span>
                    <div className="flex items-center gap-2">
                      {project.tat_status === 'on_track' ? (
                        <>
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400">On Track</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-yellow-400" />
                          <span className="text-yellow-400">At Risk</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg bg-primary-blue/10 border border-primary-blue/20 hover:bg-primary-blue/20 transition text-sm font-medium">
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Invoices */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Invoices</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Invoice ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-sm flex items-center gap-2">
                        <FileText size={16} className="text-primary-blue" />
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{invoice.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                          invoice.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {invoice.status === 'paid' ? 'Paid' :
                           invoice.status === 'pending' ? 'Pending' :
                           'PM Approved'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
