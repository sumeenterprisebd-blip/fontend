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
  const selectedTierLabel = activeTier
    ? `${activeTier.minQty}${activeTier.maxQty ? `–${activeTier.maxQty}` : '+'} units`
    : 'Standard price';
  const selectedTierBadge = activeTier
    ? activeTier.minQty === tierList[0]?.minQty
      ? 'Popular'
      : activeTier.minQty === tierList[featuredTierIndex]?.minQty
      ? 'Best value'
      : 'Selected'
    : null;

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
        <div className="mb-5 rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <label htmlFor="product-quantity" className="text-sm font-medium text-slate-600">Qty</label>
              <input
                id="product-quantity"
                type="number"
                value={quantity}
                min={1}
                max={maxQuantity}
                onChange={(event) => handleQuantityInput(event.target.value)}
                className="w-20 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-right text-base font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid gap-4 grid-flow-col auto-cols-[minmax(280px,1fr)] sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 xl:grid-cols-3">
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
                const savingsPerUnit = basePrice > tier.price ? basePrice - tier.price : 0;
                return (
                  <button
                    type="button"
                    key={`${tier.minQty}-${tier.maxQty ?? 'null'}-${index}`}
                    onClick={() => handleTierSelect(tier)}
                    aria-pressed={isActive}
                    className={`min-w-[280px] flex-shrink-0 sm:min-w-0 ${isActive ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'} flex min-h-[220px] flex-col justify-between rounded-[28px] border p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/25`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                          </div>
                          <div className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">Unit price</div>
                        </div>
                        {badgeLabel && (
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                            {badgeLabel}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-slate-900">৳{tier.price.toFixed(2)}</div>
                      {savingsPerUnit > 0 && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                          Save ৳{savingsPerUnit.toFixed(2)} each
                        </div>
                      )}
                    </div>
                    <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
                      {isActive ? 'Selected tier' : 'Tap to select this tier'}
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