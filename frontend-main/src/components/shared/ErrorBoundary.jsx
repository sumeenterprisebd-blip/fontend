import React from 'react';
import { HiExclamationCircle } from '@react-icons/all-files/hi/HiExclamationCircle';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Generate unique error ID
        const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Log error details

        // Update state
        this.setState({
            error,
            errorInfo,
            errorId,
        });

        // Optional: Send to error tracking service (e.g., Sentry)
        // sendErrorToService({ errorId, error, errorInfo });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        });

        // Reload the page to recover
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            const isProduction = process.env.NODE_ENV === 'production';

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-100 rounded-full p-4">
                                <HiExclamationCircle className="w-12 h-12 text-red-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Oops! Something went wrong
                        </h1>

                        {/* Message */}
                        <p className="text-gray-600 mb-6">
                            We're sorry for the inconvenience. The page encountered an unexpected error.
                            Please try refreshing the page or go back to the home page.
                        </p>

                        {/* Error ID (for support) */}
                        {this.state.errorId && (
                            <div className="bg-gray-100 rounded-lg p-3 mb-6">
                                <p className="text-xs text-gray-500 mb-1">Error ID (for support):</p>
                                <p className="text-sm font-mono text-gray-700">{this.state.errorId}</p>
                            </div>
                        )}

                        {/* Error Details (Development only) */}
                        {!isProduction && this.state.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                                <p className="text-xs font-semibold text-red-800 mb-2">
                                    Development Mode - Error Details:
                                </p>
                                <pre className="text-xs text-red-700 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Go to Home
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-xs text-gray-500 mt-6">
                            If the problem persists, please contact support with the error ID above.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
