import { FiX } from 'react-icons/fi';

export default function ProductFormModalHeader({ editingProduct, onClose, submitting }) {
    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
                onClick={onClose}
                disabled={submitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
                aria-label="Close modal"
            >
                <FiX size={20} />
            </button>
        </div>
    );
}
