import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Phone,
  X,
  Inbox,
  RefreshCw,
  MessageSquare,
  Clock,
  Loader,
  Check,
  Tag,
  Eye,
  ArrowUpRight,
  Inbox as InboxIcon,
} from 'lucide-react';
import { Pagination, usePagination } from '../../components/admin/Pagination';
import type { LucideIcon } from 'lucide-react';
import { contactService } from '../../services/contact.service';
import { ContactSubmission } from '../../types';
import { PageHeader } from '../../components/admin/PageHeader';
import { RowMenu } from '../../components/admin/RowMenu';
import { Toast, ToastState } from '../../components/admin/Toast';

// Keep in sync with the backend's contact status enum
interface StatusDef {
  value: string;
  label: string;
  icon: LucideIcon;
  dot: string; // filled circle behind the icon
  text: string; // label colour
  strip: string; // pastel header of the summary card
  stripIcon: string;
  pill: string; // selected state in the popup
}

const STATUSES: StatusDef[] = [
  {
    value: 'PENDING',
    label: 'Pending',
    icon: Clock,
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    strip: 'bg-amber-50',
    stripIcon: 'text-amber-500',
    pill: 'bg-amber-50 text-amber-700 ring-amber-400',
  },
  {
    value: 'IN_PROGRESS',
    label: 'In progress',
    icon: Loader,
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    strip: 'bg-blue-50',
    stripIcon: 'text-blue-500',
    pill: 'bg-blue-50 text-blue-700 ring-blue-400',
  },
  {
    value: 'RESOLVED',
    label: 'Resolved',
    icon: Check,
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    strip: 'bg-emerald-50',
    stripIcon: 'text-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-400',
  },
];

const statusInfo = (s: string): StatusDef =>
  STATUSES.find((x) => x.value === s) ?? {
    value: s,
    label: s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ') : '—',
    icon: Clock,
    dot: 'bg-gray-400',
    text: 'text-gray-700',
    strip: 'bg-gray-50',
    stripIcon: 'text-gray-400',
    pill: 'bg-gray-100 text-gray-700 ring-gray-300',
  };

