import Image from 'next/image';

export default function ReviewInfo({ review }) {
    const userName = review.user
        ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim()
        : 'Anonymous';
    const productName = review.product?.name || 'Unknown Product';
    const productImage = review.product?.images?.[0] || '/logo.jpeg';

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
                <Image
                    src={productImage}
                    alt={productName}
                    width={64}
                    height={64}
                    className="object-cover rounded-md"
                />
                <div>
                    <p className="font-semibold text-black">{productName}</p>
                    <p className="text-sm text-gray-600">by {userName}</p>
                </div>
            </div>
            {review.order && (
                <div className="inline-flex items-center gap-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Verified Purchase
                </div>
            )}
        </div>
    );
}
