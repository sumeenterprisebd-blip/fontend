/**
 * HeroDesignOptions Component
 * Design controls for hero slide (alignment, opacity, priority)
 */
export default function HeroDesignOptions({ formData, handleChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Text Alignment</label>
                <select
                    name="textAlignment"
                    value={formData.textAlignment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Overlay Opacity (0-100)</label>
                <input
                    type="number"
                    name="overlayOpacity"
                    value={formData.overlayOpacity}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Priority (Higher = First)</label>
                <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    );
}
