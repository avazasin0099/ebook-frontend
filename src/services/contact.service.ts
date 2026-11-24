import api from './api';
import { ContactSubmission } from '../types';

export interface ContactPayload {
  name: string;
  phone: string;
  topic: string;
  message: string;
}

// Backend may return the list directly, under `data`, or under `data.contacts`.
const unwrapList = (body: any): any[] => {
  const d = body?.data ?? body;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.contacts)) return d.contacts;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

const normalize = (c: any): ContactSubmission => ({
  id: String(c.id ?? c._id ?? ''),
  name: c.name ?? '',
  phone: c.phone ?? c.phoneNumber ?? '',
  topic: c.topic ?? c.category ?? '',
  message: c.message ?? '',
  status: c.status ?? 'PENDING',
  adminNotes: c.adminNotes ?? null,
  submittedAt: c.submittedAt ?? c.createdAt ?? '',
  createdAt: c.createdAt ?? '',
  updatedAt: c.updatedAt ?? '',
});

export const contactService = {
  /** Public: submitted from the website contact form */
  async submit(payload: ContactPayload) {
    const res = await api.post('/contacts', payload);
    return res.data?.data ?? res.data;
  },

  /** Admin: list all contact form submissions */
  async getAll(): Promise<ContactSubmission[]> {
    const res = await api.get('/contacts');
    return unwrapList(res.data).map(normalize);
  },

  /** Admin: change a submission's status and/or notes */
  async update(id: string, changes: { status?: string; adminNotes?: string | null }): Promise<ContactSubmission | null> {
    const res = await api.patch(`/contacts/${id}`, changes);
    const body = res.data?.data ?? res.data;
    return body && typeof body === 'object' && body.id ? normalize(body) : null;
  },
};
