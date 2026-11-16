import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search, AlertCircle, Ban, CheckCircle2, Lock } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { useAuth } from '../../contexts/AuthContext';

export const LicenseManager: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllLicenses();
      setLicenses(data || []);
    } catch (err) {
      console.error('Failed to load licenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleRevoke = async (id: string) => {
    const reason = prompt('Enter justification/audit reason for revoking this Readium LCP license:');
    if (!reason) return;

    try {
      setRevokingId(id);
      await adminService.revokeLicense(id, reason);
      alert('License revoked successfully. The associated Android reader will deny further decrypt requests.');
      fetchLicenses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Revocation failed');
    } finally {
      setRevokingId(null);
    }
  };

  const filteredLicenses = licenses.filter((lic) =>
    lic.id?.toLowerCase().includes(search.toLowerCase()) ||
    lic.userId?.toLowerCase().includes(search.toLowerCase()) ||
    lic.bookId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <ShieldCheck className="w-7 h-7 text-brand-400" />
          <span>DRM Licenses & Rights Enforcement</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor Readium LCP cryptographic licenses, device limits, and cryptographic revocation status.
        </p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by license ID, customer ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">License ID</th>
                <th className="py-3 px-4 font-semibold">Customer ID</th>
                <th className="py-3 px-4 font-semibold">Publication ID</th>
                <th className="py-3 px-4 font-semibold">DRM Standard</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Issued Date</th>
                {isSuperAdmin && <th className="py-3 px-4 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading DRM licenses...
                  </td>
                </tr>
              ) : filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No active or revoked DRM licenses recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((lic) => (
                  <tr key={lic.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-white">
                      {lic.id.substring(0, 18)}...
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{lic.userId.substring(0, 12)}...</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{lic.bookId.substring(0, 12)}...</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 font-semibold">
                        <Lock className="w-2.5 h-2.5 mr-1" />
                        Readium LCP 1.0
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          lic.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {lic.status === 'ACTIVE' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Ban className="w-3 h-3 mr-1" />
                        )}
                        {lic.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(lic.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    {isSuperAdmin && (
                      <td className="py-3 px-4 text-right">
                        {lic.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevoke(lic.id)}
                            disabled={revokingId === lic.id}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-semibold transition-colors disabled:opacity-50"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
