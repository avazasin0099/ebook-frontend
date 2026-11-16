import React, { useEffect, useState } from 'react';
import { Smartphone, Shield, Trash2, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import api from '../../services/api';

interface UserDevice {
  id: string;
  deviceName: string;
  deviceType: string;
  operatingSystem: string;
  appVersion: string;
  lastActiveAt: string;
  createdAt: string;
}

export const MyDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/devices');
      setDevices(res.data.data || []);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setError('Failed to load registered devices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevokeDevice = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke authorization for this device? It will no longer be able to decrypt your offline publications.')) {
      return;
    }

    try {
      setRevokingId(id);
      await api.delete(`/devices/${id}`);
      setDevices(devices.filter((d) => d.id !== id));
    } catch (err: any) {
      console.error('Revoke failed:', err);
      alert(err.response?.data?.message || 'Failed to revoke device authorization.');
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <Smartphone className="w-7 h-7 text-brand-400" />
          <span>Registered Devices</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage Android devices authorized to read your Readium LCP-protected publications offline.
        </p>
      </div>

      {/* Quota Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">DRM Device Allocation</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Each customer account is permitted up to 3 authorized hardware devices simultaneously.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-sm font-black text-brand-400">{devices.length}</span>
          <span className="text-xs text-slate-400">of 3 Slots Used</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Device List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-800 p-8 space-y-3">
          <Smartphone className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Devices Registered Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When you sign into the Avazas Android Reader app on your phone or tablet, it will automatically register your device and bind your offline reading license.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{device.deviceName}</h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    OS: {device.operatingSystem} • App Version: {device.appVersion || 'v1.0.0'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Last synced:{' '}
                    {device.lastActiveAt
                      ? new Date(device.lastActiveAt).toLocaleString('en-IN')
                      : 'Recently'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRevokeDevice(device.id)}
                disabled={revokingId === device.id}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{revokingId === device.id ? 'Revoking...' : 'Deregister Device'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
