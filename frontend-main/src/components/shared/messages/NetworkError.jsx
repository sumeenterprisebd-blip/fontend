/**
 * Network Error Component
 */
export function NetworkError({ onRetry, message }) {
    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-orange-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Network Issue
            </h3>
            <p className="text-gray-600 mb-4">
                {message || 'Please check your internet connection and try again.'}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
