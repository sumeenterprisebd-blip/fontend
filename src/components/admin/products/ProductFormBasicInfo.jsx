import { useState, useEffect } from 'react';
import { DRESS_STYLES } from './constants';
import { useCategories } from '@/hooks/useCategories';
import CategorySelector from './CategorySelector';
import MeasurementSelector from './MeasurementSelector';

export default function ProductFormBasicInfo({
  formData,
  onChange,
  measurements,
  measurementsLoading,
  refreshMeasurements,
  onAddCategory,
}) {
  const { categories: initialCategories, loading: categoriesLoading } = useCategories();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleCategoryChange = (categoryName, newCategory) => {
    if (newCategory) {
      setCategories((prev) => [
        ...prev,
        {
          id: newCategory._id,
          name: newCategory.name,
          count: 0,
        },
      ]);
    }
    onChange('category', categoryName);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <CategorySelector
            categories={categories}
            selectedCategory={formData.category}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Measurement Categories
          </label>
          <MeasurementSelector
            measurements={measurements}
            selectedMeasurements={Array.isArray(formData.measurements) ? formData.measurements.map((item) => String(item.category)) : []}
            onMeasurementsChange={(measurementIds, newMeasurement) => {
              const existingGroups = Array.isArray(formData.measurements) ? formData.measurements : [];

              const nextGroups = measurementIds.map((measurementId) => {
                const existing = existingGroups.find((group) => String(group.category) === String(measurementId));
                return existing || { category: measurementId, sizes: [] };
              });

              if (newMeasurement && newMeasurement._id) {
                const newId = String(newMeasurement._id);
                if (!measurementIds.includes(newId)) {
                  nextGroups.push({ category: newId, sizes: [] });
                }
                if (typeof refreshMeasurements === 'function') {
                  refreshMeasurements();
                }
              }

              onChange('measurements', nextGroups);
            }}
            loading={measurementsLoading}
            onRefreshMeasurements={refreshMeasurements}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dress Style</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.dressStyle}
            onChange={(e) => onChange('dressStyle', e.target.value)}
          >
            {DRESS_STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>
    </div>
  );
}
