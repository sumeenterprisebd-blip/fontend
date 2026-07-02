/**
 * API Response Caching Utility
 * Caches API responses to reduce redundant requests
 */

const cache = new Map();

/**
 * Cache configuration per endpoint
 * Duration is in milliseconds
 */
const CACHE_CONFIG = {
  '/heroes/active': 5 * 60 * 1000, // 5 minutes
  '/categories': 10 * 60 * 1000, // 10 minutes
  '/products': 5 * 60 * 1000, // 5 minutes
  '/popup/homepage': 5 * 60 * 1000, // 5 minutes
  '/facebook-videos/active': 10 * 60 * 1000, // 10 minutes
};

/**
 * Generate cache key from URL and params
 */
function generateCacheKey(url, params = {}) {
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&');
  
  return `${url}${paramString ? '?' + paramString : ''}`;
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid(cacheEntry) {
  if (!cacheEntry) return false;
  const age = Date.now() - cacheEntry.timestamp;
  return age < cacheEntry.duration;
}

/**
 * Get from cache if valid
 */
export function getFromCache(url, params = {}) {
  const key = generateCacheKey(url, params);
  const cacheEntry = cache.get(key);
  
  if (isCacheValid(cacheEntry)) {
    return cacheEntry.data;
  }
  
  // Remove expired cache
  if (cacheEntry) {
    cache.delete(key);
  }
  
  return null;
}

/**
 * Store response in cache
 */
export function setCache(url, params = {}, data) {
  const key = generateCacheKey(url, params);
  const duration = CACHE_CONFIG[url] || 5 * 60 * 1000; // Default 5 minutes
  
  cache.set(key, {
    data,
    timestamp: Date.now(),
    duration,
  });
}

/**
 * Clear cache for specific URL or all cache
 */
export function clearCache(url = null) {
  if (url) {
    // Clear all entries matching the URL pattern
    for (const [key] of cache) {
      if (key.startsWith(url)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  const stats = {
    size: cache.size,
    entries: [],
  };
  
  for (const [key, value] of cache) {
    stats.entries.push({
      key,
      age: Date.now() - value.timestamp,
      valid: isCacheValid(value),
    });
  }
  
  return stats;
}
