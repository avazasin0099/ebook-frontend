import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const userRole = (typeof user.role === 'string'
    ? user.role
    : (user.role as any)?.name || 'CUSTOMER') as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If a Customer attempts to access an Admin route
    if (userRole === 'CUSTOMER') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};
