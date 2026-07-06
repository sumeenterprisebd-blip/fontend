import { useMemo, useState, useEffect } from 'react';
import QuantitySelector from './QuantitySelector';
import { trackEvent } from '@/utils/analytics';
import { getPricingTierSummary, normalizePricingTiers } from '@/utils/pricingTiers';

export default function ProductOptions({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product?.stock || 999;
  const tierList = useMemo(() => normalizePricingTiers(product?.pricingTiers), [product?.pricingTiers]);
  const pricingSummary = useMemo(() => getPricingTierSummary(product, quantity), [product, quantity]);
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

  const handleQuantityChange = (nextQuantity) => {
    const safeQuantity = Math.min(Math.max(1, Number(nextQuantity) || 1), maxQuantity || 999);
    setQuantity(safeQuantity);
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      alert('This product is out of stock');
      return;
    }

    const effectivePrice = Number(pricingSummary.effectiveUnitPrice.toFixed(2));
    const hasOriginalDiscount = product.originalPrice && product.originalPrice > basePrice;
    const discountFromOriginal = hasOriginalDiscount
      ? Math.round(((product.originalPrice - basePrice) / product.originalPrice) * 100)
      : 0;
    const effectiveDiscountPercent = hasOriginalDiscount ? discountFromOriginal : (product.discount || 0);

    const cartData = {
      productId: product._id || product.id,
      name: product.name,
      price: effectivePrice,
      originalPrice: product.originalPrice || null,
      discountPercent: effectiveDiscountPercent,
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
          onChange={handleQuantityChange}
        />

        <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Live pricing</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">৳{pricingSummary.effectiveUnitPrice.toFixed(2)} / unit</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Total ৳{pricingSummary.totalPrice.toFixed(2)}</p>
              {pricingSummary.savings > 0 ? (
                <p className="text-sm text-green-700">Save ৳{pricingSummary.savings.toFixed(2)} ({pricingSummary.discountPercent}%)</p>
              ) : (
                <p className="text-sm text-gray-500">No quantity discount available.</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tierList.length > 0 ? (
              tierList.map((tier, index) => {
                const isActive = pricingSummary.appliedTier?.minQty === tier.minQty && pricingSummary.appliedTier?.maxQty === tier.maxQty;
                return (
                  <div
                    key={`${tier.minQty}-${tier.maxQty ?? 'null'}-${index}`}
                    className={`rounded-3xl border p-4 transition-all duration-200 ${isActive ? 'border-black bg-black/5 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Unit price</div>
                      </div>
                      <div className={`text-lg font-bold ${isActive ? 'text-black' : 'text-gray-900'}`}>
                        ৳{tier.price.toFixed(2)}
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-xs font-semibold">
                        <span>Selected tier</span>
                      </div>
                    )}
                    {!isActive && pricingSummary.quantity >= tier.minQty && (tier.maxQty === null || pricingSummary.quantity <= tier.maxQty) && (
                      <div className="mt-3 text-sm text-green-700">You qualify for this tier</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-600">
                No quantity discount available.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            {pricingSummary.appliedTier ? (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Applied tier</p>
                <p>
                  Buying <span className="font-semibold">{pricingSummary.quantity}</span> unit{pricingSummary.quantity > 1 ? 's' : ''} gives you the tier price of{' '}
                  <span className="font-semibold">৳{pricingSummary.appliedTier.price.toFixed(2)}</span> each.
                </p>
                <p className="text-sm text-gray-600">
                  Regular per unit price is ৳{pricingSummary.basePrice.toFixed(2)}. You save ৳{pricingSummary.savings.toFixed(2)} on this purchase.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Regular price active</p>
                <p className="text-sm text-gray-600">
                  Quantity-based pricing is not available for this quantity. Increase the quantity to unlock the next tier.
                </p>
              </div>
            )}
          </div>
        </div>

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
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              <div className="font-semibold text-gray-900">৳{pricingSummary.effectiveUnitPrice.toFixed(2)} × {quantity}</div>
              <div className="text-xs text-gray-500">Total ৳{pricingSummary.totalPrice.toFixed(2)}</div>
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