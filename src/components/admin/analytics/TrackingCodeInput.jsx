/**
 * TrackingCodeInput Component
 * Responsibility: Render single tracking code input only
 * Max Lines: 20-80 ✅
 */
export default function TrackingCodeInput({ label, value, onChange, placeholder, format }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} ID
            </label>
            <input
                type="text"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">
                {format}
            </p>
        </div>
    );
}
