// Category & review display removed from price section per request
import { getPricingTierSummary } from '@/utils/pricingTiers';

export default function ProductInfo({ product }) {
  if (!product) return null;

  const pricingSummary = getPricingTierSummary(product, 1);

  const discountPercent = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;
  const savingsAmount = product.originalPrice && product.price < product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:p-8 border border-gray-100">
      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Category and reviews removed from price section per user request */}

      {/* Pricing */}
      <div className="mb-0 rounded-2xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm text-gray-600">Price</div>

              <div className="mt-1 flex items-end gap-3 flex-wrap">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
                  ৳{pricingSummary.effectiveUnitPrice.toFixed(2)}
                </div>

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base text-gray-500 line-through">
                      ৳{product.originalPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="inline-flex items-center rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-gray-900">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {savingsAmount > 0 && (
                <div className="mt-2 inline-flex items-center rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700">
                  You save <span className="ml-1 font-semibold text-gray-900">৳{savingsAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Combo Offer Information */}
          {product.comboOffer && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
                    <span>🔥</span>
                    <span>Combo Offer</span>
                  </div>

                  <div className="mt-2 space-y-1.5 text-sm text-gray-800">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">💸</span>
                      <span>
                        Save up to <span className="font-semibold text-gray-900">{product.comboOffer?.maxDiscount ?? 0}%</span>
                      </span>
                    </div>

                    {product.freeDeliveryMinQty && product.freeDeliveryMinQty > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5">🎁</span>
                        <span>
                          <span className="font-semibold text-gray-900">{product.freeDeliveryMinQty}+</span> pcs = Free Delivery
                        </span>
                      </div>
                    )}
                  </div>

                  {product.comboOffer.description && (
                    <div className="mt-2 text-xs text-gray-600">{product.comboOffer.description}</div>
                  )}
                </div>

                <div className="shrink-0 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-gray-900">
                  Up to {product.comboOffer?.maxDiscount ?? 0}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {Array.isArray(product.pricingTiers) && product.pricingTiers.length > 0 && (
        <div className="mb-3 lg:mb-4 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">Quantity-based pricing</div>
              <div className="text-sm text-gray-600">Choose higher quantities to unlock better wholesale tiers.</div>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {product.pricingTiers
              .slice()
              .sort((a, b) => Number(a.minQty) - Number(b.minQty))
              .map((tier, index) => (
                <div key={`${tier.minQty}-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                  </div>
                  <div className="mt-1 text-sm text-gray-700">৳{Number(tier.price).toFixed(2)} each</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Stock Status: show low-stock warning or out-of-stock only */}
      {product.stock !== undefined && (
        <div className="mb-3 lg:mb-4">
          {product.stock > 0 && product.stock < 10 ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-orange-700">⚡ Only {product.stock} left - Order soon!</span>
            </div>
          ) : product.stock === 0 ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Out of Stock</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

