import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { Pagination, usePagination } from '../../components/admin/Pagination';
import { PageHeader } from '../../components/admin/PageHeader';
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
    const reason = prompt('Why is this license being revoked? (kept for the audit log)');
    if (!reason) return;

    try {
      setRevokingId(id);
      await adminService.revokeLicense(id, reason);
      alert('License revoked. The reader app will no longer open this book.');
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

  const pager = usePagination(filteredLicenses, search);

  const cols = isSuperAdmin ? 6 : 5;

  return (
    <div className="space-y-6">
      <PageHeader icon={ShieldCheck} title="Licenses" />

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search license, customer or book ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input pl-9"
        />
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>License</th>
                <th>Customer</th>
                <th>Book</th>
                <th>Status</th>
                <th>Issued</th>
                {isSuperAdmin && <th className="text-right" />}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={cols} className="py-12 text-center text-gray-500">Loading licenses…</td>
                </tr>
              ) : filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={cols} className="py-12 text-center text-gray-500">No licenses issued yet.</td>
                </tr>
              ) : (
                pager.pageItems.map((lic) => (
                  <tr key={lic.id}>
                    <td className="font-mono text-xs text-gray-900" title={lic.id}>
                      {lic.id.substring(0, 12)}…
                    </td>
                    <td className="font-mono text-xs text-gray-500" title={lic.userId}>
                      {lic.userId.substring(0, 10)}…
                    </td>
                    <td className="font-mono text-xs text-gray-500" title={lic.bookId}>
                      {lic.bookId.substring(0, 10)}…
                    </td>
                    <td>
                      <span className={lic.status === 'ACTIVE' ? 'admin-badge-green' : 'admin-badge-red'}>
                        {lic.status === 'ACTIVE' ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-gray-500">
                      {new Date(lic.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    {isSuperAdmin && (
                      <td className="text-right">
                        {lic.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevoke(lic.id)}
                            disabled={revokingId === lic.id}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
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
        <Pagination
          page={pager.page}
          pageCount={pager.pageCount}
          pageSize={pager.pageSize}
          total={pager.total}
          onPageChange={pager.setPage}
          onPageSizeChange={pager.setPageSize}
          noun="licenses"
        />
      </div>
    </div>
  );
};
