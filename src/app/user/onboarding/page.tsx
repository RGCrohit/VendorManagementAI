'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, Search, CheckCircle, XCircle, Eye, X,
  Building2, CreditCard, Shield, FileText, Clock,
} from 'lucide-react';

// ── Demo pending vendors ──────────────────────────────────────────────────────
const PENDING_VENDORS = [
  { id: '1', name: 'Omega Tech Pvt Ltd',   gst: '27HHHPT9012R8Z0', ifsc: 'HDFC0009012', bank: 'HDFC Bank',  acct: '50100099887766', submitted: '2026-04-01', email: 'ops@omega.tech', phone: '+91 99887 76655', cheque: true },
  { id: '2', name: 'Sigma Garments LLP',    gst: '19FFFPT1234P6Z4', ifsc: 'ICIC0001234', bank: 'ICICI Bank', acct: '40200033445566', submitted: '2026-03-28', email: 'admin@sigma.in', phone: '+91 88776 65544', cheque: true },
  { id: '3', name: 'Atlas Constructions',   gst: '07JJJPT5678S9Z3', ifsc: 'SBIN0005678', bank: 'SBI',        acct: '30300011223344', submitted: '2026-04-05', email: 'info@atlas.co', phone: '+91 77665 54433', cheque: false },
  { id: '4', name: 'Pinnacle IT Solutions', gst: '33KKKPT9012T1Z6', ifsc: 'AXIS0009012', bank: 'Axis Bank',  acct: '20400055667788', submitted: '2026-04-07', email: 'hr@pinnacle.dev', phone: '+91 66554 43322', cheque: true },
];

export default function OnboardingQueue() {
  const [vendors, setVendors] = useState(PENDING_VENDORS);
  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ vendor: typeof PENDING_VENDORS[0]; action: 'approve' | 'reject' } | null>(null);

  const filtered = vendors.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.gst.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = () => {
    if (!confirmModal) return;
    setVendors(prev => prev.filter(v => v.id !== confirmModal.vendor.id));
    setConfirmModal(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1400px] mx-auto">

      <div>
        <h1 className="text-2xl font-bold">Onboarding Queue</h1>
        <p className="text-sm text-gray-500">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} awaiting KYC verification</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or GST..."
          className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:border-primary-blue outline-none"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-medium">Company</th>
                <th className="px-5 py-3 text-left font-medium">GST Number</th>
                <th className="px-5 py-3 text-left font-medium">IFSC / Bank</th>
                <th className="px-5 py-3 text-left font-medium">Submitted</th>
                <th className="px-5 py-3 text-center font-medium">Cheque</th>
                <th className="px-5 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <motion.tr key={v.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-yellow-400">
                        {v.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-gray-600">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-300">{v.gst}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-300">{v.ifsc}</p>
                    <p className="text-xs text-gray-600">{v.bank} · ****{v.acct.slice(-4)}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{v.submitted}</td>
                  <td className="px-5 py-4 text-center">
                    {v.cheque ? (
                      <button className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition" title="Preview Cheque">
                        <Eye size={14} />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-600">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfirmModal({ vendor: v, action: 'approve' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => setConfirmModal({ vendor: v, action: 'reject' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-600">
                  {vendors.length === 0 ? '🎉 All vendors have been processed!' : 'No vendors match your search'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setConfirmModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
            >
              <div className="glass p-6 rounded-2xl border border-white/10 shadow-2xl text-center">
                <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  confirmModal.action === 'approve' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {confirmModal.action === 'approve'
                    ? <CheckCircle size={28} className="text-green-400" />
                    : <XCircle size={28} className="text-red-400" />
                  }
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {confirmModal.action === 'approve' ? 'Approve Vendor?' : 'Reject Vendor?'}
                </h3>
                <p className="text-sm text-gray-400 mb-5">
                  {confirmModal.action === 'approve'
                    ? `This will activate ${confirmModal.vendor.name} and grant them platform access.`
                    : `This will reject ${confirmModal.vendor.name}'s application. They will be notified.`
                  }
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal(null)}
                    className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button onClick={handleAction}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                      confirmModal.action === 'approve'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-glow'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-glow'
                    }`}
                  >
                    {confirmModal.action === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
