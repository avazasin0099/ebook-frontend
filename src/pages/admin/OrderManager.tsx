import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { adminService } from '../../services/admin.service';

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

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <ShoppingBag className="w-7 h-7 text-brand-400" />
          <span>Platform Orders</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all commercial sales and Cashfree payment transactions across the platform.
        </p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by order #, customer email..."
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
                <th className="py-3 px-4 font-semibold">Order #</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Publications</th>
                <th className="py-3 px-4 font-semibold">Net Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{order.user?.email || order.userId}</p>
                      <p className="text-[11px] text-slate-400">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {order.items?.length || 0} items
                    </td>
                    <td className="py-3 px-4 font-bold text-brand-400">
                      ₹{Number(order.netAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : order.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {order.status === 'PAID' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
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
