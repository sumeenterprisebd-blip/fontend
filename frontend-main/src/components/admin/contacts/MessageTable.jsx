import { HiMail, HiMailOpen, HiTrash, HiEye } from "react-icons/hi";
import { formatDate } from "@/utils/dateFormatter";

export default function MessageTable({
    messages,
    onViewMessage,
    onToggleRead,
    onDeleteClick
}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((message) => (
                        <tr
                            key={message._id}
                            className={`hover:bg-gray-50 transition ${!message.isRead ? "bg-blue-50" : ""
                                }`}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                {message.isRead ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <HiMailOpen className="w-4 h-4 mr-1" />
                                        Read
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <HiMail className="w-4 h-4 mr-1" />
                                        New
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {message.name}
                                </div>
                                {message.phone && (
                                    <div className="text-sm text-gray-500">
                                        {message.phone}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {message.email}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 truncate max-w-xs">
                                    {message.subject || "No subject"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(message.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onViewMessage(message)}
                                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition"
                                        title="View message"
                                    >
                                        <HiEye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onToggleRead(message._id)}
                                        className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition"
                                        title={
                                            message.isRead
                                                ? "Mark as unread"
                                                : "Mark as read"
                                        }
                                    >
                                        {message.isRead ? (
                                            <HiMail className="w-5 h-5" />
                                        ) : (
                                            <HiMailOpen className="w-5 h-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => onDeleteClick(message._id)}
                                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition"
                                        title="Delete message"
                                    >
                                        <HiTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
