'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ArrowLeft, CheckCircle, XCircle, CreditCard,
  Eye, Filter, Search, X, ExternalLink, Download,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type InvoiceStatus = 'submitted' | 'pm_approved' | 'paid' | 'rejected';

const statusConfig: Record<InvoiceStatus, { label: string; cls: string }> = {
  submitted:   { label: 'Awaiting Review', cls: 'bg-yellow-500/10 text-yellow-400' },
  pm_approved: { label: 'PM Approved',     cls: 'bg-blue-500/10 text-blue-400' },
  paid:        { label: 'Paid',            cls: 'bg-green-500/10 text-green-400' },
  rejected:    { label: 'Rejected',        cls: 'bg-red-500/10 text-red-400' },
};

// ── Demo invoices ─────────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV-2026-042', vendor: 'Acme Corp',        project: 'Project Phoenix',  amount: '₹3,45,000', due: '2026-04-15', submitted: '2026-04-02', status: 'submitted'   as InvoiceStatus, items: ['Server rack setup - ₹2,10,000', 'Cabling work - ₹85,000', 'License fees - ₹50,000'] },
  { id: 'INV-2026-041', vendor: 'Nova Industries',   project: 'Enterprise Suite', amount: '₹8,72,500', due: '2026-04-20', submitted: '2026-04-01', status: 'submitted'   as InvoiceStatus, items: ['Raw materials batch #12 - ₹5,50,000', 'QC inspection - ₹1,22,500', 'Transport - ₹2,00,000'] },
  { id: 'INV-2026-040', vendor: 'Zenith Textiles',   project: 'Retail Platform',  amount: '₹1,15,000', due: '2026-04-10', submitted: '2026-03-28', status: 'pm_approved' as InvoiceStatus, items: ['Fabric samples lot - ₹75,000', 'Sewing labor - ₹40,000'] },
  { id: 'INV-2026-039', vendor: 'Prime Solutions',   project: 'Supply Chain AI',  amount: '₹5,60,000', due: '2026-04-12', submitted: '2026-03-25', status: 'pm_approved' as InvoiceStatus, items: ['AI model development - ₹3,80,000', 'Cloud infra (3 months) - ₹1,80,000'] },
  { id: 'INV-2026-038', vendor: 'Delta Exports',     project: 'Data Migration',   amount: '₹2,30,000', due: '2026-03-30', submitted: '2026-03-20', status: 'paid'        as InvoiceStatus, items: ['ETL pipeline setup - ₹1,50,000', 'Data validation - ₹80,000'] },
  { id: 'INV-2026-037', vendor: 'Apex Logistics',    project: 'Project Phoenix',  amount: '₹4,10,000', due: '2026-03-25', submitted: '2026-03-15', status: 'rejected'    as InvoiceStatus, items: ['Transport charges - ₹4,10,000'] },
];

export default function InvoiceQueue() {
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof INVOICES[0] | null>(null);

  const filtered = INVOICES.filter(inv => {
    if (filter !== 'all' && inv.status !== filter) return false;
    if (search && !inv.vendor.toLowerCase().includes(search.toLowerCase()) && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1400px] mx-auto">

      {/* Back + Header */}
      <Link href="/user/finance" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Finance
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoice Queue</h1>
          <p className="text-sm text-gray-500">{INVOICES.length} invoices · {INVOICES.filter(i => i.status === 'submitted').length} awaiting review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          {(['all', 'submitted', 'pm_approved', 'paid', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${filter === s ? 'bg-primary-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              {s === 'all' ? 'All' : statusConfig[s as InvoiceStatus].label}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search vendor or invoice..."
            className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:border-primary-blue outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-medium">Invoice</th>
                <th className="px-5 py-3 text-left font-medium">Vendor</th>
                <th className="px-5 py-3 text-left font-medium">Project</th>
                <th className="px-5 py-3 text-left font-medium">Amount</th>
                <th className="px-5 py-3 text-left font-medium">Due Date</th>
                <th className="px-5 py-3 text-left font-medium">Submitted</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => {
                const st = statusConfig[inv.status];
                return (
                  <motion.tr key={inv.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-primary-blue">{inv.id}</td>
                    <td className="px-5 py-4 font-medium">{inv.vendor}</td>
                    <td className="px-5 py-4 text-gray-400">{inv.project}</td>
                    <td className="px-5 py-4 font-semibold">{inv.amount}</td>
                    <td className="px-5 py-4 text-xs text-gray-400">{inv.due}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{inv.submitted}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-white/10 transition" title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {inv.status === 'submitted' && (
                          <>
                            <button className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs hover:bg-green-500/20 transition">
                              <CheckCircle size={11} /> Approve
                            </button>
                            <button className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20 transition">
                              <XCircle size={11} /> Reject
                            </button>
                          </>
                        )}
                        {inv.status === 'pm_approved' && (
                          <button className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs hover:bg-blue-500/20 transition">
                            <CreditCard size={11} /> Pay via Razorpay
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-600">No invoices match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invoice Detail Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {selectedInvoice && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSelectedInvoice(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-lg"
            >
              <div className="glass p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold">{selectedInvoice.id}</h2>
                  <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition"><X size={18} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                  <div><p className="text-xs text-gray-500">Vendor</p><p className="font-medium">{selectedInvoice.vendor}</p></div>
                  <div><p className="text-xs text-gray-500">Project</p><p className="font-medium">{selectedInvoice.project}</p></div>
                  <div><p className="text-xs text-gray-500">Amount</p><p className="font-bold text-lg text-primary-blue">{selectedInvoice.amount}</p></div>
                  <div><p className="text-xs text-gray-500">Due Date</p><p className="font-medium">{selectedInvoice.due}</p></div>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-gray-500 mb-2">OCR-Extracted Line Items</p>
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    {selectedInvoice.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                        <span className="text-gray-300">{item.split(' - ')[0]}</span>
                        <span className="font-semibold text-white">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition">
                    <Download size={14} /> Download PDF
                  </button>
                  {selectedInvoice.status === 'submitted' && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-sm font-semibold hover:shadow-glow transition">
                      <CheckCircle size={14} /> Approve Invoice
                    </button>
                  )}
                  {selectedInvoice.status === 'pm_approved' && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-blue to-primary-violet rounded-lg text-sm font-semibold hover:shadow-glow transition">
                      <CreditCard size={14} /> Pay via Razorpay
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
