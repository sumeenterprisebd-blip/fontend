import { AVAILABLE_SIZES } from './constants';

export default function ProductFormSizes({ formData, onToggleSize }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Sizes <span className="text-red-500">*</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SIZES.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => onToggleSize(size)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              formData.sizes.includes(size)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {formData.sizes.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one size</p>
      )}
    </div>
  );
}

