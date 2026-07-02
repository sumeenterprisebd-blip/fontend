import Image from 'next/image';
import Link from 'next/link';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const maxQuantity = item.stock || 999;

  // Check if item has invalid size or color
  const hasInvalidOptions = !item.size || !item.color ||
    item.size === '' || item.color === '' ||
    item.size === 'undefined' || item.color === 'undefined';

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < maxQuantity) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const unitPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
  const originalPrice = typeof item.originalPrice === 'number' ? item.originalPrice : Number(item.originalPrice) || null;
  const showOriginal = originalPrice && originalPrice > unitPrice;
  const discountPercent = item.discountPercent || (showOriginal ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) : 0);
  const lineTotal = unitPrice * item.quantity;

  return (
    <div className={`bg-white/95 rounded-2xl p-3 sm:p-6 relative shadow-sm hover:shadow-md transition-all border ${hasInvalidOptions ? 'border-yellow-400 border-2' : 'border-gray-100'}`}>
      {/* Warning Badge for Invalid Options */}
      {hasInvalidOptions && (
        <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 z-10">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Select Options
        </div>
      )}

      <div className="flex gap-3 sm:gap-6">
        {/* Product Image - compact on mobile */}
        <Link href={`/product/${item.productId}`} className="shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              width={128}
              height={128}
              sizes="(max-width: 640px) 96px, 128px"
              quality={80}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-4 min-w-0">
          {/* Header: name + remove */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/product/${item.productId}`} className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-black leading-snug hover:text-gray-700 transition-colors break-words">
                {item.name}
              </h3>
            </Link>

            <button
              onClick={handleRemove}
              className="shrink-0 text-red-600 hover:text-red-700 transition-colors p-2 -mr-1 sm:mr-0 sm:p-2.5 sm:absolute sm:top-4 sm:right-4 z-10"
              aria-label="Remove item"
              type="button"
            >
              <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Options */}
          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
            <p className={hasInvalidOptions && (!item.size || item.size === '' || item.size === 'undefined') ? 'text-yellow-600 font-medium' : ''}>
              Size: {item.size || 'Not selected'}
            </p>
            <p className={hasInvalidOptions && (!item.color || item.color === '' || item.color === 'undefined') ? 'text-yellow-600 font-medium' : ''}>
              Color: {item.color || 'Not selected'}
            </p>
            {hasInvalidOptions && (
              <Link href={`/product/${item.productId}`} className="text-blue-600 hover:underline text-xs font-medium block mt-1">
                → Click to select size & color
              </Link>
            )}
          </div>

          {/* Price and Quantity Row */}
          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base sm:text-lg font-extrabold text-gray-900">৳{unitPrice.toFixed(2)}</p>
                {showOriginal && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">৳{originalPrice.toFixed(2)}</span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[11px] sm:text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Save {discountPercent}%</span>
                )}
              </div>
              <div className="mt-0.5 text-xs sm:text-sm text-gray-600">
                Line total: <span className="font-semibold text-gray-900">৳{lineTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="p-3 text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
                type="button"
              >
                <HiMinus className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-base font-semibold text-black min-w-12 text-center">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={item.quantity >= maxQuantity}
                className="p-3 text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
                type="button"
              >
                <HiPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

