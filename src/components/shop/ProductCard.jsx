import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from '@react-icons/all-files/fi/FiArrowRight';

function ProductCard({ product, onAddToCart }) {
  void onAddToCart;

  // Use slug or _id for product link
  const productLink = product.slug
    ? `/product/${product.slug}`
    : product.link || `/product/${product._id || product.id}`;

  const categoryName = typeof product.category === 'string'
    ? product.category
    : product.category?.name || product.category?.title || '';

  const categorySlug = typeof product.category === 'string'
    ? product.category
    : product.category?.slug || product.category?.name || product.category?.title || '';

  // Get first image or fallback
  const productImage = (product.images && product.images[0])
    ? product.images[0]
    : product.image || '/logo.jpeg';

  // Calculate discount percentage if originalPrice exists
  const discountPercent = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  const colors = Array.isArray(product.colors) ? product.colors : [];
  const colorBadges = colors.slice(0, 3).map((c) => (typeof c === 'string' ? c : c?.name)).filter(Boolean);
  const ratingValue = Number(product.rating || 0);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 h-full flex flex-col shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.1)]">
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Link href={productLink}>
          <Image
            src={productImage}
            alt={product.name}
            width={400}
            height={400}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={82}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/logo.jpeg';
            }}
          />
        </Link>

        {ratingValue > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold text-gray-800">
            <span className="text-yellow-500">★</span>
            <span>{ratingValue.toFixed(1)}</span>
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-black/85 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10 backdrop-blur">
            -{discountPercent}%
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-black leading-tight text-gray-900">৳{product.price?.toFixed(2) || '0.00'}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-gray-500 line-through">৳{product.originalPrice.toFixed(2)}</p>
          )}
        </div>

        <Link href={productLink}>
          <h3 className="text-base font-semibold text-black leading-snug group-hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {categoryName && (
          <Link
            href={`/shop?category=${encodeURIComponent(categorySlug)}`}
            className="text-xs font-medium text-gray-500 hover:text-black"
          >
            {categoryName}
          </Link>
        )}

        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600">
          {colorBadges.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Colors:</span>
              <div className="flex gap-1">
                {colorBadges.map((c, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {c}
                  </span>
                ))}
                {colors.length > colorBadges.length && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{colors.length - colorBadges.length}</span>
                )}
              </div>
            </div>
          )}
          {product.stock !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left` : 'In stock') : 'Out of stock'}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={productLink}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white text-sm font-semibold py-3 transition-all hover:bg-gray-800 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            Order Now
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
