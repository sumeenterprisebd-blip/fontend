/**
 * Domain Configuration
 * Supports both sumetraders.com and sumetraders.shop
 * Both domains point to the same application and share the same backend API
 */

// Primary domain configuration
export const DOMAINS = {
    SHOP: {
        name: 'sumetraders.shop',
        primary: 'https://www.sumetraders.shop',
        aliases: [
            'https://sumetraders.shop',
            'https://www.sumetraders.shop',
            'http://sumetraders.shop',
            'http://www.sumetraders.shop',
        ],
    },
    COM: {
        name: 'sumetraders.com',
        primary: 'https://www.sumetraders.com',
        aliases: [
            'https://sumetraders.com',
            'https://www.sumetraders.com',
            'http://sumetraders.com',
            'http://www.sumetraders.com',
        ],
    },
};

// Get current domain information
export const getCurrentDomainInfo = () => {
    if (typeof window === 'undefined') {
        return DOMAINS.SHOP; // Default to .shop in SSR context
    }

    const hostname = window.location.hostname;

    if (hostname.includes('sumetraders.com')) {
        return DOMAINS.COM;
    }

    if (hostname.includes('sumetraders.shop')) {
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
        siteName: 'Sume Traders',
        domain: domainInfo.name,
        email: 'support@sumetraders.com',
        description:
            'Your Destination for Quality Fashion in Bangladesh. Find the perfect outfit at Sume Traders with fast delivery and free shipping.',
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
 *    - NEXTAUTH_URL: https://www.sumetraders.shop (primary)
 *    - NEXT_PUBLIC_SITE_URL: https://www.sumetraders.shop (for SEO fallback)
 *    - Both domains will work due to proper CORS headers
 * 
 * 4. DNS Configuration:
 *    - sumetraders.com → Vercel deployment
 *    - sumetraders.shop → Vercel deployment
 *    - Both should point to the same Vercel URL
 */
