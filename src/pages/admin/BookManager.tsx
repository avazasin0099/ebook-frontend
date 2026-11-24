import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Upload, Search, X } from 'lucide-react';
import { Pagination, usePagination } from '../../components/admin/Pagination';
import { PageTitle } from '../../components/admin/PageHeader';
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
      alert('Book created. Next, upload its cover and file.');
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

      setUploadMessage('Uploaded. The book file has been encrypted and is ready to sell.');
      setCoverFile(null);
      setManuscriptFile(null);
      fetchBooks();
    } catch (err: any) {
      setUploadMessage('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const pager = usePagination(books, statusFilter + search);

  const fileInput =
    'admin-input p-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle icon={BookOpen} title="Books" />

        <button onClick={() => setCreateModalOpen(true)} className="admin-btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add book
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search title or author, then press Enter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
            className="admin-input pl-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-input sm:w-44"
        >
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Price</th>
                <th>Format</th>
                <th>Status</th>
                <th className="text-right" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">Loading books…</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No books yet. Use “Add book” to create your first one.
                  </td>
                </tr>
              ) : (
                pager.pageItems.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <BookCover url={book.coverImageUrl} title={book.title} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-500">
                            {book.authors?.map((a) => a.name).join(', ') || 'No author added'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="font-medium text-gray-900">₹{Number(book.salePrice).toLocaleString('en-IN')}</span>
                      {Number(book.basePrice) > Number(book.salePrice) && (
                        <span className="ml-1.5 text-xs text-gray-400 line-through">
                          ₹{Number(book.basePrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-gray-600">
                      {book.availableFormats === 'BOTH' ? 'EPUB + PDF' : book.availableFormats}
                    </td>
                    <td>
                      <span
                        className={
                          book.status === 'PUBLISHED'
                            ? 'admin-badge-green'
                            : book.status === 'ARCHIVED'
                            ? 'admin-badge-gray'
                            : 'admin-badge-amber'
                        }
                      >
                        {book.status.charAt(0) + book.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => {
                            setActiveBook(book);
                            setUploadMessage(null);
                            setUploadModalOpen(true);
                          }}
                          className="admin-btn-ghost"
                          title="Upload cover and book file"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(book)}
                          className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
                            book.status === 'PUBLISHED'
                              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              : 'text-[#0b498d] hover:bg-blue-50'
                          }`}
                        >
                          {book.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={pager.page}
          pageCount={pager.pageCount}
          pageSize={pager.pageSize}
          total={pager.total}
          onPageChange={pager.setPage}
          onPageSizeChange={pager.setPageSize}
          noun="books"
        />
      </div>

      {createModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal max-w-lg">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add a book</h3>
              <button onClick={() => setCreateModalOpen(false)} className="admin-btn-ghost -mr-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div>
                <label className="admin-label">Title</label>
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
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">
                  URL slug <span className="font-normal text-gray-400">(filled in from the title)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="admin-input font-mono text-xs"
                />
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this book about?"
                  className="admin-input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">List price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Selling price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Language</label>
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Format</label>
                  <select
                    value={formData.availableFormats}
                    onChange={(e) => setFormData({ ...formData, availableFormats: e.target.value })}
                    className="admin-input"
                  >
                    <option value="EPUB">EPUB</option>
                    <option value="PDF">PDF</option>
                    <option value="BOTH">EPUB + PDF</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Create book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {uploadModalOpen && activeBook && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal max-w-lg">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">Upload files</h3>
                <p className="truncate text-sm text-gray-500">{activeBook.title}</p>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="admin-btn-ghost -mr-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            {uploadMessage && (
              <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{uploadMessage}</div>
            )}

            <form onSubmit={handleUploadAssets} className="space-y-4">
              <div>
                <label className="admin-label">Cover image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className={fileInput}
                />
                <p className="mt-1 text-xs text-gray-500">JPG, PNG or WebP, up to 10 MB.</p>
              </div>

              <div>
                <label className="admin-label">Book file</label>
                <input
                  type="file"
                  accept=".epub,.pdf"
                  onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                  className={fileInput}
                />
                <p className="mt-1 text-xs text-gray-500">
                  EPUB or PDF, up to 200 MB. It’s stored privately and encrypted before readers download it.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="admin-btn-secondary">
                  Close
                </button>
                <button
                  type="submit"
                  disabled={uploading || (!coverFile && !manuscriptFile)}
                  className="admin-btn-primary"
                >
                  {uploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const BookCover: React.FC<{ url?: string | null; title: string }> = ({ url, title }) => {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-400">
        <BookOpen className="h-4 w-4" />
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={title}
      onError={() => setFailed(true)}
      className="h-12 w-9 shrink-0 rounded object-cover ring-1 ring-gray-200"
    />
  );
};
