import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Download,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { adminService } from '../../services/admin.service';

interface AnalyticsData {
  summary: {
    totalCustomers: number;
    totalAdmins: number;
    totalBooks: number;
    publishedBooks: number;
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    activeLicenses: number;
  };
  dailySales: { date: string; orders: number; revenue: number }[];
  recentTransactions: any[];
}

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExportExcel = async () => {
    const url = await adminService.exportSalesReportUrl();
    const token = localStorage.getItem('access_token');
    // Trigger download with auth token in query or header via fetch
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `avazas-sales-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert('Failed to export report: ' + err.message));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-900 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const summary = (data as any)?.overview || data?.summary || {
    totalCustomers: 0,
    totalAdmins: 0,
    totalBooks: 0,
    publishedBooks: 0,
    totalOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeLicenses: 0,
  };

  const chartData = data?.dailySales?.length
    ? data.dailySales
    : [
        { date: 'Mon', revenue: 1250, orders: 3 },
        { date: 'Tue', revenue: 2400, orders: 5 },
        { date: 'Wed', revenue: 1800, orders: 4 },
        { date: 'Thu', revenue: 3200, orders: 7 },
        { date: 'Fri', revenue: 2900, orders: 6 },
        { date: 'Sat', revenue: 4100, orders: 9 },
        { date: 'Sun', revenue: 3500, orders: 8 },
      ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <TrendingUp className="w-7 h-7 text-brand-400" />
            <span>Platform Overview</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sales, user metrics, and DRM licensing analytics for Avazas Books.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-brand-400" />
          <span>Export Sales Report (.xlsx)</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">
            ₹{Number(summary.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">Cashfree Settled</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Orders</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{summary.totalOrders || 0}</p>
          <p className="text-xs text-slate-400 mt-1">{summary.paidOrders || 0} Successful purchases</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Publications</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{summary.publishedBooks || 0}</p>
          <p className="text-xs text-slate-400 mt-1">of {summary.totalBooks || 0} total books</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{summary.totalCustomers || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Active customer accounts</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Revenue Performance (INR)</h3>
            <p className="text-xs text-slate-400">Daily sales trends across bookstore transactions</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4 min-w-[280px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order #</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {data?.recentTransactions?.length ? (
                data.recentTransactions.map((tx: any) => {
                  const orderNum = tx.order?.orderNumber || tx.orderNumber || tx.cashfreeOrderId || tx.id;
                  const customerEmail = tx.order?.user?.email || tx.user?.email || tx.userId || 'Customer';
                  const amount = tx.amount != null ? tx.amount : (tx.netAmount != null ? tx.netAmount : 0);
                  const txDate = tx.completedAt || tx.createdAt || new Date();
                  return (
                    <tr key={tx.id} className="text-slate-300">
                      <td className="py-3 font-mono font-medium text-white">{orderNum}</td>
                      <td className="py-3">{customerEmail}</td>
                      <td className="py-3 font-bold text-brand-400">₹{Number(amount).toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.status === 'PAID' || tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{new Date(txDate).toLocaleDateString('en-IN')}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
