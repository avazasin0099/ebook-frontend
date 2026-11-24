import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts & Guards
import { PublicLayout } from '../layouts/PublicLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Public Pages
import { Home } from '../pages/public/Home';
import { Explore } from '../pages/public/Explore';
import { CategoriesPage } from '../pages/public/CategoriesPage';
import { BookDetails } from '../pages/public/BookDetails';
import { CartPage } from '../pages/public/CartPage';
import { PaymentStatusPage } from '../pages/public/PaymentStatusPage';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  RefundPolicyPage,
} from '../pages/public/StaticPages';

// Auth Pages
import { LoginPage } from '../pages/auth/Login';
import { RegisterPage } from '../pages/auth/Register';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { MyLibraryPage } from '../pages/customer/MyLibrary';
import { OrderHistoryPage } from '../pages/customer/OrderHistory';
import { MyDevicesPage } from '../pages/customer/MyDevices';
import { ProfilePage } from '../pages/customer/Profile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { BookManager } from '../pages/admin/BookManager';
import { CustomerManager } from '../pages/admin/CustomerManager';
import { OrderManager } from '../pages/admin/OrderManager';
import { LicenseManager } from '../pages/admin/LicenseManager';
import { ContactManager } from '../pages/admin/ContactManager';

export const router = createBrowserRouter([
  // Public Storefront Routes
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'explore', element: <Explore /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'books/:id', element: <BookDetails /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'payment/status', element: <PaymentStatusPage /> },
      { path: 'payment-status', element: <PaymentStatusPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'refunds', element: <RefundPolicyPage /> },
    ],
  },

  // Auth Routes
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    errorElement: <ErrorBoundary />,
  },

  // Customer Dashboard Routes (Pathless Layout Route)
  {
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']}>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'dashboard', element: <CustomerDashboard /> },
      { path: 'library', element: <MyLibraryPage /> },
      { path: 'orders', element: <OrderHistoryPage /> },
      { path: 'devices', element: <MyDevicesPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Admin Dashboard Routes (Protected)
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'books', element: <BookManager /> },
      { path: 'customers', element: <CustomerManager /> },
      { path: 'orders', element: <OrderManager /> },
      { path: 'licenses', element: <LicenseManager /> },
      { path: 'contacts', element: <ContactManager /> },
    ],
  },

  // Fallback redirect
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
