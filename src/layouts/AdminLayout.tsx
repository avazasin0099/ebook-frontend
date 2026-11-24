import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingBag,
  ShieldCheck,
  MessageSquare,
  LogOut,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Overview', to: '/admin', icon: LayoutDashboard },
  { name: 'Books', to: '/admin/books', icon: BookOpen },
  { name: 'Customers', to: '/admin/customers', icon: Users },
  { name: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { name: 'Licenses', to: '/admin/licenses', icon: ShieldCheck },
  { name: 'Contacts', to: '/admin/contacts', icon: MessageSquare },
];

const COLLAPSE_KEY = 'admin_sidebar_collapsed';

interface SidebarProps {
  collapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onLogout: () => void;
  name: string;
  initials: string;
  roleLabel: string;
}

const SidebarContent: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  onClose,
  onLogout,
  name,
  initials,
  roleLabel,
}) => (
  <div className="flex h-full flex-col bg-[#0b498d] text-white">
    <div className={`flex h-[72px] shrink-0 items-center ${collapsed ? 'justify-center' : 'justify-between pl-5 pr-3'}`}>
      {!collapsed && (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-base font-bold text-[#0b498d]">
            A
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[15px] font-semibold">Avazas Books</p>
            <p className="text-xs text-blue-100">Admin console</p>
          </div>
        </div>
      )}
      {onToggle && (
        <button
          onClick={onToggle}
          className="rounded-lg p-2 text-blue-100 hover:bg-white/10 hover:text-white"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-blue-100 hover:bg-white/10 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>

    <nav className={`flex-1 space-y-1 overflow-y-auto py-5 ${collapsed ? 'px-2.5' : 'px-3'}`}>
      {!collapsed && (
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-blue-200/80">Manage</p>
      )}
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              `relative flex items-center rounded-lg py-2 text-sm transition-colors ${collapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
              } ${isActive
                ? 'bg-white/95 font-semibold text-blue-700'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-[#0b498d]' : 'text-blue-300'}`} />
                {!collapsed && <span>{item.name}</span>}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    <div className={`border-t border-white/15 ${collapsed ? 'p-2.5' : 'p-3'}`}>
      <Link
        to="/"
        title={collapsed ? 'View store' : undefined}
        className={`mb-2 flex items-center rounded-xl py-2.5 text-sm text-blue-50/90 hover:bg-white/10 hover:text-white ${collapsed ? 'justify-center' : 'justify-between px-3.5'
          }`}
      >
        {!collapsed && <span>View store</span>}
        <ArrowUpRight className="h-5 w-5 text-blue-200" />
      </Link>

      {collapsed ? (
        <button
          onClick={onLogout}
          title="Sign out"
          className="flex w-full justify-center rounded-xl py-2.5 text-blue-200 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-700">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="text-xs text-blue-100">{roleLabel}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  // Close the mobile drawer whenever the page changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'A';
  const roleLabel = user?.role === 'SUPER_ADMIN' ? 'Super admin' : 'Admin';
  const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const current = navItems.find((i) =>
    i.to === '/admin' ? location.pathname === '/admin' || location.pathname === '/admin/' : location.pathname.startsWith(i.to)
  );

  const shared = { onLogout: handleLogout, name, initials, roleLabel };

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans text-sm text-gray-900">
      {/* Sidebar — desktop, collapsible */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 lg:block ${collapsed ? 'w-[76px]' : 'w-64'
          }`}
      >
        <SidebarContent collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} {...shared} />
      </aside>

      {/* Top bar — mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-[#0b498d] px-4 text-white shadow-sm lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="-ml-1.5 rounded-md p-1.5 text-white hover:bg-white/15"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-base font-semibold">{current?.name ?? 'Admin'}</span>
      </header>

      {/* Drawer — mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-gray-900/30 transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 shadow-xl transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} {...shared} />
        </aside>
      </div>

      <main className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>
        <div className="px-4 py-6 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
