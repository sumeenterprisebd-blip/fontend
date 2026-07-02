/**
 * ColorPresets Component
 * Quick color selection grid
 */
export default function ColorPresets({ presets, selectedHex, onSelect, disabled }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select (Optional)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {presets.map((preset) => (
                    <button
                        key={preset.hex}
                        type="button"
                        onClick={() => onSelect(preset)}
                        className="group relative"
                        disabled={disabled}
                        title={`${preset.name} (${preset.hex})`}
                    >
                        <div
                            className={`w-full aspect-square rounded-lg border-4 transition-all ${selectedHex === preset.hex
                                ? 'border-blue-500 scale-105 shadow-lg'
                                : 'border-gray-300 hover:border-blue-400 hover:scale-105'
                                }`}
                            style={{ backgroundColor: preset.hex }}
                        />
                        <p className="text-xs text-gray-600 mt-1 text-center truncate group-hover:text-gray-900">
                            {preset.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
