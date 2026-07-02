import { HiX, HiMail, HiMailOpen, HiTrash } from "react-icons/hi";
import { formatDate } from "@/utils/dateFormatter";
import Link from "next/link";

export default function MessageDetailsModal({
    message,
    onClose,
    onToggleRead,
    onDeleteClick
}) {
    if (!message) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4 animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        Message Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        aria-label="Close modal"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-4">
                        {message.isRead ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <HiMailOpen className="w-4 h-4 mr-1" />
                                Read
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                <HiMail className="w-4 h-4 mr-1" />
                                Unread
                            </span>
                        )}
                        <span className="text-sm text-gray-500">
                            Received: {formatDate(message.createdAt)}
                        </span>
                    </div>

                    {/* Sender Information */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">
                                Name
                            </p>
                            <p className="text-gray-900">{message.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">
                                Email
                            </p>
                            <p className="text-gray-900">{message.email}</p>
                        </div>
                        {message.phone && (
                            <div>
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                    Phone
                                </p>
                                <p className="text-gray-900">{message.phone}</p>
                            </div>
                        )}
                        {message.subject && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600 font-medium mb-1">
                                    Subject
                                </p>
                                <p className="text-gray-900">{message.subject}</p>
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">
                            Message
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 whitespace-pre-wrap">
                                {message.message}
                            </p>
                        </div>
                    </div>

                    {message.readAt && (
                        <div className="text-sm text-gray-500">
                            Read at: {formatDate(message.readAt)}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-between items-center p-6 border-t bg-gray-50 sticky bottom-0">
                    <button
                        onClick={() => onToggleRead(message._id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95"
                    >
                        {message.isRead ? (
                            <>
                                <HiMail className="w-5 h-5" />
                                Mark as Unread
                            </>
                        ) : (
                            <>
                                <HiMailOpen className="w-5 h-5" />
                                Mark as Read
                            </>
                        )}
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDeleteClick(message._id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95"
                        >
                            <HiTrash className="w-5 h-5" />
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:shadow-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 active:scale-95"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
