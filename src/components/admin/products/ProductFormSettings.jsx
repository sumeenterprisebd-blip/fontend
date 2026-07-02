export default function ProductFormSettings({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Settings</h3>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            checked={formData.isFeatured}
            onChange={(e) => onChange('isFeatured', e.target.checked)}
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Featured Product</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            checked={formData.isNewArrival}
            onChange={(e) => onChange('isNewArrival', e.target.checked)}
          />
          <span className="ml-2 text-sm font-medium text-gray-700">New Arrivals</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            checked={formData.isActive}
            onChange={(e) => onChange('isActive', e.target.checked)}
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>
    </div>
  );
}

