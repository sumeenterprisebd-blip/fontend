import { AVAILABLE_COLORS } from './constants';
import CustomColorForm from './CustomColorForm';
import SelectedColorsList from './SelectedColorsList';

export default function ProductFormColors({ formData, onToggleColor, onAddCustomColor, onRemoveColor }) {
  const isColorSelected = (colorName) => {
    return formData.colors.some(c =>
      (typeof c === 'string' ? c : c.name) === colorName
    );
  };

  const handleAddCustomColor = (newColor) => {
    const colorExists = formData.colors.some(
      c => (typeof c === 'string' ? c : c.name).toLowerCase() === newColor.name.toLowerCase()
    );

    if (colorExists) {
      return { error: 'This color already exists' };
    }

    if (onAddCustomColor) {
      onAddCustomColor(newColor);
    }
    return { success: true };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
        Colors <span className="text-red-500">*</span>
      </h3>

      <SelectedColorsList
        colors={formData.colors}
        onRemoveColor={onRemoveColor}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Predefined Colors</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => onToggleColor(color)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${isColorSelected(color)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <CustomColorForm onAddCustomColor={handleAddCustomColor} />

      {formData.colors.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one color</p>
      )}
    </div>
  );
}
