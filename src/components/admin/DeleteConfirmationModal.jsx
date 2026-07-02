import { FiAlertTriangle, FiLoader, FiX } from 'react-icons/fi';

export default function DeleteConfirmationModal({
    isOpen,
    itemName,
    onConfirm,
    onCancel,
    isDeleting = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <FiAlertTriangle className="text-red-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Delete Item</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition"
                        aria-label="Close"
                        disabled={isDeleting}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                    >
                        {isDeleting && <FiLoader className="animate-spin" size={16} />}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
