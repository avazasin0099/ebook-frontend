import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Lock, Smartphone, AlertCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/order.service';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (cart.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const bookIds = cart.map((b) => b.id);
      const returnUrl = `${window.location.origin}/payment-status?order_id={order_id}`;

      // Call backend to create Order and Cashfree payment session
      const orderData = await orderService.createOrder(bookIds, returnUrl);

      // Trigger Cashfree JS checkout
      if (orderData.paymentSessionId) {
        clearCart();
        await orderService.triggerCashfreeCheckout(orderData.paymentSessionId);
      } else {
        throw new Error('Payment session could not be initialized.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8 flex items-center space-x-3">
          <ShoppingBag className="w-8 h-8 text-brand-400" />
          <span>Shopping Cart</span>
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Checkout Encountered an Issue</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h2 className="text-xl font-bold text-white mb-2">Your cart is currently empty</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Browse our catalog of protected e-books and add technical publications to your collection.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/20"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-sm text-slate-400">
                <span>{cart.length} {cart.length === 1 ? 'Publication' : 'Publications'}</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-16 h-22 object-cover rounded-lg border border-slate-700 shadow"
                      />
                    ) : (
                      <div className="w-16 h-22 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 text-xs text-center p-1">
                        No Cover
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/books/${book.slug || book.id}`}
                        className="text-base font-bold text-white hover:text-brand-400 transition-colors line-clamp-1"
                      >
                        {book.title}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">
                        {book.authors?.map((a) => a.name).join(', ') || 'Avazas Publishing'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5 mr-1" /> DRM Protected
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Format: {book.availableFormats}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="text-lg font-bold text-white">
                      ₹{Number(book.salePrice).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(book.id)}
                      className="text-xs text-slate-500 hover:text-red-400 p-1 rounded transition-colors flex items-center space-x-1 sm:mt-2"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 text-xs text-slate-400 space-y-1">
                <div className="flex items-center space-x-2 text-brand-400 font-semibold">
                  <Smartphone className="w-4 h-4" />
                  <span>Delivery Method</span>
                </div>
                <p>
                  Digital delivery directly to your Avazas Library. Reading requires authorization on your Avazas Android reader application with military-grade Readium LCP encryption.
                </p>
              </div>
            </div>

            {/* Order Summary & Cashfree Checkout */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 sticky top-24 space-y-6">
                <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Digital Goods GST</span>
                    <span className="text-emerald-400 font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>DRM Delivery & License</span>
                    <span className="text-emerald-400 font-medium">Free</span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-black text-brand-400">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay with Cashfree</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="space-y-2 pt-2 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>256-Bit SSL Encrypted Cashfree Checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Instant Digital Entitlement & Readium LCP Offline License</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
