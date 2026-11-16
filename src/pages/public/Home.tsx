import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookCard } from '../../components/bookstore/BookCard';
import { bookService } from '../../services/book.service';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck,
  Smartphone,
  Zap,
  ArrowRight,
  BookOpen,
  Search,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const userRole = typeof user?.role === 'string' ? user.role : (user?.role as any)?.name;
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featuredBooks'],
    queryFn: () => bookService.getBooks({ sort: 'popular', limit: 8 }),
    enabled: !isAuthenticated,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => bookService.getCategories(),
    enabled: !isAuthenticated,
  });

  if (authLoading || isAuthenticated) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-brand-950/40 via-slate-950 to-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-8 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Publications • ISO Readium LCP DRM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Discover, Purchase & Read{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400">
              Protected Digital Books
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Avazas Books delivers premium academic, professional, and literary publications. Enjoy seamless offline reading on our dedicated Android reader with device-bound encryption.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-2xl mx-auto flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl shadow-brand-500/10 focus-within:border-brand-500 transition-colors"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
            <input
              type="text"
              placeholder="Search by title, author, keyword, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent flex-grow text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 text-left flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Readium LCP DRM</h3>
                <p className="text-xs text-slate-400 mt-1">Cryptographically bound to your registered devices.</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 text-left flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Android Offline Reading</h3>
                <p className="text-xs text-slate-400 mt-1">Download encrypted publications and read offline anywhere.</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 text-left flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Instant UPI & Cards</h3>
                <p className="text-xs text-slate-400 mt-1">Cashfree payment gateway with instant license activation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-400">Featured</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Popular Publications</h2>
          </div>
          <Link
            to="/explore"
            className="text-xs sm:text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center group"
          >
            Explore all books <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredData?.books?.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Subject Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-400">Taxonomy</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.slug}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-850 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
