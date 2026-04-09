'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, checkUserActiveStatus } from '@/lib/auth/supabase';
import { Search, Activity, Shield, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type Profile = {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function ScrumMasterDashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="glass p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
            
            {error && <p className="text-red-400">{error}</p>}
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin text-primary-blue"><Activity size={32} /></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="py-4 font-medium">User / Company</th>
                      <th className="py-4 font-medium">Email</th>
                      <th className="py-4 font-medium">Creation Date</th>
                      <th className="py-4 font-medium">Role</th>
                      <th className="py-4 px-2 font-medium">Access Status</th>
                      <th className="py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <motion.tr 
                        key={profile.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="py-4 text-white">{profile.username}</td>
                        <td className="py-4 text-gray-400 text-sm">{profile.email}</td>
                        <td className="py-4 text-gray-400 text-sm">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <select
                            value={profile.role}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 outline-none text-sm focus:border-primary-blue"
                          >
                            <option value="VENDOR">Vendor</option>
                            <option value="PM">Project Manager</option>
                            <option value="SCRUM_MASTER">Scrum Master</option>
                          </select>
                        </td>
                        <td className="py-4 px-2">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${profile.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {profile.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {profile.is_active ? 'Active' : 'Restricted'}
                          </div>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleActive(profile.id, profile.is_active)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                              profile.is_active 
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {profile.is_active ? 'Revoke Access' : 'Grant Access'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    
                    {profiles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-400">
                          No users found in database.
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
