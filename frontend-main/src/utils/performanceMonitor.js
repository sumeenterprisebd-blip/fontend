/**
 * Performance Monitoring Utility
 * Tracks API calls, cache hits, and performance metrics
 * 
 * Usage:
 * import { performanceMonitor } from '@/utils/performanceMonitor';
 * 
 * // Track an API call
 * performanceMonitor.trackAPICall('/products', 150, true);
 * 
 * // Get statistics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: [],
      cacheHits: 0,
      cacheMisses: 0,
      totalAPITime: 0,
      startTime: Date.now(),
    };
  }

  /**
   * Track an API call
   */
  trackAPICall(endpoint, duration, fromCache = false) {
    this.metrics.apiCalls.push({
      endpoint,
      duration,
      fromCache,
      timestamp: Date.now(),
    });

    if (fromCache) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
      this.metrics.totalAPITime += duration;
    }
  }

  /**
   * Get performance statistics
   */
  getStats() {
    const pageLoadTime = Date.now() - this.metrics.startTime;
    const totalCalls = this.metrics.apiCalls.length;
    const cacheHitRate = totalCalls > 0 
      ? ((this.metrics.cacheHits / totalCalls) * 100).toFixed(2) 
      : 0;

    const slowCalls = this.metrics.apiCalls.filter(call => call.duration > 500);

    return {
      pageLoadTime,
      totalAPICallsCount: totalCalls,
      cacheHits: this.metrics.cacheHits,
      cacheMisses: this.metrics.cacheMisses,
      cacheHitRate: `${cacheHitRate}%`,
      totalAPITime: this.metrics.totalAPITime,
      averageAPITime: totalCalls > 0 
        ? (this.metrics.totalAPITime / totalCalls).toFixed(2) 
        : 0,
      slowCalls: slowCalls.length,
      apiCallsList: this.metrics.apiCalls,
      slowCallsList: slowCalls,
    };
  }

  /**
   * Print formatted stats to console
   */
  printStats() {
    const stats = this.getStats();
    // Stats available but not logged
    return stats;
  }

  /**
   * Clear metrics
   */
  reset() {
    this.metrics = {
      apiCalls: [],
      cacheHits: 0,
      cacheMisses: 0,
      totalAPITime: 0,
      startTime: Date.now(),
    };
  }

  /**
   * Export metrics as JSON (for analysis)
   */
  export() {
    return {
      ...this.getStats(),
      exportTime: new Date().toISOString(),
    };
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Make it globally available in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.__performanceMonitor = performanceMonitor;

}
