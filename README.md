# Avazas Books – Storefront & Customer Portal

Modern, 100% mobile-responsive React + Vite TypeScript storefront and digital reader management portal for the Avazas Books platform.

## Features
- **Storefront & Catalog:** Dynamic book discovery, category filters, instant search, and real-time inventory management.
- **Cashfree PG Checkout:** Integrated Cashfree checkout SDK for seamless UPI, cards, and netbanking transactions in Indian Rupees (₹).
- **Customer Portal:** Dedicated customer dashboard, digital library, authorized device management, and reading progress telemetry.
- **Admin Console:** Operations portal with sales analytics, publication catalog oversight, DRM license management, and customer administration.
- **100% Mobile Responsive:** Full support for mobile phones (360px+), tablets, and desktops with hamburger drawer and horizontal tab navigation.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm

### Installation
```bash
npm install
```

### Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your backend instance:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_CASHFREE_MODE=sandbox
```

### Running Locally
```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build
npm run preview
```
