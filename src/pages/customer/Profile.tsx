import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setLoading(true);
      await api.patch('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setStatusMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text:
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Password update failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <User className="w-7 h-7 text-brand-400" />
          <span>My Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details and account security settings.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/20">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                {user?.role}
              </span>
              <span className="text-xs text-slate-400">• Customer Account</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-850">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Email Address</p>
              <p className="font-medium text-white truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-850">
            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Phone Number</p>
              <p className="font-medium text-white">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Change Password</h3>
            <p className="text-xs text-slate-400">Ensure your account uses a strong, unique password.</p>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
