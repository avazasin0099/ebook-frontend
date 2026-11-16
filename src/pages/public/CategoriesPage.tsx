import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { bookService } from '../../services/book.service';
import { Category } from '../../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Catalogs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Books by Category
          </h1>
          <p className="mt-4 text-slate-400 text-base">
            Discover secure e-books across software architecture, cybersecurity, machine learning, management, and digital technologies.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No categories discovered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.slug}`}
                className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all" />

                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                    {cat.description || 'Explore our comprehensive selection of curated publications.'}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>Browse publications</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
