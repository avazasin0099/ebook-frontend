import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  Smartphone,
  Download,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import { orderService } from '../../services/order.service';
import api from '../../services/api';
import { LibraryItem } from '../../types';

export const MyLibraryPage: React.FC = () => {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<LibraryItem | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [readerModalOpen, setReaderModalOpen] = useState(false);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    orderService.getMyLibrary()
      .then(setLibrary)
      .catch(console.error)
      .finally(() => setLoading(false));

    api.get('/devices')
      .then((res) => setDevices(res.data.data || []))
      .catch(() => setDevices([]));
  }, []);

  const filteredLibrary = (library || []).filter((item) => {
    if (!item) return false;
    const title = item.book?.title || '';
    const authors = item.book?.authors?.map((a) => a?.name || '').join(' ') || '';
    const query = (search || '').toLowerCase();
    return title.toLowerCase().includes(query) || authors.toLowerCase().includes(query);
  });

  const handleOpenDownloadModal = (item: LibraryItem) => {
    setSelectedBook(item);
    setActionError(null);
    setDownloadToken(null);
    setDownloadModalOpen(true);
  };

  const handleOpenReaderModal = (item: LibraryItem) => {
    setSelectedBook(item);
    setReaderModalOpen(true);
  };

  const handleGenerateDownloadToken = async () => {
    if (!selectedBook || !selectedBook.book) return;
    try {
      setActionError(null);
      // First get or check license for this book
      const licenseRes = await api.post(`/drm/licenses/${selectedBook.book.id}`);
      const license = licenseRes.data.data;

      // Check if user has an authorized device
      if (devices.length === 0) {
        setActionError('Please register an Android device first in order to issue an authorized encrypted download.');
        return;
      }

      const deviceId = devices[0].id;
      const formats = selectedBook.book.availableFormats || 'EPUB';
      // Authorize download
      const authRes = await api.post('/downloads/authorize', {
        bookId: selectedBook.book.id,
        licenseId: license.licenseId || license.id,
        deviceId,
        format: formats.includes('EPUB') ? 'EPUB' : 'PDF',
      });

      setDownloadToken(authRes.data.data.downloadToken);
    } catch (err: any) {
      console.error('Download authorization failed:', err);
      setActionError(err.response?.data?.message || 'Could not authorize encrypted download. Ensure device is registered.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <BookOpen className="w-7 h-7 text-brand-400" />
            <span>My Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your purchased publications with active Readium LCP DRM licenses.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my library..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Grid of Books */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredLibrary.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-white">No Publications Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'No books matched your search query in your library.' : 'You have not added any publications to your library yet.'}
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/20"
          >
            Explore Bookstore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLibrary.map((item) => (
            <div
              key={item.purchaseId}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-md group"
            >
              <div>
                {/* Book Cover */}
                <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden flex items-center justify-center">
                  {item.book?.coverImageUrl ? (
                    <img
                      src={item.book.coverImageUrl}
                      alt={item.book?.title || 'Book Cover'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-slate-400 line-clamp-2">
                        {item.book?.title || 'Avazas Publication'}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>LCP DRM</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-brand-400 transition-colors">
                    {item.book?.title || 'Avazas Publication'}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.book?.authors?.map((a) => a?.name).filter(Boolean).join(', ') || 'Avazas Publishing'}
                  </p>

                  {/* Reading Progress */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="text-brand-400 font-semibold">
                        {item.readingProgress?.percentageComplete != null
                          ? `${Math.round(item.readingProgress.percentageComplete)}%`
                          : 'Not started'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                        style={{
                          width: `${item.readingProgress?.percentageComplete || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => handleOpenReaderModal(item)}
                  className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-brand-500/20"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Read on Android</span>
                </button>

                <button
                  onClick={() => handleOpenDownloadModal(item)}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-700/60"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>Encrypted Package</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Android Reader Modal */}
      {readerModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReaderModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Read on Avazas Android App</h3>
              <p className="text-xs text-slate-400 mt-1">
                Reading <span className="text-white font-medium">{selectedBook.book?.title || 'Avazas Book'}</span> requires the Avazas Kotlin Reader on Android.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                <p>Launch the Avazas Books app on your authorized Android device.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                <p>Sign in using this account's email and password.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                <p>Tap your purchased book to download and decrypt the publication seamlessly for offline reading.</p>
              </div>
            </div>

            <button
              onClick={() => setReaderModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Download Encrypted Package Modal */}
      {downloadModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDownloadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">DRM Encrypted Publication Download</h3>
                <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  Readium LCP Protected
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 text-slate-200 font-medium">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Notice on Content Protection</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Avazas Books strictly enforces commercial digital rights management. The file you receive is AES-256 encrypted and binds to your authorized Android device. It cannot be read in standard, unprotected PDF/EPUB readers.
              </p>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {downloadToken ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Download Token Authorized (Valid for 15 minutes)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Click below to stream the encrypted publication to your device storage.
                </p>
                <a
                  href={`${api.defaults.baseURL}/downloads/stream?token=${downloadToken}`}
                  download
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Encrypted File</span>
                </a>
              </div>
            ) : (
              <button
                onClick={handleGenerateDownloadToken}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Generate Authorized Download Token</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
