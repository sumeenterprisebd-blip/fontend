import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/utils/imageOptimization';

/**
 * OptimizedImage Component
 * A wrapper around Next.js Image that automatically applies image optimizations
 * for Cloudinary and other sources
 */
export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    sizes,
    quality = 85,
    priority = false,
    className = '',
    onError,
    cloudinaryOptions = {},
    ...props
}) {
    // Optimize Cloudinary URLs
    const optimizedSrc = src?.includes('cloudinary.com')
        ? optimizeCloudinaryUrl(src, {
            quality: 'auto:good',
            format: 'auto',
            ...cloudinaryOptions,
        })
        : src;

    return (
        <Image
            src={optimizedSrc || '/logo.jpeg'}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            quality={quality}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            onError={onError || ((e) => {
                e.target.src = '/logo.jpeg';
            })}
            {...props}
        />
    );
}

/**
 * ProductImage - Optimized image for product cards
 */
export function ProductImage({ product, priority = false, ...props }) {
    const productImage = (product.images && product.images[0])
        ? product.images[0]
        : product.image || '/logo.jpeg';

    return (
        <OptimizedImage
            src={productImage}
            alt={product.name}
            width={400}
            height={400}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={85}
            priority={priority}
            cloudinaryOptions={{
                width: 'auto',
                crop: 'fill',
                gravity: 'auto',
            }}
            {...props}
        />
    );
}

/**
 * HeroImage - Optimized image for hero sections
 */
export function HeroImage({ src, alt, priority = true, ...props }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            sizes="100vw"
            quality={90}
            priority={priority}
            cloudinaryOptions={{
                width: 'auto',
                crop: 'fill',
            }}
            {...props}
        />
    );
}

/**
 * ThumbnailImage - Optimized image for thumbnails
 */
export function ThumbnailImage({ src, alt, size = 96, ...props }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            sizes={`${size}px`}
            quality={80}
            cloudinaryOptions={{
                width: size * 2, // Account for retina displays
                crop: 'fill',
            }}
            {...props}
        />
    );
}
