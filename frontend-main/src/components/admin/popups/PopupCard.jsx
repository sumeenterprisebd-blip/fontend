import { HiPlus, HiPencil, HiTrash, HiEye, HiEyeOff } from 'react-icons/hi';

export default function PopupCard({ popup, onEdit, onDelete, onToggleStatus }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${popup.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {popup.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Shows Once</span>
            </div>

            {popup.imageUrl && (
                <div className="relative h-32 bg-gray-100">
                    <img
                        src={popup.imageUrl}
                        alt={popup.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {popup.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {popup.message.replace(/<[^>]*>/g, '')}
                </p>

                {(popup.startDate || popup.endDate) && (
                    <div className="text-xs text-gray-500 mb-4">
                        {popup.startDate && (
                            <div>Start: {new Date(popup.startDate).toLocaleDateString()}</div>
                        )}
                        {popup.endDate && (
                            <div>End: {new Date(popup.endDate).toLocaleDateString()}</div>
                        )}
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => onToggleStatus(popup._id)}
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${popup.isActive
                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        title={popup.isActive ? 'Deactivate' : 'Activate'}
                    >
                        {popup.isActive ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                    </button>
                    <button
                        onClick={() => onEdit(popup)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit"
                    >
                        <HiPencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(popup._id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete"
                    >
                        <HiTrash size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
