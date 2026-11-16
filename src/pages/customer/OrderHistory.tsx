import React, { useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle2, Clock, XCircle, ArrowUpRight, Receipt, FileText } from 'lucide-react';
import { orderService } from '../../services/order.service';
import { Order } from '../../types';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 mr-1" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <ShoppingBag className="w-7 h-7 text-brand-400" />
          <span>Order History</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your previous transactions and invoices processed through Cashfree Payment Gateway.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 text-slate-500 text-sm">
          No orders found. Once you purchase books, they will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono font-bold text-white">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <div className="text-xs text-slate-300 pt-1">
                  {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'publication' : 'publications'}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800 gap-2">
                <span className="text-lg font-black text-brand-400">
                  ₹{Number(order.netAmount).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
                >
                  <Receipt className="w-3.5 h-3.5 text-brand-400" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-white text-base">Order Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono text-white font-medium">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span>{getStatusBadge(selectedOrder.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-white">Cashfree PG India</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Purchased Publications
              </span>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 divide-y divide-slate-850">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-white">{item.book?.title || 'Avazas Publication'}</p>
                      <p className="text-[11px] text-slate-500">DRM License Included</p>
                    </div>
                    <span className="font-bold text-white">₹{Number(item.netPrice).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Total Amount</span>
              <span className="text-brand-400 text-lg">₹{Number(selectedOrder.netAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
