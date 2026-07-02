/**
 * Image Optimization Utilities
 * Provides functions to optimize images from various sources (Cloudinary, Facebook, etc.)
 */

/**
 * Optimizes Cloudinary image URLs with responsive transformations
 * @param {string} url - The Cloudinary image URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 'auto',
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    fetchFormat = 'auto',
    dpr = 'auto',
  } = options;

  // Some crops either ignore gravity or can error with certain gravity values.
  // Keep transformations valid and broadly compatible.
  const gravitySupportedCrops = new Set([
    'fill',
    'crop',
    'thumb',
    'lfill',
    'fill_pad',
    'pad',
    'mpad',
  ]);
  const shouldIncludeGravity = gravity && gravity !== 'auto' ? gravitySupportedCrops.has(crop) : gravitySupportedCrops.has(crop);

  // Split URL at /upload/ to insert transformations
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const baseUrl = url.substring(0, uploadIndex + 8); // Include '/upload/'
  const imagePath = url.substring(uploadIndex + 8);

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    shouldIncludeGravity ? `g_${gravity}` : null,
    fetchFormat !== 'auto' ? `fetch_format_${fetchFormat}` : null,
    dpr === 'auto' ? 'dpr_auto' : (dpr ? `dpr_${dpr}` : null),
  ].filter(Boolean).join(',');

  return `${baseUrl}${transformations}/${imagePath}`;
}

/**
 * Gets responsive Cloudinary URLs for different breakpoints
 * @param {string} url - The Cloudinary image URL
 * @returns {object} - Object with URLs for different sizes
 */
export function getResponsiveCloudinaryUrls(url) {
  if (!url || !url.includes('cloudinary.com')) {
    return { default: url };
  }

  return {
    small: optimizeCloudinaryUrl(url, { width: 384, quality: 'auto:good' }),
    medium: optimizeCloudinaryUrl(url, { width: 640, quality: 'auto:good' }),
    large: optimizeCloudinaryUrl(url, { width: 828, quality: 'auto:good' }),
    xlarge: optimizeCloudinaryUrl(url, { width: 1080, quality: 'auto:best' }),
    default: url,
  };
}

/**
 * Optimizes Facebook image URLs for better performance
 * @param {string} url - The Facebook image URL
 * @param {object} options - Optimization options
 * @returns {string} - Optimized Facebook URL
 */
export function optimizeFacebookImageUrl(url, options = {}) {
  if (!url || !url.includes('fbcdn.net')) {
    return url;
  }

  const { width, height } = options;

  // Facebook images can be optimized using stp parameter
  try {
    const urlObj = new URL(url);
    const currentStp = urlObj.searchParams.get('stp');

    // Build optimization parameters
    const stpParams = [];

    if (width && height) {
      stpParams.push(`c0.${width}.${height}.${width}.${height}`);
    }

    // Request progressive JPEG
    stpParams.push('dst-jpg');

    // Set quality
    stpParams.push('q85');

    if (stpParams.length > 0) {
      const newStp = currentStp
        ? `${currentStp}_${stpParams.join('_')}`
        : stpParams.join('_');
      urlObj.searchParams.set('stp', newStp);
    }

    return urlObj.toString();
  } catch (error) {
    console.error('Error optimizing Facebook URL:', error);
    return url;
  }
}

/**
 * Gets the optimal image format based on browser support
 * @returns {string} - Preferred image format
 */
export function getOptimalImageFormat() {
  if (typeof window === 'undefined') return 'webp';

  // Check for AVIF support
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }

  // Check for WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }

  return 'jpg';
}

/**
 * Preloads critical images for better LCP
 * @param {string[]} urls - Array of image URLs to preload
 */
export function preloadImages(urls) {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}

/**
 * Generates srcset for responsive images
 * @param {string} url - Base image URL
 * @param {number[]} widths - Array of widths for srcset
 * @returns {string} - srcset string
 */
export function generateSrcSet(url, widths = [320, 640, 768, 1024, 1280]) {
  if (!url) return '';

  if (url.includes('cloudinary.com')) {
    return widths
      .map(width => `${optimizeCloudinaryUrl(url, { width })} ${width}w`)
      .join(', ');
  }

  return '';
}

/**
 * Gets optimal image dimensions based on container and DPR
 * @param {number} containerWidth - Container width in pixels
 * @param {number} dpr - Device pixel ratio
 * @returns {number} - Optimal image width
 */
export function getOptimalImageWidth(containerWidth, dpr = 1) {
  // Round up to nearest standard size
  const standardSizes = [320, 384, 640, 750, 828, 1080, 1200, 1920];
  const targetWidth = containerWidth * dpr;

  return standardSizes.find(size => size >= targetWidth) || standardSizes[standardSizes.length - 1];
}


const imageOptimizationUtils = {
  optimizeCloudinaryUrl,
  getResponsiveCloudinaryUrls,
  optimizeFacebookImageUrl,
  getOptimalImageFormat,
  preloadImages,
  generateSrcSet,
  getOptimalImageWidth,
};

export default imageOptimizationUtils;
