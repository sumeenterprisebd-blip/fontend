import { FiX, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

export default function UserDeleteModal({
    user,
    isOpen,
    onClose,
    onConfirm,
    isLoading
}) {
    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-fadeIn"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) { onClose(); } }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-full shadow-lg">
                                <FiAlertCircle className="text-red-600" size={24} />
                            </div>
                            <h2 id="delete-modal-title" className="text-xl font-bold text-gray-900">
                                Confirm Delete
                            </h2>
                        </div>
                        {!isLoading && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                aria-label="Close modal"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>

                    {/* Modal Content */}
                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                            </span>
                            ?
                        </p>
                        <p className="text-sm text-gray-600">
                            This action cannot be undone. All user data will be permanently removed from the system.
                        </p>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <FiTrash2 size={16} />
                                    <span>Delete User</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
