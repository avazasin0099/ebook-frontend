export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  permissions?: string[];
  status?: string;
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  isbn?: string | null;
  language: string;
  pageCount?: number | null;
  basePrice: number;
  salePrice: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  coverImageUrl?: string | null;
  availableFormats: string;
  isFeatured?: boolean;
  categories?: { id: string; name: string; slug: string }[];
  authors?: { id: string; name: string; photoUrl?: string }[];
  publishers?: { id: string; name: string; logoUrl?: string }[];
  previews?: { id: string; previewType: string; storagePath: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  items?: {
    id: string;
    bookId: string;
    price: number;
    discount: number;
    netPrice: number;
    book?: Book;
  }[];
}

export interface LibraryItem {
  purchaseId: string;
  grantedAt: string;
  book: Book;
  readingProgress?: {
    percentageComplete: number;
    currentPage?: number;
    totalPages?: number;
    lastReadAt?: string;
  } | null;
}
