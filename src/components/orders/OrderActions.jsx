import Link from 'next/link';

export default function OrderActions({ orderId, trackingId }) {
    const trackingValue = trackingId || orderId;
    return (
        <div className="space-y-3">
            <Link
                href={`/orders/track?id=${trackingValue}`}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                Track Order
            </Link>
            <Link
                href="/orders"
                className="block w-full bg-gray-200 text-gray-700 text-center px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
                Back to Orders
            </Link>
            <Link
                href="/contact"
                className="block w-full border-2 border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
                Need Help?
            </Link>
        </div>
    );
}
