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
    </div>
  );
}

