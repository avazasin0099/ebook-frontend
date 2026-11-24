import React, { useEffect, useState } from 'react';
import { Search, Plus, X, Users } from 'lucide-react';
import { Pagination, usePagination } from '../../components/admin/Pagination';
import { PageTitle } from '../../components/admin/PageHeader';
import { adminService } from '../../services/admin.service';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const CustomerManager: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Super Admin Create Admin Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [adminModalMsg, setAdminModalMsg] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setCustomers(res?.customers || res?.data?.customers || (Array.isArray(res) ? res : []));
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleToggleStatus = async (cust: any) => {
    const newStatus = cust.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      setTogglingId(cust.id);
      await adminService.setCustomerStatus(cust.id, newStatus);
      setCustomers(customers.map((c) => (c.id === cust.id ? { ...c, status: newStatus } : c)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update customer status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdminModalMsg(null);
      await api.post('/admin/admins', newAdmin);
      alert('Admin account created.');
      setAdminModalOpen(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '', phone: '' });
    } catch (err: any) {
      setAdminModalMsg(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const pager = usePagination(customers, statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle icon={Users} title="Customers" />

        {isSuperAdmin && (
          <button onClick={() => setAdminModalOpen(true)} className="admin-btn-primary self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            New admin
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email, then press Enter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
            className="admin-input pl-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-input sm:w-44"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Devices</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">Loading customers…</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">No customers found.</td>
                </tr>
              ) : (
                pager.pageItems.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <p className="font-medium text-gray-900">
                        {cust.firstName} {cust.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{cust.email}</p>
                    </td>
                    <td className="whitespace-nowrap">{cust.phone || '—'}</td>
                    <td className="whitespace-nowrap text-gray-600">{cust.devices?.length || 0} of 3</td>
                    <td>
                      <span className={cust.status === 'ACTIVE' ? 'admin-badge-green' : 'admin-badge-red'}>
                        {cust.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-gray-500">
                      {new Date(cust.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleStatus(cust)}
                        disabled={togglingId === cust.id}
                        className={`text-sm font-medium disabled:opacity-50 ${
                          cust.status === 'ACTIVE' ? 'text-red-600 hover:text-red-700' : 'text-[#0b498d] hover:text-blue-700'
                        }`}
                      >
                        {cust.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
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
          noun="customers"
        />
      </div>

      {adminModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal max-w-md">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add an admin</h3>
              <button onClick={() => setAdminModalOpen(false)} className="admin-btn-ghost -mr-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            {adminModalMsg && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{adminModalMsg}</div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">First name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Last name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Email</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Password</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">
                  Phone <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAdminModalOpen(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Create admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
