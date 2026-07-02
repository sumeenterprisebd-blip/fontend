import { HiTrash } from "react-icons/hi";

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4 animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onCancel();
                }
            }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
                        <HiTrash className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Delete Message
                        </h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this message? This action
                            cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
