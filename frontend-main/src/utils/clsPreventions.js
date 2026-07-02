/**
 * Cumulative Layout Shift (CLS) Prevention Utilities
 * 
 * Prevents unexpected layout shifts by:
 * - Reserving space for images and dynamic content
 * - Preventing font loading shifts (FOIT/FOUT)
 * - Using transforms instead of layout-changing properties
 * - Stabilizing dynamic content insertion
 */

/**
 * Calculate and reserve aspect ratio container
 * Prevents layout shift when images load
 * 
 * @param {Number} width - Image width
 * @param {Number} height - Image height
 * @returns {String} - paddingBottom percentage
 */
export const calculateAspectRatio = (width, height) => {
    if (!width || !height) return '66.67%'; // Default 3:2
    return ((height / width) * 100).toFixed(2) + '%';
};

/**
 * Get inline style for aspect ratio container
 * Usage: <div style={getAspectRatioStyle(width, height)}>
 * 
 * @param {Number} width - Image width
 * @param {Number} height - Image height
 * @returns {Object} - CSS style object
 */
export const getAspectRatioStyle = (width, height) => {
    const paddingBottom = calculateAspectRatio(width, height);
    return {
        position: 'relative',
        paddingBottom,
        height: 0,
        overflow: 'hidden',
    };
};

/**
 * Get inner image style for aspect ratio container
 * Usage: <img style={getImageInnerStyle()} />
 * 
 * @returns {Object} - CSS style object
 */
export const getImageInnerStyle = () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

/**
 * Calculate safe space for dynamic content
 * Prevents shift when content appears
 * 
 * @param {Number} minHeight - Minimum expected height
 * @param {Number} maxHeight - Maximum expected height
 * @returns {Object} - CSS style object
 */
export const getDynamicContentStyle = (minHeight = '100px', maxHeight = 'none') => ({
    minHeight,
    maxHeight,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
});

/**
 * Stabilize font loading to prevent FOIT/FOUT
 * Inject optimal font-display strategies in CSS
 * 
 * @returns {String} - CSS string
 */
export const getFontDisplayCSS = () => `
  /* System fonts with swap to prevent FOIT */
  @font-face {
    font-family: 'System';
    src: local('-apple-system'), local('BlinkMacSystemFont'), 
         local('Segoe UI'), local('Roboto'), local('Oxygen');
    font-display: swap;
  }

  /* Web fonts with optimal display strategy */
  @font-face {
    font-family: 'CustomFont';
    font-display: swap;
  }

  /* Fallback font during loading */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 Oxygen, Ubuntu, Cantarell, sans-serif;
    font-display: swap;
  }
`;

/**
 * Reserve space for skeleton/placeholder
 * Prevents shift when actual content loads
 * 
 * @param {Number} height - Expected content height
 * @param {Boolean} hasImage - Whether content includes image
 * @returns {Object} - CSS style object
 */
export const getPlaceholderStyle = (height = '200px', hasImage = false) => ({
    minHeight: height,
    backgroundColor: '#f0f0f0',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    borderRadius: hasImage ? 0 : '8px',
});

/**
 * Safe DOM insertion to prevent layout shifts
 * Uses requestAnimationFrame to batch updates
 * 
 * @param {Element} container - DOM element to insert into
 * @param {HTMLElement} element - Element to insert
 * @param {Boolean} replace - Whether to replace content
 */
export const safeInsertDOM = (container, element, replace = false) => {
    if (!container) return;

    requestAnimationFrame(() => {
        try {
            if (replace) {
                container.innerHTML = '';
            }
            container.appendChild(element);
        } catch (error) {
            console.error('Error inserting DOM:', error);
        }
    });
};

/**
 * Batch multiple DOM insertions
 * Prevents cumulative layout shifts
 * 
 * @param {Element} container - Container element
 * @param {Array} elements - Array of elements to insert
 */
export const batchInsertDOM = (container, elements) => {
    if (!container || !elements.length) return;

    requestAnimationFrame(() => {
        const fragment = document.createDocumentFragment();
        elements.forEach((el) => {
            if (el instanceof HTMLElement) {
                fragment.appendChild(el);
            }
        });

        try {
            container.appendChild(fragment);
        } catch (error) {
            console.error('Error batch inserting DOM:', error);
        }
    });
};

/**
 * Monitor and report layout shifts
 * For development and debugging
 * 
 * @param {Function} callback - Called with shift value
 */
export const monitorLayoutShift = (callback) => {
    if (!('PerformanceObserver' in window)) return;

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.hadRecentInput) continue; // Ignore user-initiated shifts

                const shift = {
                    value: entry.value,
                    sources: entry.sources.map((s) => ({
                        node: s.node,
                        previousRect: s.previousRect,
                        currentRect: s.currentRect,
                    })),
                };

                if (callback) {
                    callback(shift);
                }

                if (process.env.NODE_ENV === 'development') {
                    console.warn('[CLS] Layout shift detected:', shift.value);
                }
            }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        return () => observer.disconnect();
    } catch (error) {
        console.warn('Layout shift observer not supported:', error.message);
    }
};

/**
 * Prevent shift from fixed/sticky positioned elements
 * Reserve space above content
 * 
 * @param {Number} height - Height of fixed element
 * @returns {Object} - CSS style object for spacer
 */
export const getFixedElementSpacer = (height = '64px') => ({
    height,
    flexShrink: 0,
});

/**
 * Animate content entrance without layout shift
 * Uses transform for smooth, shift-free animation
 * 
 * @param {Number} duration - Animation duration in ms
 * @returns {String} - Animation keyframe CSS
 */
export const getNoShiftAnimation = (duration = 300) => `
  @keyframes slideInNoShift {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-in-no-shift {
    animation: slideInNoShift ${duration}ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

/**
 * Create modal overlay without layout shift
 * Prevents body scroll shift and maintains layout
 * 
 * @returns {Object} - CSS style object
 */
export const getModalOverlayStyle = () => ({
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    overscrollBehavior: 'contain',
});

let cachedScrollbarWidth = null;

const getScrollbarWidth = () => {
    if (cachedScrollbarWidth !== null) return cachedScrollbarWidth;
    if (typeof window === 'undefined') return 0;
    const doc = document.documentElement;
    cachedScrollbarWidth = Math.max(0, window.innerWidth - doc.clientWidth);
    return cachedScrollbarWidth;
};

/**
 * Get body style for modal open (prevents scroll shift)
 * Apply to body when modal opens
 * 
 * @returns {Object} - CSS style object
 */
export const getBodyModalOpenStyle = () => ({
    overflow: 'hidden',
    paddingRight: `${getScrollbarWidth()}px`,
});

const clsPreventions = {
    calculateAspectRatio,
    getAspectRatioStyle,
    getImageInnerStyle,
    getDynamicContentStyle,
    getFontDisplayCSS,
    getPlaceholderStyle,
    safeInsertDOM,
    batchInsertDOM,
    monitorLayoutShift,
    getFixedElementSpacer,
    getNoShiftAnimation,
    getModalOverlayStyle,
    getBodyModalOpenStyle,
};

export default clsPreventions;
