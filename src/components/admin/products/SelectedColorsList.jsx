import { FiX } from 'react-icons/fi';

export default function SelectedColorsList({ colors, onRemoveColor }) {
    const getColorValue = (color) => {
        return typeof color === 'string' ? color : color.name;
    };

    if (colors.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="w-full text-xs font-medium text-gray-600 mb-1">Selected Colors:</p>
            {colors.map((color, index) => {
                const colorValue = getColorValue(color);
                const colorHex = typeof color === 'object' ? color.hex : null;

                return (
                    <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm"
                    >
                        {colorHex && (
                            <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: colorHex }}
                            />
                        )}
                        <span className="font-medium">{colorValue}</span>
                        <button
                            type="button"
                            onClick={() => onRemoveColor(color)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
