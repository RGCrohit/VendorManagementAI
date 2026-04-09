'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, checkUserActiveStatus } from '@/lib/auth/supabase';
import { Activity, Shield, LogOut, CheckCircle, XCircle, ChevronDown, Building2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Profile = {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  gst_number?: string;
  pan_number?: string;
  bank_account?: string;
  bank_name?: string;
  ifsc_code?: string;
  aadhar_number?: string;
};

const USER_ROLES = [
  { value: 'PENDING', label: 'Pending Access' },
  { value: 'VENDOR', label: 'Vendor' },
  { value: 'JUNIOR_PROJECT_MANAGER', label: 'Junior Project Manager' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'HEAD_PROJECT_MANAGER', label: 'Head Project Manager' },
  { value: 'SCRUM_MASTER', label: 'Scrum Master' },
];





function VendorKYCDrawer({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  if (!profile.gst_number && !profile.pan_number) return <span className="text-gray-600 text-xs">—</span>;
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-primary-blue hover:underline">
        View KYC <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-xs space-y-1 text-gray-300 overflow-hidden">
            {profile.gst_number && <p><span className="text-gray-500">GST:</span> {profile.gst_number}</p>}
            {profile.pan_number && <p><span className="text-gray-500">PAN:</span> {profile.pan_number}</p>}
            {profile.bank_name && <p><span className="text-gray-500">Bank:</span> {profile.bank_name}</p>}
            {profile.bank_account && <p><span className="text-gray-500">Account:</span> ****{profile.bank_account.slice(-4)}</p>}
            {profile.ifsc_code && <p><span className="text-gray-500">IFSC:</span> {profile.ifsc_code}</p>}
            {profile.aadhar_number && <p><span className="text-gray-500">Aadhar:</span> ****{profile.aadhar_number.slice(-4)}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ScrumMasterDashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VENDOR' | 'USER' | 'PENDING'>('ALL');

  useEffect(() => {
    const fetchAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      
      const userProfile = await checkUserActiveStatus(session.user.id);
      if (userProfile.role !== 'SCRUM_MASTER') {
        router.push('/unauthorized');
        return;
      }
      
      fetchProfiles();
    };
    
    fetchAuth();
  }, [router]);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(error);
      setError('Failed to load profiles');
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', id);
      
    if (error) {
      alert('Error updating status');
    } else {
      setProfiles(profiles.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);
      
    if (error) {
      alert('Error updating role');
    } else {
      setProfiles(profiles.map(p => p.id === id ? { ...p, role: newRole } : p));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const vendorRoles = ['VENDOR'];
  const userRoles = ['JUNIOR_PROJECT_MANAGER', 'PROJECT_MANAGER', 'HEAD_PROJECT_MANAGER', 'SCRUM_MASTER'];

  const filteredProfiles = profiles.filter(p => {
    if (filter === 'PENDING') return p.role === 'PENDING';
    if (filter === 'VENDOR') return vendorRoles.includes(p.role);
    if (filter === 'USER') return userRoles.includes(p.role);
    return true;
  });

  const stats = {
    total: profiles.length,
    active: profiles.filter(p => p.is_active).length,
    pending: profiles.filter(p => p.role === 'PENDING').length,
    vendors: profiles.filter(p => vendorRoles.includes(p.role)).length,
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white">
      {/* Top Navbar */}
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary-blue/20 rounded-lg text-primary-blue">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-violet bg-clip-text text-transparent">
              Scrum Master Portal
            </h1>
            <p className="text-sm text-gray-400">User Access Management</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total, color: 'text-white' },
            { label: 'Pending Access', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Active', value: stats.active, color: 'text-green-400' },
            { label: 'Vendors', value: stats.vendors, color: 'text-orange-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Registered Users</h2>

              {/* Filter tabs */}
              <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                {(['ALL', 'PENDING', 'VENDOR', 'USER'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${filter === f ? 'bg-primary-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? 'Pending' : f === 'VENDOR' ? 'Vendors' : 'Users'}
                  </button>
                ))}
              </div>
            </div>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin text-primary-blue"><Activity size={32} /></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wide">
                      <th className="py-3 font-medium">User</th>
                      <th className="py-3 font-medium">Email</th>
                      <th className="py-3 font-medium hidden md:table-cell">Joined</th>
                      <th className="py-3 font-medium">Role</th>
                      <th className="py-3 font-medium hidden lg:table-cell">KYC</th>
                      <th className="py-3 font-medium text-center">Status</th>
                      <th className="py-3 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profile) => (
                      <motion.tr 
                        key={profile.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${profile.role === 'VENDOR' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {profile.role === 'VENDOR' ? <Building2 size={14} /> : <CreditCard size={14} />}
                            </div>
                            <span className="text-white text-sm font-medium truncate max-w-[120px]">{profile.username}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-400 text-sm">{profile.email}</td>
                        <td className="py-4 text-gray-400 text-sm hidden md:table-cell">
                          {new Date(profile.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-4">
                          <select
                            value={profile.role}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 outline-none text-xs focus:border-primary-blue text-white"
                          >
                            {USER_ROLES.map(r => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 hidden lg:table-cell">
                          <VendorKYCDrawer profile={profile} />
                        </td>
                        <td className="py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${profile.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {profile.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {profile.is_active ? 'Active' : 'Restricted'}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <button
                            onClick={() => handleToggleActive(profile.id, profile.is_active)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                              profile.is_active 
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {profile.is_active ? 'Revoke' : 'Activate'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    
                    {filteredProfiles.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-gray-500 text-sm">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
