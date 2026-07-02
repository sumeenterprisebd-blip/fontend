import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { FiCheck, FiEdit, FiX } from 'react-icons/fi';

export default function ReviewList({ reviews, loading, filteredReviews, getStatusBadge, handleEdit, handleApprove, handleReject, handleDelete }) {
    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading reviews...</p>
            </div>
        );
    }
    if (filteredReviews.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No reviews found</p>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            {filteredReviews.map((review) => {
                const userName = review.user
                    ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim()
                    : 'Anonymous';
                return (
                    <div
                        key={review._id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Product Image */}
                            <div className="w-full lg:w-32 flex-shrink-0">
                                <Image
                                    src={review.product?.images?.[0] || '/logo.jpeg'}
                                    alt={review.product?.name}
                                    className="w-full h-32 object-cover rounded-lg"
                                    width={128}
                                    height={128}
                                />
                            </div>
                            {/* Review Content */}
                            <div className="flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-black">
                                            {review.product?.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">
                                                by {userName}
                                            </span>
                                            {review.order && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                    Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(review.approvalStatus)}`}>
                                        {review.approvalStatus}
                                    </span>
                                </div>
                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`w-5 h-5 ${i < review.rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                {/* Comment */}
                                <p className="text-gray-700 mb-4">{review.comment}</p>
                                {/* Date */}
                                <p className="text-sm text-gray-500 mb-4">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                {/* Actions */}
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEdit(review);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    {review.approvalStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(review._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                                            >
                                                <FiCheck className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(review._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                            >
                                                <FiX className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {review.approvalStatus === 'rejected' && (
                                        <button
                                            onClick={() => handleApprove(review._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                                        >
                                            <FiCheck className="w-4 h-4" />
                                            Approve
                                        </button>
                                    )}
                                    {review.approvalStatus === 'approved' && (
                                        <button
                                            onClick={() => handleReject(review._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                        >
                                            <FiX className="w-4 h-4" />
                                            Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
