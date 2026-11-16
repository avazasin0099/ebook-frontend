import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const rawProfile = await authService.getMe();
        const role = (typeof rawProfile.role === 'string'
          ? rawProfile.role
          : (rawProfile.role as any)?.name || 'CUSTOMER') as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
        const profile: User = { ...rawProfile, role };
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const role = (typeof parsed.role === 'string'
          ? parsed.role
          : (parsed.role as any)?.name || 'CUSTOMER') as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
        setUser({ ...parsed, role });
      } catch {
        // ignore
      }
    }
    refreshProfile();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    const data = await authService.login(credentials);
    const role = (typeof data.user.role === 'string'
      ? data.user.role
      : (data.user.role as any)?.name || 'CUSTOMER') as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
    const normalizedUser: User = { ...data.user, role };
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  const register = async (formData: any) => {
    const data = await authService.register(formData);
    const role = (typeof data.user.role === 'string'
      ? data.user.role
      : (data.user.role as any)?.name || 'CUSTOMER') as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
    const normalizedUser: User = { ...data.user, role };
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const userRole = typeof user?.role === 'string' ? user.role : (user?.role as any)?.name;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
