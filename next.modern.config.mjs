/**
 * Modern Browsers Only: Next.js config for minimal JS polyfills
 *
 * - Only transpile for modern browsers (ES2020+)
 * - Remove legacy polyfills and transforms
 * - Reduces JS bundle size and improves LCP
 */
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || '';

const nextConfig = {
    images: {
        loader: 'default',
        path: cdnUrl ? `${cdnUrl}/_next/image` : undefined,
        remotePatterns: [
            { hostname: "localhost", port: "5000", pathname: "/uploads/**" },
            { protocol: "https", hostname: "www.deshwear.com", pathname: "/uploads/**" },
            { protocol: "https", hostname: "deshwear.com", pathname: "/uploads/**" },
            { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
            { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
            { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {
        legacyBrowsers: false, // Only target modern browsers
        esmExternals: "loose", // Use native ESM for dependencies
    },
    assetPrefix: cdnUrl || undefined,
    // ...existing headers and redirects config...
};

export default nextConfig;
