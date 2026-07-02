import { shopProducts } from '@/components/data/shopProductsData';
import { topSellingProducts } from '@/components/data/topSellingData';
import { newArrivalsProducts } from '@/components/data/newArrivalsData';

// Combine all product sources
const allProducts = [
    ...shopProducts,
    ...topSellingProducts,
    ...newArrivalsProducts
];

// Remove duplicates based on ID (optimized with Map for O(n) complexity)
const productMap = new Map();
allProducts.forEach(product => {
    if (!productMap.has(product.id)) {
        productMap.set(product.id, product);
    }
});
export const uniqueProducts = Array.from(productMap.values());

const normalize = (value) => String(value || "").toLowerCase();

const buildSearchTokens = (query) => {
    const trimmed = String(query || "").toLowerCase().trim();
    if (!trimmed) return [];
    return trimmed.split(/\s+/).filter(Boolean);
};

/**
 * Filter products based on search query
 * @param {string} query - Search query
 * @returns {Array} Filtered products
 */
export const filterProducts = (query) => {
    if (!query?.trim()) return [];

    const tokens = buildSearchTokens(query);
    if (tokens.length === 0) return [];

    return uniqueProducts.filter((product) => {
        const haystack = [
            product.title,
            product.name,
            product.category,
            product.color,
            product.dressStyle,
        ]
            .filter(Boolean)
            .map(normalize)
            .join(" ");

        // All tokens must be present somewhere (partial match).
        return tokens.every((token) => haystack.includes(token));
    });
};

/**
 * Sort products based on sort option
 * @param {Array} products - Products to sort
 * @param {string} sortBy - Sort option
 * @param {string} searchQuery - Search query for relevance sorting
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortBy, searchQuery = '') => {
    const sorted = [...products];

    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'relevance':
        default:
            if (!searchQuery) return sorted;
            const query = String(searchQuery).toLowerCase().trim();
            return sorted.sort((a, b) => {
                const aPrimary = normalize(a.title || a.name);
                const bPrimary = normalize(b.title || b.name);

                if (aPrimary === query) return -1;
                if (bPrimary === query) return 1;
                if (aPrimary.startsWith(query)) return -1;
                if (bPrimary.startsWith(query)) return 1;

                return 0;
            });
    }
};

/**
 * Get product by slug
 * @param {string} slug - Product slug from URL
 * @returns {Object|null} Product object or null if not found
 */
export const getProductBySlug = (slug) => {
    if (!slug) return null;

    return uniqueProducts.find(product => {
        if (!product.link) return false;
        const productSlug = product.link.replace('/product/', '');
        return productSlug === slug;
    }) || null;
};

/**
 * Get related products (same category, excluding current product)
 * @param {Object} currentProduct - Current product object
 * @param {number} limit - Maximum number of related products to return
 * @returns {Array} Array of related products
 */
export const getRelatedProducts = (currentProduct, limit = 4) => {
    if (!currentProduct) return [];

    return uniqueProducts
        .filter(product =>
            product.id !== currentProduct.id &&
            (product.category === currentProduct.category ||
                product.dressStyle === currentProduct.dressStyle)
        )
        .slice(0, limit);
};

