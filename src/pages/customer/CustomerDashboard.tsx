import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Smartphone, ShieldCheck, ArrowRight, Clock, Award, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/order.service';
import api from '../../services/api';
import { LibraryItem, Order } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [libData, ordersData, devicesRes] = await Promise.all([
          orderService.getMyLibrary().catch(() => []),
          orderService.getMyOrders().catch(() => []),
          api.get('/devices').catch(() => ({ data: { data: [] } })),
        ]);
        setLibrary(libData);
        setOrders(ordersData);
        setDeviceCount(devicesRes.data.data?.length || 0);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3">
            Welcome back, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Your personal digital bookstore hub. Manage your Readium LCP-protected publications, monitor Android reading progress, and view transaction history.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/library"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/20"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Open My Library ({library.length})</span>
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <Compass className="w-4 h-4 mr-2 text-brand-400" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Purchased Books
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-4">{library.length}</p>
          <p className="text-xs text-slate-400 mt-1">Active DRM licenses</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Authorized Devices
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-4">{deviceCount} / 3</p>
          <p className="text-xs text-slate-400 mt-1">Registered Android devices</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-4">{orders.length}</p>
          <p className="text-xs text-slate-400 mt-1">Cashfree verified purchases</p>
        </div>
      </div>

      {/* Recent Books */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <span>Recent Library Additions</span>
          </h2>
          <Link to="/library" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : library.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-sm">
            You have not purchased any publications yet. Explore our bookstore catalog to start reading!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {library.slice(0, 3).map((item) => (
              <div
                key={item.purchaseId}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-4"
              >
                {item.book?.coverImageUrl ? (
                  <img
                    src={item.book.coverImageUrl}
                    alt={item.book?.title || 'Book Cover'}
                    className="w-14 h-20 object-cover rounded-lg border border-slate-700 shadow"
                  />
                ) : (
                  <div className="w-14 h-20 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-semibold px-1 text-center">
                    Avazas
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {item.book?.title || 'Avazas Publication'}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {item.book?.authors?.map((a) => a?.name).filter(Boolean).join(', ') || 'Avazas'}
                  </p>
                  <div className="mt-2 flex items-center space-x-2 text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>LCP DRM Protected</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Android Reader Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Avazas Android Reader Application</h3>
            <p className="text-xs text-slate-400 mt-1">
              Read your encrypted EPUB and PDF books completely offline with automatic progress synchronization.
            </p>
          </div>
        </div>
        <Link
          to="/devices"
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
        >
          Manage Devices
        </Link>
      </div>
    </div>
  );
};
