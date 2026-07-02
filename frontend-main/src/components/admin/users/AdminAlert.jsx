import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

export default function AdminAlert({ message, type, onClose }) {
    if (!message) return null;

    const isError = type === 'error';

    return (
        <div
            className={`${isError ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'} border-l-4 p-4 rounded-lg flex items-start justify-between animate-fade-in shadow-sm`}
            role="alert"
        >
            <div className="flex items-start">
                {isError ? (
                    <FiAlertCircle className="text-red-500 mt-0.5 mr-3 shrink-0" size={20} />
                ) : (
                    <FiCheckCircle className="text-green-500 mt-0.5 mr-3 shrink-0" size={20} />
                )}
                <span className={`${isError ? 'text-red-800' : 'text-green-800'} text-sm font-medium`}>
                    {message}
                </span>
            </div>
            <button
                onClick={onClose}
                className={`${isError ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} ml-4 shrink-0`}
                aria-label="Dismiss alert"
            >
                <FiX size={20} />
            </button>
        </div>
    );
}
