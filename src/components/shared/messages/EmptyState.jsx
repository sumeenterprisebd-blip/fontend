/**
 * Empty State Component
 */
export function EmptyState({
    icon: Icon,
    title,
    message,
    action,
    actionText = 'Get Started',
    className = ''
}) {
    return (
        <div className={`text-center py-12 ${className}`}>
            {Icon && (
                <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 rounded-full p-4">
                        <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {message}
            </p>
            {action && (
                <button
                    onClick={action}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
