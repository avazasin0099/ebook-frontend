import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  Image,
  FileCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Lock,
  Search,
  X,
  AlertCircle,
} from 'lucide-react';
import { bookService } from '../../services/book.service';
import { Book } from '../../types';

export const BookManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    language: 'English',
    basePrice: 499,
    salePrice: 399,
    currency: 'INR',
    availableFormats: 'EPUB',
    status: 'DRAFT',
  });

  // Upload states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await bookService.getBooks({
        search: search || undefined,
        status: statusFilter || undefined,
        limit: 50,
      });
      setBooks(res.books || []);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [statusFilter]);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await bookService.createBook(formData as any);
      setBooks([created, ...books]);
      setCreateModalOpen(false);
      setFormData({
        title: '',
        slug: '',
        description: '',
        language: 'English',
        basePrice: 499,
        salePrice: 399,
        currency: 'INR',
        availableFormats: 'EPUB',
        status: 'DRAFT',
      });
      alert('Book metadata created successfully! Now upload the cover and manuscript.');
    } catch (err: any) {
      alert('Creation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (book: Book) => {
    const newStatus = book.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const updated = await bookService.updateStatus(book.id, newStatus);
      setBooks(books.map((b) => (b.id === book.id ? { ...b, status: updated.status } : b)));
    } catch (err: any) {
      alert('Status update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUploadAssets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBook) return;

    try {
      setUploading(true);
      setUploadMessage(null);

      if (coverFile) {
        await bookService.uploadCover(activeBook.id, coverFile);
      }

      if (manuscriptFile) {
        await bookService.uploadManuscript(activeBook.id, manuscriptFile);
      }

      setUploadMessage('Assets uploaded successfully! The DRM encryption engine has processed the publication.');
      setCoverFile(null);
      setManuscriptFile(null);
      fetchBooks();
    } catch (err: any) {
      setUploadMessage('Error uploading assets: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <BookOpen className="w-7 h-7 text-brand-400" />
            <span>Book Catalog Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, publish, and manage digital publications with Readium LCP encryption.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Publication</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
        >
          <option value="">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Book Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Cover</th>
                <th className="py-3 px-4 font-semibold">Title & Metadata</th>
                <th className="py-3 px-4 font-semibold">Pricing</th>
                <th className="py-3 px-4 font-semibold">Formats</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading publications...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No publications found. Click "Add New Publication" to create one.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4">
                      {book.coverImageUrl ? (
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded border border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-slate-800 rounded flex items-center justify-center text-[9px] text-slate-500 text-center">
                          No Cover
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-sm">{book.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {book.authors?.map((a) => a.name).join(', ') || 'No author attached'}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">Slug: {book.slug}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">₹{Number(book.salePrice).toLocaleString('en-IN')}</span>
                      {Number(book.basePrice) > Number(book.salePrice) && (
                        <span className="text-[10px] text-slate-500 line-through ml-1.5">
                          ₹{Number(book.basePrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center text-[10px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                        <Lock className="w-2.5 h-2.5 mr-1" />
                        {book.availableFormats}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          book.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveBook(book);
                          setUploadModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Upload Cover & Manuscript Assets"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(book)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                          book.status === 'PUBLISHED'
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {book.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Book Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Create New Book</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                    })
                  }
                  placeholder="e.g. Microservices Architecture Masterclass"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the publication..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Language</label>
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Format</label>
                  <select
                    value={formData.availableFormats}
                    onChange={(e) => setFormData({ ...formData, availableFormats: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="EPUB">EPUB</option>
                    <option value="PDF">PDF</option>
                    <option value="BOTH">BOTH (EPUB & PDF)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all mt-4"
              >
                Create Book Metadata
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Asset Upload Modal */}
      {uploadModalOpen && activeBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Upload Publication Assets</h3>
                <p className="text-[11px] text-slate-400 truncate max-w-sm">{activeBook.title}</p>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadMessage && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                {uploadMessage}
              </div>
            )}

            <form onSubmit={handleUploadAssets} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Book Cover Image (JPEG/PNG/WebP, max 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Original Publication Manuscript (EPUB / PDF, max 200MB)
                </label>
                <input
                  type="file"
                  accept=".epub,.pdf"
                  onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  * Uploaded files are stored in private storage and encrypted using Readium LCP AES-256 before delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading || (!coverFile && !manuscriptFile)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Process DRM</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
