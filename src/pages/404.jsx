import Link from 'next/link';
import { HiHome, HiSearch } from 'react-icons/hi';

export default function Custom404() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                </div>

                {/* Search Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 rounded-full p-4">
                        <HiSearch className="w-12 h-12 text-gray-400" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Page Not Found
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                        <HiHome className="w-5 h-5" />
                        Go to Home
                    </Link>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Browse Shop
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-500 mt-8">
                    Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
