import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Smartphone, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AVAZAS BOOKS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier digital bookstore with military-grade Readium LCP DRM content protection and offline reading on dedicated Android apps.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center text-emerald-400">
                <ShieldCheck className="w-4 h-4 mr-1" /> Verified Cashfree Partner
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Bookstore
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-white transition-colors">All Publications</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Subject Categories</Link></li>
              <li><Link to="/explore?sort=popular" className="hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link to="/library" className="hover:text-white transition-colors">Customer Library</Link></li>
            </ul>
          </div>

          {/* Column 3: Android App & DRM */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Reader Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-brand-400 mr-1.5" /> Native Android Reader
              </li>
              <li className="flex items-center text-slate-300">
                <Lock className="w-3.5 h-3.5 text-brand-400 mr-1.5" /> Offline DRM Entitlements
              </li>
              <li><span className="text-slate-500">Android APK Download (Coming Soon)</span></li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refunds" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link></li>
              <li><span className="text-slate-500">Support: team@avazas.in</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Avazas. All rights reserved. Avazas Books is a registered trademark of Avazas.</p>
          <p className="mt-2 sm:mt-0">Powered by Readium LCP & Cashfree Payments.</p>
        </div>
      </div>
    </footer>
  );
};
