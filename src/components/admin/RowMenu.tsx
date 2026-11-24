import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface RowMenuItem {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  dividerBefore?: boolean;
}

/** "⋯" button that opens a small action menu. Uses fixed positioning so it never gets clipped by a scrolling table. */
export const RowMenu: React.FC<{ items: RowMenuItem[]; label?: string }> = ({ items, label = 'Actions' }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const menuH = menuRef.current?.offsetHeight ?? 200;
    const below = r.bottom + 6 + menuH < window.innerHeight;
    setPos({ top: below ? r.bottom + 6 : r.top - menuH - 6, left: Math.max(8, r.right - 208) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', () => setOpen(false), { once: true, capture: true });
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={label}
        className={`rounded-lg border p-1.5 transition-colors ${
          open ? 'border-blue-500 bg-blue-50 text-[#0b498d] ring-2 ring-blue-500/20' : 'border-transparent text-gray-500 hover:border-gray-200 hover:bg-white'
        }`}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      {open && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[60] w-52 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-900/10"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.label}>
                {item.dividerBefore && <div className="my-1 h-px bg-gray-100" />}
                <button
                  disabled={item.disabled}
                  onClick={() => {
                    setOpen(false);
                    item.onSelect();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm disabled:cursor-default disabled:opacity-40 ${
                    item.tone === 'danger' ? 'text-rose-600 hover:bg-rose-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  {item.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
};
