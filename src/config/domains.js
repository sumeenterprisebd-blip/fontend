/**
 * Domain Configuration
 * Supports both deshwear.com and deshwear.shop
 * Both domains point to the same application and share the same backend API
 */

// Primary domain configuration
export const DOMAINS = {
    SHOP: {
        name: 'deshwear.shop',
        primary: 'https://www.deshwear.shop',
        aliases: [
            'https://deshwear.shop',
            'https://www.deshwear.shop',
            'http://deshwear.shop',
            'http://www.deshwear.shop',
        ],
    },
    COM: {
        name: 'deshwear.com',
        primary: 'https://www.deshwear.com',
        aliases: [
            'https://deshwear.com',
            'https://www.deshwear.com',
            'http://deshwear.com',
            'http://www.deshwear.com',
        ],
    },
};

// Get current domain information
export const getCurrentDomainInfo = () => {
    if (typeof window === 'undefined') {
        return DOMAINS.SHOP; // Default to .shop in SSR context
    }

    const hostname = window.location.hostname;

    if (hostname.includes('deshwear.com')) {
        return DOMAINS.COM;
    }

    if (hostname.includes('deshwear.shop')) {
        return DOMAINS.SHOP;
    }

    // Default to shop domain
    return DOMAINS.SHOP;
};

// Get canonical URL (used for SEO)
export const getCanonicalUrl = (path = '') => {
    const domainInfo = getCurrentDomainInfo();
    const basePath = path.startsWith('/') ? path : `/${path}`;
    return `${domainInfo.primary}${basePath}`;
};

// All allowed origins for CORS
export const getAllowedOrigins = () => {
    return [
        ...DOMAINS.SHOP.aliases,
        ...DOMAINS.COM.aliases,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
    ];
};

// Check if a given origin is allowed
export const isAllowedOrigin = (origin) => {
    return getAllowedOrigins().includes(origin);
};

// Get domain-specific branding (if needed in future)
export const getDomainBranding = () => {
    const domainInfo = getCurrentDomainInfo();

    // Both domains share the same branding for now
    // But this allows for domain-specific customization in the future
    return {
        siteName: 'DeshWear',
        domain: domainInfo.name,
        email: 'support@deshwear.com',
        description:
            'Your Destination for Quality Fashion in Bangladesh. Find the perfect outfit at DeshWear with fast delivery and free shipping.',
    };
};

/**
 * IMPORTANT: Both domains are fully supported
 * 
 * Setup Instructions:
 * 1. Frontend (Vercel):
 *    - Add both domain aliases in Vercel project settings
 *    - Both domains will serve the same application
 * 
 * 2. Backend CORS:
 *    - Already configured to allow both domains
 *    - See server.js CORS configuration
 * 
 * 3. Environment Variables:
 *    - NEXTAUTH_URL: https://www.deshwear.shop (primary)
 *    - NEXT_PUBLIC_SITE_URL: https://www.deshwear.shop (for SEO fallback)
 *    - Both domains will work due to proper CORS headers
 * 
 * 4. DNS Configuration:
 *    - deshwear.com → Vercel deployment
 *    - deshwear.shop → Vercel deployment
 *    - Both should point to the same Vercel URL
 */
