import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ProductImageGallery({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const productImages = useMemo(() => {
    if (!product) return ['/logo.jpeg'];

    // Use product.images array if available, otherwise use product.image
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    // Fallback to single image
    if (product.image) {
      return [product.image];
    }

    // Default fallback
    return ['/logo.jpeg'];
  }, [product]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  if (!product) return null;

  const currentImage = productImages[selectedImageIndex] || productImages[0] || '/logo.jpeg';

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 40;

    if (Math.abs(deltaX) < threshold) return;
    if (deltaX > 0) {
      setSelectedImageIndex((prev) => Math.min(prev + 1, productImages.length - 1));
    } else {
      setSelectedImageIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 items-stretch lg:items-start">
      {/* Thumbnails - vertical on desktop, horizontal on mobile */}
      {productImages.length > 1 && (
        <div className="flex w-full lg:w-auto lg:flex-col gap-2 lg:gap-4 order-2 lg:order-1">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-16 h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                ? 'border-primary shadow-lg'
                : 'border-gray-200 hover:border-gray-400'
                }`}
              style={{ boxShadow: selectedImageIndex === index ? '0 4px 16px 0 rgba(0,0,0,0.08)' : undefined }}
            >
              <Image
                src={image}
                alt={`${product.name} view ${index + 1}`}
                width={112}
                height={112}
                sizes="112px"
                quality={85}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Product Image - larger, premium look, with discount badge */}
      <div className="w-full flex-1 order-1 lg:order-2">
        <div
          className="relative w-full aspect-square bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-xl flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {product.discount && product.originalPrice && (
            <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
              {product.discount}% OFF
            </span>
          )}
          <Image
            src={currentImage}
            alt={product.name}
            width={900}
            height={900}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px"
            quality={95}
            priority
            className="w-full h-full object-contain transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/logo.jpeg';
            }}
          />
        </div>
      </div>

      {/* Zoom removed by request */}
    </div>
  );
}

