import { useMemo, useState, useEffect } from 'react';
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

  // Initialize state when product loads
  useEffect(() => {
    if (!product) return;
    setQuantity(1);
  }, [product]);

  const handleTierSelect = (tier) => {
    if (!tier) return;
    const targetQuantity = tier.minQty;
    setQuantity(Math.min(Math.max(1, targetQuantity), maxQuantity));
  };

  const handleQuantityInput = (value) => {
    const parsed = Number(value);
    const safeQuantity = Number.isFinite(parsed) && parsed >= 1 ? Math.min(Math.max(1, Math.floor(parsed)), maxQuantity) : 1;
    setQuantity(safeQuantity);
  };

  const activeTier = pricingSummary.appliedTier;
  const featuredTierIndex = tierList.length > 0 ? tierList.length - 1 : 0;

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
      <div className="bg-white rounded-[32px] shadow-sm p-5 sm:p-6 lg:p-8 border border-slate-200">
        <div className="mb-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold leading-tight text-slate-900">Choose the best price tier</h2>
            </div>
            <div className="flex flex-col gap-2 rounded-[28px] border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center">
              <label htmlFor="product-quantity" className="text-sm font-medium text-slate-700">Quantity</label>
              <input
                id="product-quantity"
                type="number"
                value={quantity}
                min={1}
                max={maxQuantity}
                onChange={(event) => handleQuantityInput(event.target.value)}
                className="w-20 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-base font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tierList.length > 0 ? (
            tierList.map((tier, index) => {
              const isActive = activeTier?.minQty === tier.minQty && activeTier?.maxQty === tier.maxQty;
              const badgeLabel = isActive
                ? 'Active tier'
                : index === 0
                ? 'Popular'
                : index === featuredTierIndex
                ? 'Best value'
                : null;
              return (
                <button
                  type="button"
                  key={`${tier.minQty}-${tier.maxQty ?? 'null'}-${index}`}
                  onClick={() => handleTierSelect(tier)}
                  aria-pressed={isActive}
                  className={`group w-full rounded-[28px] border p-5 text-left transition-all duration-200 ${isActive ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'} focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Unit price</div>
                      </div>
                      <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                        ৳{tier.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{isActive ? 'Selected tier' : 'Tier price'}</p>
                        <p className="text-xs text-slate-500">{tier.minQty} {tier.maxQty ? `to ${tier.maxQty}` : 'or more'} units</p>
                      </div>
                      {badgeLabel && (
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                          {badgeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
              This product has no tiered pricing. The regular price applies for every quantity.
            </div>
          )}
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