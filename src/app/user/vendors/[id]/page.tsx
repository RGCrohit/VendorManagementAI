'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, ArrowLeft, CheckCircle, AlertCircle, Clock,
  Shield, FileText, FolderKanban, TrendingUp, CreditCard,
  BadgeCheck, Ban, Link2, ExternalLink, Mail, Phone, Globe,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Demo vendor data ──────────────────────────────────────────────────────────
const VENDOR_DB: Record<string, {
  name: string; type: string; status: string; risk: string; score: number;
  gst: string; ifsc: string; bank_name: string; bank_account: string; pan: string;
  email: string; phone: string; website: string; joined: string; ai_notes: string;
}> = {
  '1': { name: 'Acme Corp',         type: 'IT Services',   status: 'active', risk: 'low',    score: 85, gst: '27AAPCT1234H1Z5', ifsc: 'HDFC0001234', bank_name: 'HDFC Bank', bank_account: '50100012345678', pan: 'AAPCT1234H', email: 'contact@acme.co', phone: '+91 98765 43210', website: 'acme.co', joined: '2025-06-15', ai_notes: 'Consistent delivery. Low risk vendor with strong compliance history.' },
  '2': { name: 'Nova Industries',    type: 'Manufacturing', status: 'active', risk: 'low',    score: 92, gst: '29BBBPT5678K2Z8', ifsc: 'ICIC0005678', bank_name: 'ICICI Bank', bank_account: '40200098765432', pan: 'BBBPT5678K', email: 'ops@nova.in', phone: '+91 98765 11111', website: 'nova.in', joined: '2025-08-01', ai_notes: 'Highest rated vendor. Zero TAT breaches across 12 months.' },
  '3': { name: 'Zenith Textiles',    type: 'Garments',      status: 'active', risk: 'medium', score: 58, gst: '07CCCPT9012L3Z1', ifsc: 'SBIN0009012', bank_name: 'SBI',       bank_account: '30300056789012', pan: 'CCCPT9012L', email: 'sales@zenith.in', phone: '+91 98765 22222', website: 'zenith.in', joined: '2025-09-20', ai_notes: 'Moderate risk. 2 TAT breaches in last quarter. Quality issues flagged.' },
  '4': { name: 'Apex Logistics',     type: 'Logistics',     status: 'suspended', risk: 'high', score: 28, gst: '06DDDPT3456M4Z9', ifsc: 'AXIS0003456', bank_name: 'Axis Bank', bank_account: '20400034567890', pan: 'DDDPT3456M', email: 'admin@apex.co', phone: '+91 98765 33333', website: 'apex.co', joined: '2025-03-10', ai_notes: 'SUSPENDED: Multiple compliance failures. 5 TAT breaches. Under review.' },
  '5': { name: 'Prime Solutions',    type: 'IT Services',   status: 'active', risk: 'low',    score: 78, gst: '33EEEPT7890N5Z2', ifsc: 'KOTAK0007890', bank_name: 'Kotak Bank', bank_account: '10500012340000', pan: 'EEEPT7890N', email: 'info@prime.dev', phone: '+91 98765 44444', website: 'prime.dev', joined: '2025-11-05', ai_notes: 'Reliable IT vendor. Strong project delivery record.' },
};

const RISK_HISTORY = [
  { month: 'Jun', score: 82 },
  { month: 'Jul', score: 78 },
  { month: 'Aug', score: 75 },
  { month: 'Sep', score: 70 },
  { month: 'Oct', score: 65 },
  { month: 'Nov', score: 68 },
  { month: 'Dec', score: 72 },
  { month: 'Jan', score: 78 },
  { month: 'Feb', score: 80 },
  { month: 'Mar', score: 85 },
];

const statusBadge: Record<string, { label: string; cls: string }> = {
  active:    { label: 'Active',    cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  pending:   { label: 'Pending',   cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  suspended: { label: 'Suspended', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const riskBadge: Record<string, { cls: string }> = {
  low:    { cls: 'text-green-400' },
  medium: { cls: 'text-yellow-400' },
  high:   { cls: 'text-red-400' },
};

type TabId = 'overview' | 'documents' | 'projects' | 'invoices' | 'risk';

export default function VendorDetail() {
  const params = useParams();
  const id = params?.id as string;
  const vendor = VENDOR_DB[id];
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!vendor) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Vendor not found</p>
        <Link href="/user/vendors" className="text-primary-blue text-sm hover:underline mt-2 inline-block">← Back to vendors</Link>
      </div>
    );
  }

  const st = statusBadge[vendor.status] ?? statusBadge.pending;
  const initials = vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  const TABS: { id: TabId; label: string }[] = [
    { id: 'overview',  label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'projects',  label: 'Projects' },
    { id: 'invoices',  label: 'Invoices' },
    { id: 'risk',      label: 'Risk History' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-[1200px] mx-auto">
      {/* Back */}
      <Link href="/user/vendors" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Vendors
      </Link>

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-blue/30 to-primary-violet/30 flex items-center justify-center text-xl font-bold text-primary-blue flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${st.cls}`}>{st.label}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
            <span className="flex items-center gap-1"><Building2 size={12} /> {vendor.type}</span>
            <span className="flex items-center gap-1"><Mail size={12} /> {vendor.email}</span>
            <span className="flex items-center gap-1"><Phone size={12} /> {vendor.phone}</span>
            <span className="flex items-center gap-1"><Globe size={12} /> {vendor.website}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition">
            <BadgeCheck size={14} /> Approve KYC
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition">
            <Ban size={14} /> Suspend
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary-blue/10 text-primary-blue rounded-lg text-xs font-medium hover:bg-primary-blue/20 transition">
            <Link2 size={14} /> Link Project
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ───────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
          {/* KYC Details */}
          <div className="glass p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Shield size={16} className="text-primary-blue" /> KYC & Banking</h3>
            {[
              { label: 'GST Number',      value: vendor.gst },
              { label: 'PAN Number',       value: vendor.pan },
              { label: 'Bank Name',        value: vendor.bank_name },
              { label: 'Account Number',   value: vendor.bank_account },
              { label: 'IFSC Code',        value: vendor.ifsc },
              { label: 'Company Type',     value: vendor.type },
              { label: 'Onboarding Date',  value: vendor.joined },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-sm font-medium font-mono">{item.value}</span>
              </div>
            ))}
          </div>

          {/* AI Notes */}
          <div className="glass p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><TrendingUp size={16} className="text-primary-blue" /> AI Assessment</h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl font-bold text-primary-blue">{vendor.score}</span>
              <div>
                <p className={`text-sm font-semibold ${riskBadge[vendor.risk]?.cls}`}>{vendor.risk.toUpperCase()} RISK</p>
                <p className="text-xs text-gray-500">Compliance Score</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-sm text-gray-300 leading-relaxed">
              💡 {vendor.ai_notes}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Risk History Tab ───────────────────────────────────────────── */}
      {activeTab === 'risk' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-5">
          <h3 className="font-semibold mb-4">Risk Score Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RISK_HISTORY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ── Other Tabs (placeholder) ───────────────────────────────────── */}
      {['documents', 'projects', 'invoices'].includes(activeTab) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 text-center">
          <FileText size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} will appear here when connected to the backend</p>
        </motion.div>
      )}
    </div>
  );
}
