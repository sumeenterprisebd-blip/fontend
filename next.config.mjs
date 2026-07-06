import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const apiOrigin = apiBase.replace(/\/api\/?$/, "");

const apiOriginUrl = (() => {
  try {
    return new URL(apiOrigin);
  } catch {
    return null;
  }
})();

const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || '';

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  assetPrefix: cdnUrl || undefined,
  modularizeImports: {
    'react-icons/fi': {
      transform: '@react-icons/all-files/fi/{{member}}',
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    'react-icons/hi': {
      transform: '@react-icons/all-files/hi/{{member}}',
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    'react-icons/fa': {
      transform: '@react-icons/all-files/fa/{{member}}',
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    'react-icons/fc': {
      transform: '@react-icons/all-files/fc/{{member}}',
      skipDefaultConversion: true,
      preventFullImport: true,
    },
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error'] }
        : false,
  },

  images: {
    loader: 'default',
    path: cdnUrl ? `${cdnUrl}/_next/image` : undefined,
    remotePatterns: [
      ...(apiOriginUrl
        ? [
          {
            protocol: apiOriginUrl.protocol.replace(':', ''),
            hostname: apiOriginUrl.hostname,
            ...(apiOriginUrl.port ? { port: apiOriginUrl.port } : {}),
            pathname: '/uploads/**',
          },
        ]
        : []),
      {
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.sumetraders.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "sumetraders.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.sumetraders.shop",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "sumetraders.shop",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      // Facebook CDN images (some hero/media URLs are served from these hosts)
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fbsbx.com',
        pathname: '/**',
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 604800, // 7 days
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.{jpg,jpeg,png,gif,webp,avif,svg,ico}",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.{woff,woff2,ttf,eot}",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.[hash].{js,css}",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.{txt,xml,json}",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, must-revalidate" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
