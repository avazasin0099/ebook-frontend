import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingBag,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Analytics & Overview', to: '/admin', icon: LayoutDashboard },
    { name: 'Book Publications', to: '/admin/books', icon: BookOpen },
    { name: 'Customer Oversight', to: '/admin/customers', icon: Users },
    { name: 'Storefront Orders', to: '/admin/orders', icon: ShoppingBag },
    { name: 'DRM Licenses', to: '/admin/licenses', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight">
                AVAZAS <span className="text-brand-400">ADMIN</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Operations & DRM Console
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/explore"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <span>View Bookstore</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                {user?.role}
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {user?.firstName}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Admin Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sticky top-24 space-y-6">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
                Operations Menu
              </span>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-850'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 px-3">
                Avazas Books Engine v1.0.0
                <br />
                ISO 23078-2 Readium LCP
              </div>
            </div>
          </aside>

          {/* Admin Content Area */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
