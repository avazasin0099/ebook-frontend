import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Undo2, X } from 'lucide-react';

export interface ToastState {
  id: number;
  kind: 'success' | 'error';
  title: string;
  message: string;
  onUndo?: () => void;
}

const DURATION = 6000;

/** Bottom bar notification with a draining progress line and optional undo. */
export const Toast: React.FC<{ toast: ToastState | null; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, DURATION);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const ok = toast.kind === 'success';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 lg:pl-64">
      <div
        key={toast.id}
        className="pointer-events-auto relative w-full max-w-3xl overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/15"
      >
        <div
          className={`absolute left-0 top-0 h-[3px] ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`}
          style={{ animation: `admin-toast-drain ${DURATION}ms linear forwards` }}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
          <p className="flex flex-1 items-center gap-2 text-sm text-gray-700">
            {ok ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 fill-emerald-500 text-white" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 fill-rose-500 text-white" />
            )}
            <span className={`font-semibold ${ok ? 'text-emerald-600' : 'text-rose-600'}`}>{toast.title}</span>
            <span className="text-gray-400">—</span>
            <span>{toast.message}</span>
          </p>
          <div className="flex items-center gap-4 text-[13px] text-gray-600">
            {toast.onUndo && (
              <>
                <button
                  onClick={() => {
                    toast.onUndo?.();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 font-medium hover:text-[#0b498d]"
                >
                  Undo action <Undo2 className="h-4 w-4" />
                </button>
                <span className="h-4 w-px bg-gray-200" />
              </>
            )}
            <button onClick={onClose} className="flex items-center gap-1.5 font-medium hover:text-gray-900">
              Close <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
