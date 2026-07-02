import Link from 'next/link';
import { HiHome, HiRefresh } from 'react-icons/hi';

export default function Custom500() {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 500 Illustration */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-red-300">500</h1>
                </div>

                {/* Tools Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 rounded-full p-4">
                        <svg
                            className="w-12 h-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Server Error
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-8">
                    We're fixing something on our end. Please try refreshing the page or come back in a few minutes.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                        <HiRefresh className="w-5 h-5" />
                        Refresh Page
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        <HiHome className="w-5 h-5" />
                        Go to Home
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-500 mt-8">
                    Error persists? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
