import { useState, useEffect } from 'react';
import ComboOfferDisplay from './ComboOfferDisplay';
import QuantitySelector from './QuantitySelector';
import { trackEvent } from '@/utils/analytics';

export default function ProductOptions({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product?.stock || 999;
  const basePrice = Number(product?.price || 0);
  const hasOriginalDiscount = product?.originalPrice && product.originalPrice > basePrice;
  const discountFromOriginal = hasOriginalDiscount
    ? Math.round(((product.originalPrice - basePrice) / product.originalPrice) * 100)
    : 0;
  const discountPercent = hasOriginalDiscount ? discountFromOriginal : (product?.discount || 0);

  // Initialize state when product loads
  useEffect(() => {
    if (!product) return;
    setQuantity(1);
  }, [product]);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      alert('This product is out of stock');
      return;
    }

    // Use server-provided price as source of truth; derive discount for display only
    const basePrice = Number(product.price || 0);
    const hasOriginalDiscount = product.originalPrice && product.originalPrice > basePrice;
    const discountFromOriginal = hasOriginalDiscount
      ? Math.round(((product.originalPrice - basePrice) / product.originalPrice) * 100)
      : 0;
    const discountPercent = hasOriginalDiscount ? discountFromOriginal : (product.discount || 0);
    const effectivePrice = Number(basePrice.toFixed(2));

    const cartData = {
      productId: product._id || product.id,
      name: product.name,
      price: effectivePrice,
      originalPrice: product.originalPrice || null,
      discountPercent,
      image: product.images?.[0] || product.image,
      quantity,
      slug: product.slug,
    };

    try {
      trackEvent('AddToCartButtonClick', {
        category: 'ecommerce',
        content_type: 'product',
        content_id: String(cartData.productId),
        content_name: cartData.name,
        value: Number(cartData.price || 0),
        currency: 'BDT',
        quantity: Number(cartData.quantity || 1),
      });
    } catch {
      // ignore
    }

    // Debug log for troubleshooting
    // eslint-disable-next-line no-console
    console.log('Add to Cart Data:', cartData);
    onAddToCart(cartData);
  };

  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const isActionDisabled = isOutOfStock;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Lowest Combo Offer Display */}
      {/* <ComboOfferDisplay product={product} /> */}

      {/* Product Options Card */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 border border-gray-100">
        <QuantitySelector
          quantity={quantity}
          maxQuantity={maxQuantity}
          onDecrease={handleQuantityDecrease}
          onIncrease={handleQuantityIncrease}
        />

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-disabled={isActionDisabled}
          className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-bold text-base sm:text-lg lg:text-xl tracking-wide
            transition-colors duration-200 shadow-sm
            disabled:cursor-not-allowed
            ${isActionDisabled
              ? 'bg-gray-200 text-gray-500'
              : 'bg-black text-white hover:bg-gray-900 active:bg-black'
            }`}
        >
          <span className="flex items-center justify-center gap-2 sm:gap-3">
            {isOutOfStock ? (
              <>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Out of Stock
              </>
            ) : (
              <>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="tracking-wide">ADD TO CART</span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </span>
        </button>

        <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-900">
          <div className="font-semibold mb-2">📌 গুরুত্বপূর্ণ নোট</div>
          <p className="leading-relaxed">
            প্রিয় ভাই/আপু, অনুগ্রহ করে নিশ্চিত হয়ে অর্ডার করুন। ফেক অর্ডার আমাদের ছোট ব্যবসার জন্য বড় ক্ষতির কারণ হয়। বিশেষ করে COD অর্ডারের ক্ষেত্রে এটি আরও গুরুত্বপূর্ণ।
          </p>
          <p className="mt-3 leading-relaxed">
            যদি কোনো কারণে পণ্য গ্রহণ না করতে চান বা রিটার্ন করতে হয়, তাহলে অনুগ্রহ করে ডেলিভারি ম্যানকে <span className="font-semibold">ডেলিভারি চার্জ প্রদান করে</span> পণ্যটি রিটার্ন করবেন।
          </p>
          <p className="mt-3 font-semibold text-gray-900">
            আপনার আন্তরিক সহযোগিতাই আমাদের এগিয়ে যাওয়ার অনুপ্রেরণা। ❤️
          </p>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              <div className="font-semibold text-gray-900">৳{basePrice.toFixed(2)}</div>
              {hasOriginalDiscount && (
                <div className="text-xs text-gray-500">
                  <span className="line-through">৳{Number(product.originalPrice).toFixed(2)}</span>
                  <span className="ml-2 text-gray-900 font-semibold">-{discountPercent}%</span>
                </div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-disabled={isActionDisabled}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold shadow-sm transition-colors ${isActionDisabled
                ? 'bg-gray-200 text-gray-500'
                : 'bg-black text-white hover:bg-gray-900'
                }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 