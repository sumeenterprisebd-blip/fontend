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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {product.category && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{typeof product.category === 'string' ? product.category : product.category?.name}</span>}
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{product.brand || 'Sume Traders'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 leading-tight tracking-tight">
            {product.name}
          </h1>

          {product.shortDescription ? (
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{product.shortDescription}</p>
          ) : (
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">Fast delivery available. Tiered pricing updates automatically when you change quantity.</p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current price</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 leading-none">৳{pricingSummary.effectiveUnitPrice.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-500 line-through">৳{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {savingsAmount > 0 && (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                You save <span className="font-semibold text-slate-900">৳{savingsAmount.toFixed(2)}</span> on this item.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 text-sm text-slate-500">
              <span>Availability</span>
              <span className={`rounded-full px-3 py-1 font-semibold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                {product.stock > 0 ? 'In stock' : 'Sold out'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>Minimum order</span>
                <span className="font-semibold text-slate-900">1 unit</span>
              </div>

              {product.stock > 0 && product.stock < 10 ? (
                <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-900 border border-amber-100">
                  Only {product.stock} left – order now.
                </div>
              ) : product.stock === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700 border border-slate-200">
                  This product is currently unavailable.
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700 border border-slate-200">
                  Ready to ship in 1-2 business days.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

