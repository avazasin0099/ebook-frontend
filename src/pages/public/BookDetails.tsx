import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../../services/book.service';
import { orderService } from '../../services/order.service';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  Lock,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
  Zap,
  BookOpen,
  Calendar,
  Globe,
  FileText,
} from 'lucide-react';

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [buying, setBuying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBookById(id!),
    enabled: !!id,
  });

  const handleInstantBuy = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!book) return;

    setBuying(true);
    setErrorMsg(null);
    try {
      // 1. Create order and Cashfree session with explicit return URL
      const returnUrl = `${window.location.origin}/payment-status?order_id={order_id}`;
      const result = await orderService.createOrder([book.id], returnUrl);

      // 2. Launch Cashfree checkout
      await orderService.triggerCashfreeCheckout(result.paymentSessionId);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to initiate Cashfree checkout');
      setBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="aspect-[3/4] bg-slate-900 rounded-3xl" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-slate-900 rounded-lg w-2/3" />
            <div className="h-4 bg-slate-900 rounded-lg w-1/3" />
            <div className="h-32 bg-slate-900 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Book Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">
          The requested publication may be archived or unavailable.
        </p>
      </div>
    );
  }

  const discountPercent =
    book.basePrice > book.salePrice
      ? Math.round(((book.basePrice - book.salePrice) / book.basePrice) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {errorMsg && (
        <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left: Book Cover & Format Specs */}
        <div className="space-y-6">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-700">
                <BookOpen className="w-16 h-16 mb-3 text-slate-600" />
                <span className="text-sm font-bold text-slate-400">{book.title}</span>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-brand-300 border border-brand-500/30 flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Readium LCP Protected
              </span>
            </div>
          </div>

          {/* DRM Notice Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" /> Content Protection Guarantee
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span>Encrypted with ISO 23078-2 standard. No readable raw PDFs/EPUBs exposed.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span>Device authorization on up to 3 personal Android devices.</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-400 mr-2">•</span>
                <span>Full offline reading supported on dedicated Avazas Android app.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Book Details & Purchase Action */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {book.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20"
                >
                  {cat.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-lg text-slate-400 mt-2 font-medium">{book.subtitle}</p>
            )}

            <p className="text-sm text-slate-300 mt-3">
              By{' '}
              <span className="font-bold text-white">
                {book.authors?.map((a) => a.name).join(', ') || 'Avazas Author'}
              </span>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Price</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-white">
                  ₹{Number(book.salePrice).toFixed(0)}
                </span>
                {book.basePrice > book.salePrice && (
                  <span className="text-base text-slate-500 line-through">
                    ₹{Number(book.basePrice).toFixed(0)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => addToCart(book)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center ${
                  isInCart(book.id)
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {isInCart(book.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleInstantBuy}
                disabled={buying}
                className="px-6 sm:px-8 py-3 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center disabled:opacity-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                {buying ? 'Initializing Cashfree...' : 'Buy Now with Cashfree'}
              </button>
            </div>
          </div>

          {/* Publication Metadata Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Formats</span>
              <span className="font-semibold text-slate-200">{book.availableFormats}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Language</span>
              <span className="font-semibold text-slate-200 uppercase">{book.language}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Pages</span>
              <span className="font-semibold text-slate-200">{book.pageCount || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">ISBN</span>
              <span className="font-semibold text-slate-200">{book.isbn || 'Digital ISBN'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">About this Publication</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {book.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
