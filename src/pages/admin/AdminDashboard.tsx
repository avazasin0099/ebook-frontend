import React, { useEffect, useState } from 'react';
import { Download, IndianRupee, ShoppingBag, BookOpen, Users } from 'lucide-react';
import { Tone } from '../../components/admin/PageHeader';

const STRIPS: Record<string, { bg: string; icon: string }> = {
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-500' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-500' },
};
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
        <div className="h-8 w-40 rounded-lg bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl border border-gray-200 bg-white animate-pulse" />
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

  const stats = [
    {
      label: 'Revenue',
      icon: IndianRupee,
      tone: 'emerald' as Tone,
      value: `₹${Number(summary.totalRevenue || 0).toLocaleString('en-IN')}`,
      note: `₹${Number(summary.monthlyRevenue || 0).toLocaleString('en-IN')} this month`,
    },
    {
      label: 'Orders',
      icon: ShoppingBag,
      tone: 'blue' as Tone,
      value: Number(summary.totalOrders || 0).toLocaleString('en-IN'),
      note: `${summary.paidOrders || 0} paid`,
    },
    {
      label: 'Published books',
      icon: BookOpen,
      tone: 'violet' as Tone,
      value: Number(summary.publishedBooks || 0).toLocaleString('en-IN'),
      note: `of ${summary.totalBooks || 0} in the catalog`,
    },
    {
      label: 'Customers',
      icon: Users,
      tone: 'amber' as Tone,
      value: Number(summary.totalCustomers || 0).toLocaleString('en-IN'),
      note: `${summary.activeLicenses || 0} active licenses`,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b498d] to-blue-800 px-6 py-6 text-white sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-32 h-44 w-44 rounded-full bg-sky-300/20" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {(() => {
                const h = new Date().getHours();
                return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
              })()}
            </h1>
            <p className="mt-1 text-sm text-blue-100">Here’s how the store is doing today.</p>
          </div>
          <button
            onClick={handleExportExcel}
            className="admin-btn self-start bg-white text-blue-700 shadow-sm hover:bg-blue-50 sm:self-auto"
          >
            <Download className="h-4 w-4" />
            Download sales report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white p-2 shadow-[0_2px_8px_rgba(16,24,40,0.06)] ring-1 ring-gray-100"
          >
            <div className={`flex items-center justify-between rounded-xl px-3.5 py-3 ${STRIPS[s.tone].bg}`}>
              <span className="text-[15px] font-medium text-gray-800">{s.label}</span>
              <s.icon className={`h-5 w-5 ${STRIPS[s.tone].icon}`} />
            </div>
            <div className="px-3.5 pb-2 pt-3">
              <p className="text-xl font-bold tracking-tight text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-[13px] text-gray-500">{s.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card p-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">Daily revenue</h3>
        <p className="text-sm text-gray-500">Last few days of sales, in rupees.</p>

        <div className="h-72 w-full min-w-[280px] pt-6">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d62b1" />
                  <stop offset="100%" stopColor="#0b498d" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
              />
              <Tooltip
                cursor={{ fill: '#eff6ff' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="url(#revBar)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <div className="px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-gray-900">Recent transactions</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentTransactions?.length ? (
                data.recentTransactions.map((tx: any) => {
                  const orderNum = tx.order?.orderNumber || tx.orderNumber || tx.cashfreeOrderId || tx.id;
                  const customerEmail = tx.order?.user?.email || tx.user?.email || tx.userId || 'Customer';
                  const amount = tx.amount != null ? tx.amount : (tx.netAmount != null ? tx.netAmount : 0);
                  const txDate = tx.completedAt || tx.createdAt || new Date();
                  const ok = tx.status === 'PAID' || tx.status === 'SUCCESS';
                  return (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap font-mono text-xs text-gray-900">{orderNum}</td>
                      <td>{customerEmail}</td>
                      <td className="whitespace-nowrap font-medium text-gray-900">₹{Number(amount).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={ok ? 'admin-badge-green' : 'admin-badge-amber'}>
                          {String(tx.status || '').charAt(0) + String(tx.status || '').slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap text-right text-gray-500">
                        {new Date(txDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    No transactions yet.
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
