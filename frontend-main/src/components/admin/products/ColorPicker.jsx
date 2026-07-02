/**
 * ColorPicker Component
 * Color input with native picker and hex input
 */
export default function ColorPicker({ hexCode, onChange, disabled }) {
    const handleHexChange = (e) => {
        let value = e.target.value;
        // Auto-add # if not present
        if (value && !value.startsWith('#')) {
            value = '#' + value;
        }
        // Limit to 7 characters (#RRGGBB)
        if (value.length <= 7) {
            onChange(value.toUpperCase());
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Code <span className="text-gray-500">(Click to pick a color)</span>
            </label>
            <div className="flex gap-3">
                <input
                    type="color"
                    className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
                    value={hexCode}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    disabled={disabled}
                    title="Pick a color"
                />
                <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg transition-all"
                    placeholder="#RRGGBB"
                    value={hexCode}
                    onChange={handleHexChange}
                    disabled={disabled}
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Format: #RRGGBB (e.g., #FF5733) or use the color picker
            </p>
        </div>
    );
}
