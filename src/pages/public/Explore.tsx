import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../../services/book.service';
import { BookCard } from '../../components/bookstore/BookCard';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const [inputSearch, setInputSearch] = useState(search);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => bookService.getCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['exploreBooks', { search, category, sort, page }],
    queryFn: () =>
      bookService.getBooks({
        search: search || undefined,
        category: category || undefined,
        sort,
        page,
        limit: 16,
      }),
  });

  const updateParam = (key: string, val: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', inputSearch.trim() || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Bookstore</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse our catalogue of DRM-protected digital publications.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search publications..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </form>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => updateParam('category', null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !category
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam('category', c.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === c.slug
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="newest">Newest Releases</option>
            <option value="popular">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : data?.books && data.books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No books found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your search term or selecting another subject category.
          </p>
        </div>
      )}
    </div>
  );
};
