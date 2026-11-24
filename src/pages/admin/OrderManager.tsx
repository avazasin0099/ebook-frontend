import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { Pagination, usePagination } from '../../components/admin/Pagination';
import { PageHeader } from '../../components/admin/PageHeader';
import { adminService } from '../../services/admin.service';

const statusBadge = (status: string) =>
  status === 'PAID' ? 'admin-badge-green' : status === 'PENDING' ? 'admin-badge-amber' : 'admin-badge-red';

const prettyStatus = (s: string) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : '—');

export const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getAllOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((o) =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const pager = usePagination(filteredOrders, search);

  return (
    <div className="space-y-6">
      <PageHeader icon={ShoppingBag} title="Orders" />

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search order number or email"
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
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">Loading orders…</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">No orders yet.</td>
                </tr>
              ) : (
                pager.pageItems.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap font-mono text-xs text-gray-900">{order.orderNumber}</td>
                    <td>
                      <p className="font-medium text-gray-900">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{order.user?.email || order.userId}</p>
                    </td>
                    <td>{order.items?.length || 0}</td>
                    <td className="whitespace-nowrap font-medium text-gray-900">
                      ₹{Number(order.netAmount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={statusBadge(order.status)}>{prettyStatus(order.status)}</span>
                    </td>
                    <td className="whitespace-nowrap text-right text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
          noun="orders"
        />
      </div>
    </div>
  );
};
