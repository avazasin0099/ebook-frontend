import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Compass,
  Layers,
  LayoutDashboard,
  Smartphone,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const brandTarget = !isAuthenticated
    ? '/'
    : isAdmin
    ? '/admin'
    : '/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={brandTarget} className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              AVAZAS <span className="text-brand-400 font-semibold">BOOKS</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
              Protected DRM Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {!isAuthenticated ? (
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
          ) : (
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
          <Link to="/explore" className="text-slate-300 hover:text-white transition-colors">
            Explore Books
          </Link>
          <Link to="/categories" className="text-slate-300 hover:text-white transition-colors">
            Categories
          </Link>
          {isAuthenticated && (
            <Link to="/library" className="text-brand-400 hover:text-brand-300 transition-colors font-semibold">
              My Library
            </Link>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Admin Dashboard Pill (Desktop) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Desktop User Auth Buttons */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-sm text-slate-200 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
              >
                <UserIcon className="w-4 h-4 text-brand-400" />
                <span className="font-medium">{user?.firstName}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 px-4 py-1.5 rounded-lg shadow-sm shadow-brand-500/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors md:hidden focus:outline-none"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          {/* User info header on mobile if logged in */}
          {isAuthenticated && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="space-y-1">
            {!isAuthenticated ? (
              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-brand-400" />
                <span>Home</span>
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-400" />
                <span>Dashboard</span>
              </Link>
            )}

            <Link
              to="/explore"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Explore Books</span>
            </Link>

            <Link
              to="/categories"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Categories</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/library"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-400 hover:text-brand-300 hover:bg-slate-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Library</span>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Receipt className="w-4 h-4 text-brand-400" />
                  <span>Order History</span>
                </Link>

                <Link
                  to="/devices"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-brand-400" />
                  <span>My Devices</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-brand-400" />
                  <span>Account Profile</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-950/30 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Operations Console</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth buttons for unauthenticated mobile users */}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center border border-slate-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs text-center shadow-md shadow-brand-500/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
