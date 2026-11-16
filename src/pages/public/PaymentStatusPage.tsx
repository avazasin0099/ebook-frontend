import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, BookOpen, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { orderService } from '../../services/order.service';
import { Order } from '../../types';

export const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>('CHECKING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkStatus = async (retryCount = 0) => {
    if (!orderId) {
      setErrorMessage('Missing order identification in callback URL.');
      setLoading(false);
      return;
    }

    try {
      if (retryCount === 0) setLoading(true);
      const res = await orderService.verifyOrderStatus(orderId);
      setStatus(res.status);
      setOrder(res.order);

      // If gateway is still processing and we have retries left, poll again in 2.5 seconds
      if (res.status === 'PENDING' && retryCount < 4) {
        setTimeout(() => {
          checkStatus(retryCount + 1);
        }, 2500);
      }
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setErrorMessage(err.response?.data?.message || 'Unable to verify payment status at this moment.');
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus(0);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {loading ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying Transaction</h2>
            <p className="text-sm text-slate-400">
              Communicating securely with Cashfree Gateway and synchronizing your digital reading licenses...
            </p>
          </div>
        ) : status === 'PAID' || status === 'SUCCESS' ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Payment Successful
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Thank You for Your Order!</h2>
              <p className="text-sm text-slate-400 mt-2">
                Order reference <span className="font-mono text-white font-medium">{order?.orderNumber || orderId}</span> has been confirmed.
              </p>
            </div>

            {/* Order Details card */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid</span>
                <span className="text-white font-bold">₹{order?.netAmount?.toLocaleString('en-IN') || '--'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Gateway</span>
                <span className="text-slate-300">Cashfree PG (Verified)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Entitlement Status</span>
                <span className="text-emerald-400 font-semibold">Active & DRM Protected</span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                to="/library"
                className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Go to My Library</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/explore"
                className="block text-xs text-slate-400 hover:text-white transition-colors"
              >
                Continue Browsing Catalog
              </Link>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Available for offline reading in the Avazas Android Reader</span>
            </div>
          </div>
        ) : status === 'PENDING' ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Payment In Progress
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Awaiting Gateway Confirmation</h2>
              <p className="text-sm text-slate-400 mt-2">
                Cashfree is finalizing your transaction. This may take up to a minute.
              </p>
            </div>

            <button
              onClick={() => checkStatus(0)}
              className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-check Payment Status</span>
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
              <XCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-red-400 font-bold">
                Payment Incomplete
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Transaction Not Completed</h2>
              <p className="text-sm text-slate-400 mt-2">
                {errorMessage || 'The payment was cancelled or declined by your bank/UPI provider.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/cart"
                className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <span>Return to Cart & Retry</span>
              </Link>
              <Link
                to="/"
                className="block text-xs text-slate-400 hover:text-white transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
