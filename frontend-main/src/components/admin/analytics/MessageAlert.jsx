import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

/**
 * MessageAlert Component
 * Responsibility: Display success/error message only
 * Max Lines: 20-80 ✅
 */
export default function MessageAlert({ message }) {
    if (!message) return null;

    // Handle both string and object message formats
    const messageText = typeof message === 'string' ? message : message.text;
    const messageType = typeof message === 'string'
        ? (message.toLowerCase().includes('success') ? 'success' : 'error')
        : message.type;

    if (!messageText) return null;

    const isSuccess = messageType === 'success';

    return (
        <div
            className={`flex items-center gap-2 p-4 rounded-lg ${isSuccess
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
                }`}
        >
            {isSuccess ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
            <span className="text-sm font-medium">{messageText}</span>
        </div>
    );
}
