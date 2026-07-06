# Sume Traders E-Commerce Frontend

A high-performance Next.js e-commerce platform with optimized image delivery, fast page loads, and a full-featured Admin Dashboard.

## Website Features

- Product catalog with filtering, sorting, and search
- Cart and checkout flow
- User authentication and profile management
- Order tracking and history
- Reviews and ratings
- Favorites/wishlist
- Admin Dashboard for product, order, and user management
- Real-time analytics and notifications

## Admin Dashboard Product Page

The Admin Dashboard Product page allows admins to filter products by name, category, and price range. Admins can add, edit, or delete products, and view product details in a sortable table.

## Getting Started

See backend README for API setup. To run the frontend:

```bash
npm run dev
```

## API Integration

The frontend connects to the backend via RESTful APIs. Configure API endpoints in `.env.local`.

## Deployment

Deploy on Vercel or any Node.js hosting platform. See backend README for production tips.

---

## 🚀 Recent Performance Optimizations

### ⚡ Render-Blocking Optimization (Jan 17, 2026)
- **Eliminated 770ms** render-blocking time
- Removed global Cloudinary script loading
- Added DNS prefetch and preconnect hints
- **Result**: 94% reduction in blocking time

See [RENDER_BLOCKING_FIX.md](./RENDER_BLOCKING_FIX.md) for details.

### 🖼️ Image Optimization (Jan 16, 2026)
- **280+ KiB saved** per page load
- WebP/AVIF format support (60-70% smaller files)
- Responsive image sizing
- **Result**: 30-40% faster page loads

### 📊 Combined Performance Impact
- **Page Load Time**: 40-50% faster
- **LCP**: Improved from 3-4s to 1.5-2.5s
- **Performance Score**: 90+ (was 70-80)
- **Core Web Vitals**: All green ✅

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Analytics Setup

This project supports optional third-party analytics/tracking scripts configured from the Admin settings panel:

- **Google Tag Manager** (GTM)
- **Google Analytics 4** (GA4)
- **Meta / Facebook Pixel**
- **Microsoft Clarity**

### Tracking Mode (Best Practices)

Browser audits (Lighthouse “Best Practices”) will flag third-party trackers for:

- Deprecated APIs used by vendor scripts (e.g., Meta Pixel’s `fbevents.js`)
- Third-party cookies (often blocked by browsers)

To keep development clean and to allow running audits without third-party trackers, script injection is gated by an environment switch:

```env
# off | on | production (default)
NEXT_PUBLIC_TRACKING_MODE=production
```

- `production` (default): only inject trackers when `NODE_ENV === 'production'`
- `off`: never inject trackers (best for Lighthouse / privacy-first mode)
- `on`: always inject trackers (not recommended for local development)

### Configuration

Tracking IDs are stored in backend settings (Admin → Analytics). If no IDs are set, no tracking scripts are injected.

### Usage

The helper methods in `src/utils/analytics.js` safely no-op when vendor globals are missing:

```javascript
import { trackEvent, trackPurchase, trackAddToCart, trackViewContent } from '@/utils/analytics';

trackEvent('button_click', { category: 'engagement' });
trackPurchase({ transactionId: 'T12345', value: 99.99, currency: 'BDT', items: [...] });
trackAddToCart({ productId: 'P001', productName: 'Product', value: 99.99 });
trackViewContent({ productId: 'P001', productName: 'Product', value: 99.99 });
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
