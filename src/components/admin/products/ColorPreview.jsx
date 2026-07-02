/**
 * ColorPreview Component
 * Shows preview of the selected color
 */
export default function ColorPreview({ name, hexCode }) {
    return (
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Preview
            </label>
            <div className="flex items-center gap-4">
                <div
                    className="w-24 h-24 rounded-xl border-4 border-white shadow-lg transition-all duration-200"
                    style={{ backgroundColor: hexCode }}
                    title={hexCode}
                />
                <div>
                    <p className="text-lg font-semibold text-gray-900">{name || 'Color Name'}</p>
                    <p className="text-sm text-gray-500 font-mono">{hexCode}</p>
                </div>
            </div>
        </div>
    );
}
