import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZES = [10, 25, 50];

/** Client-side pagination. Jumps back to page 1 whenever `resetKey` changes (e.g. a search or filter). */
export function usePagination<T>(items: T[], resetKey: unknown = null, initialSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [resetKey, pageSize]);

  // Stay in range if the list shrinks (e.g. after a status change filters a row out)
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  return { page, setPage, pageSize, setPageSize, pageCount, pageItems, total: items.length };
}

/** Compact list like 1 … 4 5 6 … 12 */
const pageList = (page: number, count: number): (number | '…')[] => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(count - 1, page + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < count - 1) pages.push('…');
  pages.push(count);
  return pages;
};

interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  noun?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  noun = 'results',
}) => {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const btn =
    'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span>
          <span className="font-medium text-gray-700">
            {from}–{to}
          </span>{' '}
          of <span className="font-medium text-gray-700">{total}</span> {noun}
        </span>
        <label className="hidden items-center gap-2 sm:flex">
          Rows
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-200 bg-white py-1 pl-2 pr-7 text-sm text-gray-700 focus:border-[#0b498d] focus:outline-none"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      {pageCount > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`${btn} text-gray-600 hover:bg-gray-100`}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageList(page, pageCount).map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="px-1 text-gray-400">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`${btn} ${
                  p === page ? 'bg-[#0b498d] font-medium text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            className={`${btn} text-gray-600 hover:bg-gray-100`}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
};
