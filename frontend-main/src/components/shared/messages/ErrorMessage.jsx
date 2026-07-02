import { HiCheckCircle } from '@react-icons/all-files/hi/HiCheckCircle';
import { HiExclamationCircle } from '@react-icons/all-files/hi/HiExclamationCircle';
import { HiInformationCircle } from '@react-icons/all-files/hi/HiInformationCircle';
import { HiXCircle } from '@react-icons/all-files/hi/HiXCircle';

/**
 * Unified Error/Success Message Component
 * Types: error, warning, info, success
 */
export default function ErrorMessage({
    type = 'error',
    message,
    title,
    onClose,
    className = ''
}) {
    if (!message && !title) return null;

    const config = {
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: HiXCircle,
            iconColor: 'text-red-600',
            title: title || 'Error',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: HiExclamationCircle,
            iconColor: 'text-yellow-600',
            title: title || 'Warning',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: HiInformationCircle,
            iconColor: 'text-blue-600',
            title: title || 'Info',
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: HiCheckCircle,
            iconColor: 'text-green-600',
            title: title || 'Success',
        },
    };

    const style = config[type] || config.error;
    const Icon = style.icon;

    return (
        <div className={`${style.bg} border ${style.border} rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                    {title && (
                        <h3 className={`text-sm font-semibold ${style.text} mb-1`}>
                            {style.title}
                        </h3>
                    )}
                    <p className={`text-sm ${style.text}`}>
                        {message}
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${style.text} hover:opacity-70 transition-opacity`}
                        aria-label="Close"
                    >
                        <HiXCircle className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