const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
  const s = statusInfo(status);
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap font-medium ${s.text}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${s.dot}`}>
        <Icon className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
      {s.label}
    </span>
  );
};

// Soft, stable colour per topic so the same topic always looks the same
const TOPIC_TONES = [
  'bg-violet-50 text-violet-700',
  'bg-orange-50 text-orange-700',
  'bg-teal-50 text-teal-700',
  'bg-pink-50 text-pink-700',
  'bg-sky-50 text-sky-700',
  'bg-lime-50 text-lime-700',
];
const topicTone = (t: string) => {
  let h = 0;
  for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TOPIC_TONES[h % TOPIC_TONES.length];
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const timeAgo = (iso: string) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [draftStatus, setDraftStatus] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const closeToast = useCallback(() => setToast(null), []);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await contactService.getAll();
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setContacts(list);
    } catch (err: any) {
      setError(err.response?.data?.message || 'We couldn’t load contact submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const applyUpdate = (id: string, patch: Partial<ContactSubmission>) =>
    setContacts((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const changeStatus = async (c: ContactSubmission, status: string, allowUndo = true) => {
    if (status === c.status) return;
    const previous = c.status;
    applyUpdate(c.id, { status });
    setSavingId(c.id);
    try {
      const updated = await contactService.update(c.id, { status });
      if (updated) applyUpdate(c.id, updated);
      setToast({
        id: Date.now(),
        kind: 'success',
        title: 'Updated',
        message: `${c.name || 'Message'} marked as ${statusInfo(status).label.toLowerCase()}.`,
        onUndo: allowUndo ? () => changeStatus({ ...c, status }, previous, false) : undefined,
      });
    } catch (err: any) {
      applyUpdate(c.id, { status: previous });
      setToast({
        id: Date.now(),
        kind: 'error',
        title: 'Couldn’t update',
        message: err.response?.data?.message || 'Please try again.',
      });
    } finally {
      setSavingId(null);
    }
  };

  const openDetails = (c: ContactSubmission) => {
    setSelected(c);
    setDraftStatus(c.status);
    setDraftNotes(c.adminNotes ?? '');
    setModalError(null);
  };

  const saveDetails = async () => {
    if (!selected) return;
    const changes: { status?: string; adminNotes?: string | null } = {};
    if (draftStatus !== selected.status) changes.status = draftStatus;
    const notes = draftNotes.trim() || null;
    if (notes !== (selected.adminNotes ?? null)) changes.adminNotes = notes;
    if (Object.keys(changes).length === 0) {
      setSelected(null);
      return;
    }
    setSavingId(selected.id);
    setModalError(null);
    try {
      const updated = await contactService.update(selected.id, changes);
      applyUpdate(selected.id, updated ?? changes);
      setSelected(null);
      setToast({ id: Date.now(), kind: 'success', title: 'Saved', message: `Changes to ${selected.name || 'this message'} saved.` });
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Couldn’t save. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const topics = useMemo(
    () => Array.from(new Set(contacts.map((c) => c.topic).filter(Boolean))).sort(),
    [contacts]
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    contacts.forEach((c) => (m[c.status] = (m[c.status] ?? 0) + 1));
    return m;
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (topic && c.topic !== topic) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.adminNotes ?? '').toLowerCase().includes(q)
      );
    });
  }, [contacts, search, topic, statusFilter]);

  const pager = usePagination(filtered, `${search}|${topic}|${statusFilter}`);

  const summary = [
    { key: '', label: 'All messages', icon: InboxIcon, strip: 'bg-violet-50', stripIcon: 'text-violet-500', count: contacts.length },
    ...STATUSES.map((s) => ({ key: s.value, label: s.label, icon: s.icon, strip: s.strip, stripIcon: s.stripIcon, count: counts[s.value] ?? 0 })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageSquare}
        title="Contacts"
        actions={
          <button onClick={load} disabled={loading} className="admin-btn-primary">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      {/* Table card */}
      <div className="admin-card">
        <div className="flex flex-col gap-3 px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {statusFilter ? statusInfo(statusFilter).label : 'All messages'}{' '}
            <span className="font-medium text-gray-500">({filtered.length})</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, phone, message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input pl-10"
              />
            </div>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="admin-input sm:w-56">
              <option value="">All topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Topic</th>
                <th>Message</th>
                <th>Status</th>
                <th>Submitted</th>
                <th className="text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <p className="text-gray-700">{error}</p>
                    <button onClick={load} className="mt-2 font-medium text-[#0b498d] hover:underline">
                      Try again
                    </button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Inbox className="mx-auto h-10 w-10 text-blue-200" />
                    <p className="mt-3 text-gray-600">
                      {contacts.length === 0 ? 'No messages yet.' : 'Nothing matches these filters.'}
                    </p>
                  </td>
                </tr>
              ) : (
                pager.pageItems.map((c) => (
                  <tr key={c.id} onClick={() => openDetails(c)} className="group cursor-pointer">
                    <td className="whitespace-nowrap font-semibold text-gray-900">{c.name || '—'}</td>
                    <td className="whitespace-nowrap">
                      {c.phone ? (
                        <a
                          href={`tel:${c.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-700 hover:text-[#0b498d]"
                        >
                          {c.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {c.topic ? (
                        <span className={`admin-badge max-w-[12rem] ${topicTone(c.topic)}`} title={c.topic}>
                          <Tag className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{c.topic}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <p className="max-w-[10rem] truncate text-gray-600 2xl:max-w-sm">{c.message}</p>
                    </td>
                    <td>
                      <StatusLabel status={c.status} />
                    </td>
                    <td className="whitespace-nowrap">
                      <p className="text-gray-800">{formatDate(c.submittedAt)}</p>
                      <p className="text-xs text-gray-400">{timeAgo(c.submittedAt)}</p>
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        {c.adminNotes && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(c);
                            }}
                            title={c.adminNotes}
                            className="inline-flex items-center gap-0.5 text-[13px] font-medium text-[#0b498d] hover:text-blue-700"
                          >
                            Note <ArrowUpRight className="h-4 w-4" />
                          </button>
                        )}
                        <RowMenu
                          items={[
                            { label: 'View & add note', icon: Eye, onSelect: () => openDetails(c) },
                            ...STATUSES.map((s, i) => ({
                              label: `Mark ${s.label.toLowerCase()}`,
                              icon: s.icon,
                              disabled: c.status === s.value || savingId === c.id,
                              dividerBefore: i === 0,
                              onSelect: () => changeStatus(c, s.value),
                            })),
                            ...(c.phone
                              ? [{ label: 'Call', icon: Phone, dividerBefore: true, onSelect: () => (window.location.href = `tel:${c.phone}`) }]
                              : []),
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={pager.page}
          pageCount={pager.pageCount}
          pageSize={pager.pageSize}
          total={pager.total}
          onPageChange={pager.setPage}
          onPageSizeChange={pager.setPageSize}
          noun="messages"
        />
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal max-w-xl p-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 rounded-t-2xl bg-[#0b498d] px-6 py-5 text-white">
              <div>
                <h3 className="text-xl font-bold">{selected.name || 'Unknown sender'}</h3>
                <p className="mt-0.5 text-sm text-blue-100">Submitted {formatDateTime(selected.submittedAt)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="-mr-2 -mt-1 rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6 text-sm">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="mt-0.5 font-semibold text-gray-900">{selected.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Topic</dt>
                  <dd className="mt-0.5 font-semibold text-gray-900">{selected.topic || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Received</dt>
                  <dd className="mt-0.5 text-gray-900">{formatDateTime(selected.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Last updated</dt>
                  <dd className="mt-0.5 text-gray-900">{formatDateTime(selected.updatedAt)}</dd>
                </div>
              </dl>

              <div>
                <p className="text-gray-500">Message</p>
                <p className="mt-1.5 whitespace-pre-wrap rounded-xl bg-blue-50/60 p-4 leading-relaxed text-gray-800">
                  {selected.message || '—'}
                </p>
              </div>

              <div>
                <p className="admin-label">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setDraftStatus(s.value)}
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-medium ring-1 ring-inset transition-colors ${draftStatus === s.value ? `${s.pill} ring-2` : 'bg-white text-gray-600 ring-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${s.dot}`}>
                          <Icon className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="admin-label" htmlFor="admin-notes">
                  Admin notes <span className="font-normal text-gray-400">(only visible to admins)</span>
                </label>
                <textarea
                  id="admin-notes"
                  rows={3}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder="e.g. Called back on Monday, sending the notes by email"
                  className="admin-input resize-none"
                />
              </div>

              {modalError && <p className="rounded-xl bg-rose-50 p-3 text-rose-700">{modalError}</p>}

              <div className="flex items-center justify-between gap-2 pt-1">
                {selected.phone ? (
                  <a href={`tel:${selected.phone}`} className="admin-btn-secondary">
                    <Phone className="h-4 w-4 text-[#0b498d]" />
                    Call
                  </a>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <button onClick={() => setSelected(null)} className="admin-btn-secondary">
                    Cancel
                  </button>
                  <button onClick={saveDetails} disabled={savingId === selected.id} className="admin-btn-primary">
                    {savingId === selected.id ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};
