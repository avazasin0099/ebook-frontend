import api from './api';
import { Book, Category } from '../types';

export interface BookFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  status?: string;
}

export const bookService = {
  async getBooks(params?: BookFilterParams): Promise<{ books: Book[]; meta: any }> {
    const res = await api.get('/books', { params });
    return {
      books: res.data.data,
      meta: res.data.meta,
    };
  },

  async getBookById(idOrSlug: string): Promise<Book> {
    const res = await api.get(`/books/${idOrSlug}`);
    return res.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get('/categories');
    return res.data.data;
  },

  // Admin APIs
  async createBook(data: Partial<Book> & { categoryIds?: string[]; authorIds?: string[]; publisherIds?: string[] }): Promise<Book> {
    const res = await api.post('/books', data);
    return res.data.data;
  },

  async updateBook(id: string, data: Partial<Book>): Promise<Book> {
    const res = await api.put(`/books/${id}`, data);
    return res.data.data;
  },

  async updateStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<Book> {
    const res = await api.patch(`/books/${id}/status`, { status });
    return res.data.data;
  },

  async uploadCover(id: string, file: File): Promise<{ coverImageUrl: string }> {
    const formData = new FormData();
    formData.append('cover', file);
    const res = await api.post(`/books/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async uploadManuscript(id: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('manuscript', file);
    const res = await api.post(`/books/${id}/manuscript`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
