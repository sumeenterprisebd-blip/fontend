import { FiSave } from 'react-icons/fi';

/**
 * SaveButton Component
 * Responsibility: Render save button only
 * Max Lines: 20-80 ✅
 */
export default function SaveButton({ onClick, saving, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={saving || disabled}
            className="w-full text-white px-8 py-4 rounded-xl border-2 border-indigo-500 font-bold text-lg flex items-center justify-center gap-3 shadow-xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 hover:from-indigo-700 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {saving ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                </>
            ) : (
                <>
                    <FiSave size={20} />
                    Save Tracking Codes
                </>
            )}
        </button>
    );
}
