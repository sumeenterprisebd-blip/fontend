export default function ProductFormInventory({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Inventory</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          required
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0"
          value={formData.stock}
          onChange={(e) => onChange('stock', e.target.value)}
        />
      </div>
    </div>
  );
}

