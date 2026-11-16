import api from './api';

export const adminService = {
  async getAnalytics() {
    const res = await api.get('/admin/analytics');
    return res.data.data;
  },

  async getCustomers(params?: { search?: string; status?: string; page?: number }) {
    const res = await api.get('/admin/customers', { params });
    return res.data.data || res.data;
  },

  async setCustomerStatus(customerId: string, status: 'ACTIVE' | 'SUSPENDED') {
    const res = await api.patch(`/admin/customers/${customerId}/status`, { status });
    return res.data.data;
  },

  async getAllOrders() {
    const res = await api.get('/orders');
    return res.data.data;
  },

  async getAllLicenses() {
    const res = await api.get('/drm/admin/licenses');
    return res.data.data;
  },

  async revokeLicense(licenseId: string, reason?: string) {
    const res = await api.patch(`/drm/admin/licenses/${licenseId}/revoke`, { reason });
    return res.data.data;
  },

  async exportSalesReportUrl(): Promise<string> {
    return `${api.defaults.baseURL}/admin/reports/sales/excel`;
  },
};
