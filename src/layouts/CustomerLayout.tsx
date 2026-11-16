import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Smartphone,
  User,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'My Library', to: '/library', icon: BookOpen },
    { name: 'Order History', to: '/orders', icon: ShoppingBag },
    { name: 'My Devices', to: '/devices', icon: Smartphone },
    { name: 'Account Profile', to: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
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
          {/* Customer Left Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sticky top-24 space-y-6">
              {/* User mini card */}
              <div className="flex items-center space-x-3 pb-5 border-b border-slate-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-500/20">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
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

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Customer Main Content */}
          <section className="lg:col-span-3">
            <Outlet />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
