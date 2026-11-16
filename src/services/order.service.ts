import api from './api';
import { load } from '@cashfreepayments/cashfree-js';
import { Order, LibraryItem } from '../types';

let cashfreePromise: Promise<any> | null = null;

const getCashfree = () => {
  if (!cashfreePromise) {
    const mode = (import.meta.env.VITE_CASHFREE_MODE || 'sandbox') as 'sandbox' | 'production';
    cashfreePromise = load({ mode });
  }
  return cashfreePromise;
};

export const orderService = {
  async createOrder(bookIds: string[], returnUrl?: string) {
    const res = await api.post('/orders', { bookIds, returnUrl });
    return res.data.data;
  },

  async triggerCashfreeCheckout(paymentSessionId: string): Promise<void> {
    const cashfree = await getCashfree();
    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: '_self',
    };
    cashfree.checkout(checkoutOptions);
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await api.get('/orders/my');
    return res.data.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  async verifyOrderStatus(orderId: string): Promise<{ status: string; order: Order }> {
    const res = await api.get(`/payments/${orderId}/status`);
    return res.data.data;
  },

  async getMyLibrary(): Promise<LibraryItem[]> {
    const res = await api.get('/library');
    return res.data.data;
  },
};
