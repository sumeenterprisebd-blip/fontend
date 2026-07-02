import { useEffect } from 'react';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { HiCheck } from '@react-icons/all-files/hi/HiCheck';
import { HiExclamationCircle } from '@react-icons/all-files/hi/HiExclamationCircle';
import { HiInformationCircle } from '@react-icons/all-files/hi/HiInformationCircle';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <HiCheck className="w-5 h-5 text-green-600" />,
        error: <FiX className="w-5 h-5 text-red-600" />,
        warning: <HiExclamationCircle className="w-5 h-5 text-yellow-600" />,
        info: <HiInformationCircle className="w-5 h-5 text-blue-600" />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        warning: 'text-yellow-800',
        info: 'text-blue-800'
    };

    return (
        <div
            className={`
        ${bgColors[type]} ${textColors[type]}
        min-w-[300px] max-w-md p-4 rounded-lg border-2 shadow-lg
        flex items-center gap-3
        animate-slide-in-right
      `}
            role="alert"
        >
            <div className="shrink-0">
                {icons[type]}
            </div>
            <p className="flex-1 text-sm font-medium">
                {message}
            </p>
            <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
            >
                <FiX className="w-5 h-5" />
            </button>
        </div>
    );
}
