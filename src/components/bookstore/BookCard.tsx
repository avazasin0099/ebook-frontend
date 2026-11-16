import React from 'react';
import { Link } from 'react-router-dom';
import { Book as BookType } from '../../types';
import { ShoppingBag, Lock, BookOpen } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface BookCardProps {
  book: BookType;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart, isInCart } = useCart();
  const authorName = book.authors?.[0]?.name || 'Unknown Author';
  const categoryName = book.categories?.[0]?.name || 'General';

  const discountPercent =
    book.basePrice > book.salePrice
      ? Math.round(((book.basePrice - book.salePrice) / book.basePrice) * 100)
      : 0;

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col">
      {/* Cover Image Container */}
      <Link to={`/books/${book.slug || book.id}`} className="relative aspect-[3/4] overflow-hidden bg-slate-950 block">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-600">
            <BookOpen className="w-12 h-12 mb-2 text-slate-700 group-hover:text-brand-500 transition-colors" />
            <span className="text-xs font-semibold text-slate-400 line-clamp-2">{book.title}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-brand-300 border border-brand-500/30 flex items-center">
            <Lock className="w-2.5 h-2.5 mr-1" /> DRM LCP
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Book Info */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider block mb-1">
            {categoryName}
          </span>
          <Link
            to={`/books/${book.slug || book.id}`}
            className="font-bold text-slate-100 hover:text-brand-400 text-sm line-clamp-2 leading-snug transition-colors"
          >
            {book.title}
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{authorName}</p>
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-extrabold text-white">
              ₹{Number(book.salePrice).toFixed(0)}
            </span>
            {book.basePrice > book.salePrice && (
              <span className="text-xs text-slate-500 line-through">
                ₹{Number(book.basePrice).toFixed(0)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(book)}
            className={`p-2 rounded-xl border transition-all ${
              isInCart(book.id)
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-brand-600 hover:text-white hover:border-brand-500'
            }`}
            title={isInCart(book.id) ? 'Added to Cart' : 'Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
