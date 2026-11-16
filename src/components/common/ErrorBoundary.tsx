import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export const ErrorBoundary: React.FC = () => {
  const error: any = useRouteError();
  console.error('Route render error caught by ErrorBoundary:', error);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Application Encountered an Issue</h2>
          <p className="text-xs text-slate-400 mt-2">
            {error?.statusText || error?.message || 'An unexpected rendering error occurred. Your data is safe.'}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            to="/"
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Bookstore Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
