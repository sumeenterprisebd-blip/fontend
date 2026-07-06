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
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 border border-gray-100">
        <div className="mb-5 rounded-[26px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Buy by quantity</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Choose the best price tier</h2>
            </div>
            <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <label htmlFor="product-quantity" className="text-sm font-medium text-slate-700">Quantity</label>
              <input
                id="product-quantity"
                type="number"
                value={quantity}
                min={1}
                max={maxQuantity}
                onChange={(event) => handleQuantityInput(event.target.value)}
                className="w-[88px] rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-base font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Select a pricing tier or enter a custom quantity. The price will update automatically based on the correct tier.
          </p>
        </div>

        <div className="mb-6 rounded-[28px] border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 shadow-sm transition-all duration-300">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Quantity-Based Pricing</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Save more as you buy more</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                The price updates automatically when you change the product quantity. Pick the quantity that fits your order and see the best tier instantly.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-1">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Unit price</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">৳{pricingSummary.effectiveUnitPrice.toFixed(2)}</div>
                {pricingSummary.appliedTier ? (
                  <div className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    Active tier • {pricingSummary.appliedTier.minQty}{pricingSummary.appliedTier.maxQty ? `–${pricingSummary.appliedTier.maxQty}` : '+'}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-slate-500">Regular price is being used</div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Total</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">৳{pricingSummary.totalPrice.toFixed(2)}</div>
                <div className="mt-2 text-sm text-slate-600">For {pricingSummary.quantity} item{pricingSummary.quantity > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5">
              <p className="font-semibold text-slate-900">Current unit price</p>
              <p className="mt-2 text-lg font-bold text-slate-900">৳{pricingSummary.effectiveUnitPrice.toFixed(2)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5">
              <p className="font-semibold text-slate-900">Original price</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {product.originalPrice && product.originalPrice > basePrice ? (
                  <span className="line-through text-slate-500">৳{product.originalPrice.toFixed(2)}</span>
                ) : (
                  `৳${basePrice.toFixed(2)}`
                )}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5">
              <p className="font-semibold text-slate-900">Discount</p>
              <p className="mt-2 text-lg font-bold text-slate-900">৳{pricingSummary.savings.toFixed(2)}</p>
              <p className="mt-1 text-sm text-slate-500">{pricingSummary.discountPercent}% saved</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5">
              <p className="font-semibold text-slate-900">Customer savings</p>
              <p className="mt-2 text-lg font-bold text-slate-900">৳{pricingSummary.savings.toFixed(2)}</p>
              <p className="mt-1 text-sm text-slate-500">Compared to regular unit price</p>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
            {tierList.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {tierList.map((tier, index) => {
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
                      className={`group overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-300 ${isActive ? 'border-emerald-500 bg-emerald-50 shadow-[0_15px_45px_rgba(16,185,129,0.12)]' : 'border-slate-200 bg-slate-50 hover:border-slate-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                          </div>
                          <div className="mt-1 text-xs text-slate-500">Unit price</div>
                        </div>
                        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          ৳{tier.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="text-sm text-slate-600">
                          {isActive ? 'Current selection' : 'Tier price'}
                        </div>
                        {badgeLabel && (
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                            {badgeLabel}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                This product has no quantity-based pricing. The regular price applies for every quantity.
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