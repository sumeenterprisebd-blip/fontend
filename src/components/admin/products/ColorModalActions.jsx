import { FiX, FiPlus, FiCheck } from 'react-icons/fi';

/**
 * ColorModalActions Component
 * Action buttons for color modal
 */
export default function ColorModalActions({ loading, success, onCancel }) {
    return (
        <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95"
                disabled={loading}
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding...</span>
                    </>
                ) : success ? (
                    <>
                        <FiCheck size={18} />
                        <span>Added!</span>
                    </>
                ) : (
                    <>
                        <FiPlus size={18} />
                        <span>Add Color</span>
                    </>
                )}
            </button>
        </div>
    );
}
