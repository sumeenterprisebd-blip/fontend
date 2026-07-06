import { useMemo } from 'react';

export default function ProductFormPricing({ formData, onChange }) {
  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
  };

  const price = toNumber(formData.price);
  const original = toNumber(formData.originalPrice);

  const discountPercent =
    Number.isFinite(price) && price > 0 && Number.isFinite(original) && original > price
      ? Math.round(((original - price) / original) * 100)
      : 0;

  const pricingTiers = Array.isArray(formData.pricingTiers) ? formData.pricingTiers : [];

  const handleTierChange = (index, field, value) => {
    const nextTiers = [...pricingTiers];
    nextTiers[index] = { ...nextTiers[index], [field]: value };
    onChange('pricingTiers', nextTiers);
  };

  const addTier = () => {
    const nextTiers = [...pricingTiers, { minQty: '', maxQty: '', price: '' }];
    onChange('pricingTiers', nextTiers);
  };

  const removeTier = (index) => {
    const nextTiers = pricingTiers.filter((_, tierIndex) => tierIndex !== index);
    onChange('pricingTiers', nextTiers);
  };

  const tierPreview = useMemo(() => {
    return pricingTiers
      .filter((tier) => Number.isFinite(Number(tier.minQty)) && Number(tier.minQty) > 0 && Number.isFinite(Number(tier.price)))
      .sort((a, b) => Number(a.minQty) - Number(b.minQty));
  }, [pricingTiers]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">৳</span>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => onChange('price', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">৳</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={formData.originalPrice}
              onChange={(e) => onChange('originalPrice', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              tabIndex={-1}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-semibold"
              value={Number.isFinite(discountPercent) ? String(discountPercent) : '0'}
              aria-label="Discount percentage (auto calculated)"
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Auto-calculated from Price and Original Price.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Quantity-based pricing tiers</h4>
            <p className="text-sm text-gray-600">Create rules like 1–29 regular, 30–49 wholesale, and 100+ bulk pricing.</p>
          </div>
          <button
            type="button"
            onClick={addTier}
            className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Add tier
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {pricingTiers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-600">
              No tiers yet. Add a rule to let customers see discounted wholesale pricing at higher quantities.
            </div>
          ) : (
            pricingTiers.map((tier, index) => (
              <div key={`${tier.minQty}-${index}`} className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Min qty</label>
                    <input
                      type="number"
                      min="1"
                      value={tier.minQty ?? ''}
                      onChange={(e) => handleTierChange(index, 'minQty', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Max qty</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={tier.maxQty ?? ''}
                      onChange={(e) => handleTierChange(index, 'maxQty', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">৳</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tier.price ?? ''}
                        onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeTier(index)}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {tierPreview.length > 0 && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50/70 p-3 text-sm text-gray-700">
            <div className="font-semibold text-gray-900">Preview</div>
            <div className="mt-2 space-y-1">
              {tierPreview.map((tier) => (
                <div key={`${tier.minQty}-${tier.maxQty}`}>
                  {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units → ৳{Number(tier.price).toFixed(2)} each
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

